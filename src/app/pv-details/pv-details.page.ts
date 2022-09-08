import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../services/common.service";

@Component({
  selector: "app-pv-details",
  templateUrl: "./pv-details.page.html",
  styleUrls: ["./pv-details.page.scss"],
})
export class PvDetailsPage {
  subsidySchemeId: any;
  applicationId: any;
  farmerNameHnd: any;
  roleId: any;
  userid: any;
  userTab: any = "Action";
  getPreVeficationDetailsByAppIdData: any;

  imgData: any = "";
  url: any = "http://www.africau.edu/images/default/sample.pdf";

  imgFarmerWithOfficer: any;
  imgSignedMap: any;
  imgSourceOfIrrigation: any;
  notAcceptanceDocPath: any;

  preVerificationChecklistData: any;

  farmerName: any;
  village: any;
  district: any;
  creationDate: any;
  block: any;
  schemeName: any;
  farmerNameH: any;
  villageH: any;
  districtH: any;
  blockH: any;
  schemeNameH: any;

  mobileNo: any;
  caste: any;
  subCaste: any;
  fatherName: any;
  FarmerPhoto: any;

  ssoID: any;

  latitude: any = "";
  longitude: any = "";

  farmerKhasraNo: any;
  isFarmerAcceptancees: any;
  notAcceptanceDocPathRow: any;
  khasraNo: any;
  constructor(
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    public alertCtrl: AlertController,
    private route: ActivatedRoute,
    public httpClient: CommonService
  ) {
    this.applicationId = this.route.snapshot.paramMap.get("applicationId");
    console.log("this.applicationId", this.applicationId);
    this.subsidySchemeId = this.route.snapshot.paramMap.get("subsidySchemeId");
    console.log("this.subsidySchemeId", this.subsidySchemeId);
    this.getPreVeficationDetailsByAppId(
      this.applicationId,
      this.subsidySchemeId
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PvDetailsPage");
  }

  getPreVeficationDetailsByAppId(applicationId, subsidySchemeId) {
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "GetPreVeficationDetailsByAppId",
        srvparam:
          "{'ApplicationId':'" +
          applicationId +
          "','SubsidySchemeId':'" +
          subsidySchemeId +
          "'}",
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getPreVeficationDetailsByAppIdData = res[0].data[0];
          self.preVerificationChecklistData = res[0].checklistdata;
          self.farmerName = self.getPreVeficationDetailsByAppIdData.FarmerName;
          self.village = self.getPreVeficationDetailsByAppIdData.Village_Eng;
          self.district = self.getPreVeficationDetailsByAppIdData.DISTRICT_ENG;
          self.block = self.getPreVeficationDetailsByAppIdData.BLOCK_ENG;
          self.schemeName =
            self.getPreVeficationDetailsByAppIdData.SchemeNameEng;

          if (self.getPreVeficationDetailsByAppIdData.FarmerNameHnd == "") {
            self.farmerNameH =
              self.getPreVeficationDetailsByAppIdData.FarmerName;
          } else {
            self.farmerNameH =
              self.getPreVeficationDetailsByAppIdData.FarmerNameHnd;
          }
          self.villageH =
            self.getPreVeficationDetailsByAppIdData.Village_Mangal;
          self.districtH =
            self.getPreVeficationDetailsByAppIdData.DISTRICT_MANGAL;
          self.blockH = self.getPreVeficationDetailsByAppIdData.BLOCK_MANGAL;
          self.schemeNameH =
            self.getPreVeficationDetailsByAppIdData.SchemeNameHindi;

          self.mobileNo = self.getPreVeficationDetailsByAppIdData.MobileNo;
          self.caste = self.getPreVeficationDetailsByAppIdData.Caste;
          self.subCaste = self.getPreVeficationDetailsByAppIdData.SubCaste;
          self.creationDate =
            self.getPreVeficationDetailsByAppIdData.CreationDate;
          self.fatherName = self.getPreVeficationDetailsByAppIdData.FatherName;
          self.FarmerPhoto=self.getPreVeficationDetailsByAppIdData.FarmerPhoto;
          // self.applicationId = self.getPreVeficationDetailsByAppIdData.ApplicationId;
          if (res[0].data[0].FarmerNameHnd == "") {
            self.farmerNameHnd = res[0].data[0].FarmerName;
          } else {
            self.farmerNameHnd = res[0].data[0].FarmerNameHnd;
          }
          self.imgFarmerWithOfficer =
            self.getPreVeficationDetailsByAppIdData.ImgFarmerWithOfficer;
          self.imgSignedMap =
            self.getPreVeficationDetailsByAppIdData.ImgSignedMap;
          self.farmerKhasraNo =
            self.getPreVeficationDetailsByAppIdData.FarmerKhasraNo;
          self.imgSourceOfIrrigation =
            self.getPreVeficationDetailsByAppIdData.ImgSourceOfIrrigation;
          self.isFarmerAcceptancees =
            self.getPreVeficationDetailsByAppIdData.IsFarmerAcceptancees;
          console.log("this.isFarmerAcceptancees", self.isFarmerAcceptancees);

          if (
            self.isFarmerAcceptancees == "Yes" ||
            self.isFarmerAcceptancees == ""
          ) {
            self.notAcceptanceDocPathRow = true;
          } else {
            self.notAcceptanceDocPathRow = false;
          }
          self.khasraNo = self.getPreVeficationDetailsByAppIdData.KhasraNo;
          self.notAcceptanceDocPath =
            self.getPreVeficationDetailsByAppIdData.NotAcceptanceDocPath;
        } else {
          if (res[0].data == "") {
            self.showPrompt(res[0].message);
          } else {
            self.showPrompt(res[0].data);
          }
          // self.httpClient.dismissLoadingImage();
        }
        // self.httpClient.showToast(res[0].message);
        self.httpClient.dismissLoadingImage();

        // self.httpClient.showToast(res.message);
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
            srvmethodnm: "GetPreVeficationDetailsByAppId",
            srvparam:
              "{'ApplicationId':'" +
              applicationId +
              "','SubsidySchemeId':'" +
              subsidySchemeId +
              "'}",
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  getExtensionJama() {
    var fileName = this.getPreVeficationDetailsByAppIdData.ImgJamabandi;
    // var fileName = this.url;

    var extension = fileName.split(".").pop();

    console.log(extension, extension === "jpg", "png");
    window.open(fileName, "_system");
  }

  getExtensionNazaria() {
    var fileName = this.getPreVeficationDetailsByAppIdData.ImgNazariaNaksha;
    // var fileName = this.url;

    var extension = fileName.split(".").pop();

    console.log(extension, extension === "jpg", "png");
    window.open(fileName, "_system");
  }
  showImageDom(img) {
    console.log("showImageDom clicked", img);

    this.photoViewer.show(img);
    // this.displayImage = this.sanitizer.bypassSecurityTrustUrl( img);
    // window.open(this.displayImage, '_system');
  }
  async showPrompt(msg) {
    if (this.httpClient.currentLanguage == "hindi") {
      const prompt = await this.alertCtrl.create({
        header: "अलर्ट!",
        message: msg,
        backdropDismiss: false,
        buttons: [
          {
            text: "ठीक है",
            handler: (data) => {
              console.log("Ok clicked");
              this.navCtrl.pop();
            },
          },
        ],
      });
      await prompt.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: "Alert!",
        message: msg,
        backdropDismiss: false,
        buttons: [
          {
            text: "OK",
            handler: (data) => {
              console.log("Ok clicked");
              this.navCtrl.pop();
            },
          },
        ],
      });
      await alert.present();
    }
  }
}
