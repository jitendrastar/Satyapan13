import { Component, OnInit } from "@angular/core";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-post-verification-pending-list",
  templateUrl: "./post-verification-pending-list.page.html",
  styleUrls: ["./post-verification-pending-list.page.scss"],
})
export class PostVerificationPendingListPage {
  getPostVerificationNotificationListData: any;
  roleId: any;
  userid: any;
  farmerNameHnd: any;
  flag: any;
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    public router: Router,
    public httpClient: CommonService,
    public alertCtrl: AlertController,
    public platform: Platform,
    public route: ActivatedRoute
  ) {
    // this.platform.registerBackButtonAction(() => {
    //   //your desired action here
    //   console.log("viewCtrl.dismiss");
    //   this.viewCtrl.dismiss();
    // });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PostVerificationPendingListPage");
  }
  getPostVerificationCompleneList(roleId, userid) {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PostVerification",
        srvmethodnm: "PostVerificationCompletedList",
        srvparam: JSON.stringify({
          userid: userid,
          SubsidySchemeId: "0",
          RoleId: roleId,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getPostVerificationNotificationListData = res[0].data;
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
              srvnm: "PostVerification",
              srvmethodnm: "PostVerificationCompletedList",
              srvparam: JSON.stringify({
                userid: userid,
                SubsidySchemeId: "0",
                RoleId: roleId,
              }),
          }
      };
      console.log('errorRequestData new', errorRequestData);
      self.httpClient.getErrorMobileLogs(errorRequestData);
      self.httpClient.showToastError();
      }
    );
  }
  ionViewWillEnter() {
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;
    this.flag = this.route.snapshot.paramMap.get("flag");
    if (this.flag == "pending") {
      this.getPostVerificationNotificationList(this.roleId, this.userid);
    } else {
      this.getPostVerificationCompleneList(this.roleId, this.userid);
    }
  }

  getPostVerificationNotificationList(roleId, userid) {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "i75Q7Q6nYgW3rgEitGndNA==",
        srvnm: "PostVerification",
        srvmethodnm: "GetPostVerificationNotificationList",
        srvparam: JSON.stringify({
          RoleId: roleId,
          UserId: userid,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getPostVerificationNotificationListData = res[0].data;
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
              srvnm: "PostVerification",
              srvmethodnm: "GetPostVerificationNotificationList",
              srvparam: JSON.stringify({
                RoleId: roleId,
                UserId: userid,
              }),
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

  gotoPostVerificationShowDetailsConfirmationPage(data) {
    // data.ApplicationId,data.SubsidySchemeId
    console.log(
      "FarmPondApplicationId, SubsidySchemeId",
      data.SubSidySchemeId,
      data
    );
    // SubsidySchemeId
    // SubSidySchemeId
    this.router.navigate([
      "post-verification-show-details-confirmation",
      {
        FarmPondApplicationId: data.ApplicationId,
        SubsidySchemeId: data.SubsidySchemeId,
        flag: this.flag,
      },
    ]);
  }
}
