import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CommonService} from "../services/common.service";

import {Camera, CameraOptions} from "@ionic-native/camera/ngx";

import {DomSanitizer} from "@angular/platform-browser";

import {File} from "@ionic-native/file/ngx";
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import {
    AlertController,
    ModalController,
    NavController,
    NavParams,
    ActionSheetController,
} from "@ionic/angular";

@Component({
    selector: "app-bill-model-farm-implement",
    templateUrl: "./bill-model-farm-implement.page.html",
    styleUrls: ["./bill-model-farm-implement.page.scss"],
})
export class BillModelFarmImplementPage implements OnInit {
    billDetails: any = {BillNo: "", BillAmount: "", BillImg: "", BillDate: ""};
    displayImage: any;
    fileTransfer: FileTransferObject;
    minDate: any;
    upcomingDate: any;

    constructor(
        private navparams: NavParams,
        private transfer: FileTransfer,
        private file: File,
        private sanitizer: DomSanitizer,
        private camera: Camera,
        public actionSheetController: ActionSheetController,
        public modalCtrl: ModalController,
        public httpClient: CommonService
    ) {
        this.fileTransfer = this.transfer.create();
        this.upcomingDate = this.navparams.get("asDate");
        if (this.upcomingDate != null) {
            console.log("this.upcomingDate", this.upcomingDate);
            this.minDate = new Date(this.upcomingDate).toISOString();
            console.log("this.minDate", this.minDate);
        } else {
            this.minDate = new Date("01-01-1970").toISOString();
        }
    }

    ngOnInit() {
    }

    closeModel() {
        this.modalCtrl.dismiss(null);
    }

    async takePhoto() {
        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                // this.billDetails.BillImg = imageData;

                // Upload Bill Details


                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        AppName: "PVapp",
                        IsDirectUpload: "True",
                    },
                };
                if (this.httpClient.isOffline) {
                    this.billDetails.BillImg = imageData;
                    this.billDetails.options = options;
                    this.displayImage = (<any>window).Ionic.WebView.convertFileSrc(imageData);
                } else {
                    console.log("options.params", options.params);
                    this.httpClient.showLoading();
                    this.fileTransfer
                        .upload(imageData, this.httpClient.imageUploadUrl, options)
                        .then(
                            (data) => {
                                console.log("data", data);
                                this.httpClient.dismissLoading();
                                // success
                                var temp = JSON.parse(data.response);
                                this.displayImage = this.billDetails.BillImg = temp[0].data;
                            },
                            (err) => {
                                // error
                                this.httpClient.dismissLoading();
                                this.httpClient.showToastError();
                            }
                        );

                    console.log("this.displayImage", this.displayImage);
                }

            },
            (err) => {
                // Handle error
            }
        );
    }

    submit() {
        if (this.billDetails.BillAmount == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल राशि दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the bill amount first");
            }
        } else if (this.billDetails.BillNo == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल क्रमांक दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the bill number first");
            }
        } else if (this.billDetails.BillImg == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल की फोटो लें");
            } else {
                this.httpClient.showToast("Please take the bill photo");
            }
        } else if (this.billDetails.BillDate == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल की दिनांक दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the date of bill");
            }
        } else {
            this.billDetails.displayImage = this.displayImage;
            this.modalCtrl.dismiss({enteredBillDetails: this.billDetails});
        }
    }
}
