import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-verification-done-by",
  templateUrl: "./verification-done-by.page.html",
  styleUrls: ["./verification-done-by.page.scss"],
})
export class VerificationDoneByPage {
  userTab: any = "2";
  noRecord: any = false;
  roleId: any;
  userid: any;
  getPVDetailsforMobileData: any;
  farmerNameHnd: any;
  constructor(
    public navCtrl: NavController,
    public router: Router,
    public alertCtrl: AlertController,
    private storage: Storage,
    public httpClient: CommonService
  ) { }

  ionViewDidLoad() {
    console.log("ionViewDidLoad VarificationdonebyPage");
  }
  ionViewWillEnter() {
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;
    this.getPVDetailsforMobile(this.userid, this.userTab);

    /* this.storage.get('roleId').then(res => {
      this.roleId = res;
      console.log("this.roleId--2",this.roleId);
    });
    this.storage.get('userid').then(res => {
      this.userid = res;
      console.log("this.userid--2",this.userid);
      // this.getPVDetailsforMobile(this.userid,this.userTab);
    });*/
  }
  getPVDetailsforMobile(userid, flag) {
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "GetPVDetailsforMobile",
        srvparam: "{'userid':'" + userid + "', 'Flag':'" + flag + "'}",
      },
    };
    console.log("flag---> ", flag);

    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getPVDetailsforMobileData = res[0].data;
          // if( res[0].data[0].FarmerNameHnd==""){
          //   self.farmerNameHnd =  res[0].data[0].FarmerName;
          // }else
          // {
          //   self.farmerNameHnd =  res[0].data[0].FarmerNameHnd;
          //
          // }
        } else {
          // self.noRecord=true;
          self.getPVDetailsforMobileData = [];
          self.httpClient.showToast(res[0].message);

          // if (res[0].data == "") {
          //   self.showPrompt(res[0].message);
          //
          // } else {
          //   self.showPrompt(res[0].data);
          // }
        }
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
            srvmethodnm: "GetPVDetailsforMobile",
            srvparam: "{'userid':'" + userid + "', 'Flag':'" + flag + "'}",
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

  gotoPVDetails(applicationId, subsidySchemeId) {
    this.router.navigate([
      "pv-details",
      { applicationId: applicationId, subsidySchemeId: subsidySchemeId },
    ]);
  }

  valueForPVDone(ev) {
    this.userid = this.httpClient.userData.userid;
    this.getPVDetailsforMobile(this.userid, ev.value);
  }

  tabClick(val) {
    this.userid = this.httpClient.userData.userid;
    this.getPVDetailsforMobile(this.userid, val.detail.value);
  }
}
