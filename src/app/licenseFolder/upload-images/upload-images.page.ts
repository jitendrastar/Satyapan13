import { CommonService } from "../../services/common.service";
// import { CommonService } from 'src/app/services/common.service';
import { Component, OnInit } from "@angular/core";
// import { CommonService } from "../services/common.service";

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

@Component({
  selector: "app-upload-images",
  templateUrl: "./upload-images.page.html",
  styleUrls: ["./upload-images.page.scss"],
})
export class UploadImagesPage implements OnInit {
  fileTransfer: FileTransferObject;
  licenseId: any;
  applicationType: any;
  innerPhoto: any;
  outerPhoto: any;
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
    this.licenseId = this.navparams.get("licenseId");
    this.applicationType = this.navparams.get("AppType");
  }
  closeModel() {
    this.modalCtrl.dismiss(null);
  }
  takePhotos(param) {
    this.camera.getPicture(this.httpClient.options).then(
      (imageData) => {
        this.httpClient.showLoading();
        var tableName
        var uniqueidcolumnname
        if(this.applicationType=='Amendment')
        {
          tableName='LicenseAddressAmendment';
            uniqueidcolumnname='LicenseAddressAmendmentId';
        }else{
          tableName='LicenseAddress';
            uniqueidcolumnname='LicenseAddressId';

        }
        let options: FileUploadOptions = {
          fileKey: "files",
          params: {
            AppName: "PVapp",
            tableName: tableName,
            columnName: "PVFilePath",
            uniqueidcolumnname: uniqueidcolumnname,
            id: this.licenseId,
            IsDirectUpload: "False",
          },
        };
        console.log("options params rs ", options.params);
        this.fileTransfer
          .upload(imageData, this.httpClient.imageUploadUrl, options)
          .then(
            (data) => {
              this.httpClient.dismissLoading();
              // success
              var temp = JSON.parse(data.response);
              console.log("temp", temp);
              if (temp[0].status == "0") {
                if (param == 1) {
                  this.innerPhoto = temp[0].data[0].URL;
                } else {
                  this.outerPhoto = temp[0].data[0].URL;
                }
              } else {
                this.httpClient.showToast(temp[0].message);
              }
            },
            (err) => {
              // error
              this.httpClient.dismissLoading();
              console.log("err", err);
            }
          );
      },
      (err) => {
        // Handle error
      }
    );
  }
  submit() {
    this.modalCtrl.dismiss({
      innerPhoto: this.innerPhoto,
      outerPhoto: this.outerPhoto,
    });
  }
  ngOnInit() {}
}
