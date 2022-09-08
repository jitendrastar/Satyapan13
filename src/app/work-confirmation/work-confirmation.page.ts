import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-work-confirmation",
  templateUrl: "./work-confirmation.page.html",
  styleUrls: ["./work-confirmation.page.scss"],
})
export class WorkConfirmationPage {
  farmerPhoto: any;
  farmerName: any;
  schemeName: any;
  applicationNo: any;
  mobileNo: any;
  fatherName: any;
  caste: any;
  subCaste: any;
  khasraNo: any;
  totalLandArea: any;
  farmCategory: any;
  isSprinkler: any;
  farmPondCategory: any;
  creationDate: any;
  farmerNameH: any;
  statusAssignPending: any;
  assignedToNameEn: any;
  assignedToNameHi: any;
  applicationId: any;

  getAsListData: any;

  asListId: any;
  asName: any;
  asNameHi: any;

  village: any;
  district: any;
  block: any;
  villageH: any;
  districtH: any;
  blockH: any;
  schemeNameH: any;
  roleId: any;
  userid: any;
  subsidySchemeId: any;
  farmPondApplicationId: any;
  objConfirm: any;
  getConstructionWorkConfirmBySupervisorData: any;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public alertCtrl: AlertController,
    public httpClient: CommonService,
    public route: ActivatedRoute
  ) {
    this.objConfirm = JSON.parse(
      this.route.snapshot.paramMap.get("objConfirm")
    );

    // this.objConfirm = this.navParams.get('objConfirm');
    console.log("obj", this.objConfirm);
    this.applicationId = this.objConfirm.ApplicationId;
    this.subsidySchemeId = this.objConfirm.SubsidySchemeId;
    // this.farmPondApplicationId = this.objConfirm.FarmPondApplicationId;
    // this.farmerName = this.objConfirm.FarmerName;
    this.farmerName = this.objConfirm.FarmerName;

    this.schemeName = this.objConfirm.SchemeNameEng;
    this.khasraNo = this.objConfirm.KhasraNo;
    this.totalLandArea = this.objConfirm.TotalLandArea;
    this.farmCategory = this.objConfirm.FarmCategory;
    this.isSprinkler = this.objConfirm.IsSprinkler;
    this.farmPondCategory = this.objConfirm.Category;
    // this.farmPondCategory = this.objConfirm.FarmerCost;
    // this.farmPondCategory = this.objConfirm.FarmPondCategory;

    this.village = this.objConfirm.Village_Eng;
    this.district = this.objConfirm.DISTRICT_ENG;
    this.block = this.objConfirm.BLOCK_ENG;

    if (this.objConfirm.FarmerNameHnd == "") {
      this.farmerNameH = this.objConfirm.FarmerName;
    } else {
      this.farmerNameH = this.objConfirm.FarmerNameHnd;
    }

    this.villageH = this.objConfirm.Village_Mangal;
    this.districtH = this.objConfirm.DISTRICT_MANGAL;
    this.blockH = this.objConfirm.BLOCK_MANGAL;
    this.schemeNameH = this.objConfirm.SchemeNameHnd;
    this.mobileNo = this.objConfirm.MobileNo;
    this.caste = this.objConfirm.Caste;
    this.subCaste = this.objConfirm.SubCaste;
    this.creationDate = this.objConfirm.CreationDate;
    this.fatherName = this.objConfirm.FatherName;
    this.farmerPhoto = this.objConfirm.FarmerPhoto;
    this.applicationNo = this.objConfirm.ApplicationNo;
    this.statusAssignPending = this.objConfirm.Status;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WorkConfirmationPage");
  }

  ionViewWillEnter() {
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;
  }

  submitConstructionWorkConfirmBySupervisor() {
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;

    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "ConstructionWorkConfirmBySupervisor",
        srvparam:
          "{'userid':'" +
          this.userid +
          "','roleid':'" +
          this.roleId +
          "','ApplicationId':'" +
          this.applicationId +
          "','SubsidySchemeId':'" +
          this.subsidySchemeId +
          "'}",
      },
    };

    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          if (self.httpClient.currentLanguage == "hindi") {
            self.showPrompt("सफलतापूर्वक जमा किया गया।");
          } else {
            self.showPrompt(res[0].message);
          }
        } else {
          if (res[0].data == "") {
            self.showPrompt(res[0].message);
          } else {
            self.showPrompt(res[0].data);
          }
        }
        // self.httpClient.showToast(res.message);
        self.httpClient.dismissLoading();
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
            srvmethodnm: "ConstructionWorkConfirmBySupervisor",
            srvparam:
              "{'userid':'" +
              self.userid +
              "','roleid':'" +
              self.roleId +
              "','ApplicationId':'" +
              self.applicationId +
              "','SubsidySchemeId':'" +
              self.subsidySchemeId +
              "'}",
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
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
  async confirmationPrompt(msg) {
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
              this.submitConstructionWorkConfirmBySupervisor();
            },
          },
          {
            text: "निरस्त करें ",
            handler: (data) => {
              console.log("Ok clicked");
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
              this.submitConstructionWorkConfirmBySupervisor();
            },
          },
          {
            text: "Cancel",
            handler: (data) => {
              console.log("Cancel clicked");
            },
          },
        ],
      });
      await alert.present();
    }
  }
}
