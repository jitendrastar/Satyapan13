import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { Router } from "@angular/router";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-pv-complete",
  templateUrl: "./pv-complete.page.html",
  styleUrls: ["./pv-complete.page.scss"],
})
export class PvCompletePage {
  getPVDetailsforMobileData: any;
  farmerNameHnd: any;
  roleId: any;
  userid: any;
  constructor(
    public navCtrl: NavController,
    public router: Router,
    public alertCtrl: AlertController,
    private storage: Storage,
    public httpClient: CommonService
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad PvcompletePage");
  }
  ionViewWillEnter() {
      this.roleId = this.httpClient.userData.roleid;
      this.userid = this.httpClient.userData.userid;
      console.log("this.roleId----1", this.roleId);
      console.log("this.userid-----1", this.userid);
      this.getPVDetailsforMobile(this.userid, "3");
   
  }
  gotoPVDetails(applicationId, subsidySchemeId) {
    this.router.navigate([
      "pv-details",
      { applicationId: applicationId, subsidySchemeId: subsidySchemeId },
    ]);
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
          if (res[0].data == "") {
            self.showPrompt(res[0].message);
          } else {
            self.showPrompt(res[0].data);
          }
        }
        self.httpClient.dismissLoadingImage();

        // self.httpClient.showToast(res.message);
        // self.httpClient.dismissLoading();
      },
      (error) => {
        self.httpClient.dismissLoading();
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
}
