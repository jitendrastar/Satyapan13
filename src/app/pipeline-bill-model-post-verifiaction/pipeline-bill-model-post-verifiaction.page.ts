import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../services/common.service";
import {
  ModalController,
  NavParams,
  ActionSheetController,
} from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-pipeline-bill-model-post-verifiaction",
  templateUrl: "./pipeline-bill-model-post-verifiaction.page.html",
  styleUrls: ["./pipeline-bill-model-post-verifiaction.page.scss"],
})
export class PipelineBillModelPostVerifiactionPage implements OnInit {
  billDetails: any = { BillNo: "", BillAmount: "", BillImg: "", BillDate: "" };
  displayImage: any;
  constructor(
    private sanitizer: DomSanitizer,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    public modalCtrl: ModalController,
    public httpClient: CommonService
  ) {}

  ngOnInit() {}
  closeModel() {
    this.modalCtrl.dismiss(null);
  }
  async takePhoto() {
    this.camera.getPicture(this.httpClient.options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.billDetails.BillImg = "data:image/jpeg;base64," + imageData;
        this.displayImage = this.sanitizer.bypassSecurityTrustUrl(
          "data:image/jpeg;base64," + imageData
        );
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
        this.httpClient.showToast("कृपया बिल तारीख दर्ज करें");
      } else {
        this.httpClient.showToast("Please select the bill date");
      }
    } else {
      this.billDetails.displayImage = this.displayImage;
      this.modalCtrl.dismiss({ enteredBillDetails: this.billDetails });
      console.log("enteredBillDetails", this.billDetails);
    }
  }
}
