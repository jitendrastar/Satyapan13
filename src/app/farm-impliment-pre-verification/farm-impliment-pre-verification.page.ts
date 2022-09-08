import { Component, OnInit, NgZone } from "@angular/core";
import { CommonService } from "../services/common.service";
import {
  AlertController,
  NavController,
  ActionSheetController,
  Platform,
} from "@ionic/angular";
import { DatabaseServiceService } from "../services/database-service.service";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ActivatedRoute } from "@angular/router";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { FileTransferObject } from "@ionic-native/file-transfer/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  Downloader,
  NotificationVisibility,
  DownloadRequest,
} from "@ionic-native/downloader/ngx";
@Component({
  selector: "app-farm-impliment-pre-verification",
  templateUrl: "./farm-impliment-pre-verification.page.html",
  styleUrls: ["./farm-impliment-pre-verification.page.scss"],
})
export class FarmImplimentPreVerificationPage implements OnInit {
  getPreVerificationData: any;
  khasraNo: any;
  preVerificationId: any;
  selectedGrant: any;
  selectedYear: any = "";

  constructor(
    public fileOpener: FileOpener,
    private downloader: Downloader,
    public dbService: DatabaseServiceService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public geolocation: Geolocation,
    public route: ActivatedRoute,
    public httpClient: CommonService,
    public alertController: AlertController
  ) {
    this.getPreVerificationData = JSON.parse(
      this.route.snapshot.paramMap.get("obj")
    );
    this.khasraNo = this.getPreVerificationData.KhasraNo;
    this.preVerificationId = this.getPreVerificationData.PreVerificationId;
    console.log("this.getPreVerificationData", this.getPreVerificationData);
  }

  ngOnInit() {}
  submitFinal() {
    if (this.selectedGrant == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast("कृपया अनुदान ले चुका है का चयन करें ");
      } else {
        this.httpClient.showToast("Please select the grant you have received");
      }
    } else if (this.selectedGrant == "Yes" && this.selectedYear == "") {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast("कृपया वर्ष दर्ज करें");
      } else {
        this.httpClient.showToast("Please enter the year");
      }
    } else {
      var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (format.test(this.selectedYear)) {
        this.httpClient.showToast("Please enter the valid year");
      } else {
        var self = this;
        self.httpClient.showLoading();
        var sendRequestData = {
          obj: {
            usrnm: "rajkisan",
            psw: "rajkisan@123",
            srvnm: "PreVerification",
            srvmethodnm: "AddPreverificationBasicData",
            srvparam: JSON.stringify({
              ApplicationId: this.getPreVerificationData.ApplicationId,
              roleid: self.httpClient.userData.roleid,
              userid: self.httpClient.userData.userid,
              schemeid: this.getPreVerificationData.SubsidySchemeId,
              AppVersion: this.httpClient.currentAppVersion,
              IsOnline_Offline: 0,
              mobilToVerify: "",
              IsSubsidyAlreadyTaken: this.selectedGrant,
              Year: this.selectedYear,
            }),
          },
        };

        this.httpClient.post(sendRequestData).subscribe(
          function (res: any) {
            console.log("res", res);

            self.httpClient.dismissLoading();
            if (res[0].status == 0) {
              self.successAlertFinalSubmission();
            } else {
              self.httpClient.showToast(res[0].data);
            }
            // self.httpClient.(res[0].message);
            // self.httpClient.dismissLoading();
          },
          (error) => {
            // self.httpClient.dismissLoading();
            var errorRequestData = {
              'obj': {
                'usrnm': 'rajkisan',
                'psw': 'rajkisan@123',
                srvresponce: error,
                userid: self.httpClient.userData.userid,
                srvnm: "PreVerification",
                srvmethodnm: "AddPreverificationBasicData",
                srvparam: JSON.stringify({
                  ApplicationId: self.getPreVerificationData.ApplicationId,
                  roleid: self.httpClient.userData.roleid,
                  userid: self.httpClient.userData.userid,
                  schemeid: self.getPreVerificationData.SubsidySchemeId,
                  AppVersion: self.httpClient.currentAppVersion,
                  IsOnline_Offline: 0,
                  mobilToVerify: "",
                  IsSubsidyAlreadyTaken: self.selectedGrant,
                  Year: self.selectedYear,
                }),
              }
            };
            console.log('errorRequestData new', errorRequestData);
            self.httpClient.getErrorMobileLogs(errorRequestData);
            self.httpClient.showToastError();           }
        );
      }
    }
  }
  async successAlertFinalSubmission() {
    if (this.httpClient.currentLanguage == "english") {
      const alert = await this.alertController.create({
        header: "Alert",
        subHeader: "Successfully Submitted.",
        backdropDismiss: false,
        buttons: [
          {
            text: "Okay",
            handler: () => {
              this.navCtrl.pop();
            },
          },
        ],
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: "Alert",
        subHeader: "सफलतापूर्वक जमा किया गया | ",
        backdropDismiss: false,
        buttons: [
          {
            text: "ओके ",
            handler: () => {
              this.navCtrl.pop();
            },
          },
        ],
      });

      await alert.present();
    }
  }
}
