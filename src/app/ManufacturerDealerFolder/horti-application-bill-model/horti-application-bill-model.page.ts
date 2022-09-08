import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

import { DomSanitizer } from "@angular/platform-browser";

import { File } from "@ionic-native/file/ngx";
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
import { CommonService } from "../../services/common.service";
@Component({
  selector: "app-horti-application-bill-model",
  templateUrl: "./horti-application-bill-model.page.html",
  styleUrls: ["./horti-application-bill-model.page.scss"],
})
export class HortiApplicationBillModelPage implements OnInit {
  billDetails: any = { BillNo: "", BillAmount: "", BillImg: "", BillDate: "" };
  displayImage: any;
  fileTransfer: any;
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
  }

  ngOnInit() { }
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
        console.log("options.params", options.params);
        if (this.httpClient.isOffline) {
          this.billDetails.BillImg = imageData;
          this.billDetails.options = options;
          this.displayImage = (<any>window).Ionic.WebView.convertFileSrc(imageData);
        } else {
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
        }

        console.log("this.displayImage", this.displayImage);
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
        this.httpClient.showToast("कृपया बिल फोटो लें");
      } else {
        this.httpClient.showToast("Please take the bill photo");
      }
    } else if (this.billDetails.BillDate == "") {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast("कृपया बिल दिनांक दर्ज करें");
      } else {
        this.httpClient.showToast("Please select the bill date");
      }
    } else {
      this.billDetails.displayImage = this.displayImage;
      this.modalCtrl.dismiss({ enteredBillDetails: this.billDetails });
    }
  }
}
