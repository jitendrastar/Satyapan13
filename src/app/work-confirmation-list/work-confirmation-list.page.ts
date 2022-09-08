import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { CommonService } from "../services/common.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-work-confirmation-list",
  templateUrl: "./work-confirmation-list.page.html",
  styleUrls: ["./work-confirmation-list.page.scss"],
})
export class WorkConfirmationListPage {
  getGetApplicationToWorkConfirmData: any;
  roleId: any;
  userid: any;
  farmerNameHnd: any;
  methodName: any;

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public router: Router,
    public alertCtrl: AlertController,
    public httpClient: CommonService
  ) {
    this.methodName = this.route.snapshot.paramMap.get('methodName')
    console.log('this.methodname', this.methodName);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad WorkConfirmationListPage");
  }

  ionViewWillEnter() {
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;
    this.getGetApplicationToWorkConfirm(this.roleId, this.userid);

    /*this.storage.get('roleId').then(res => {
          this.roleId = res;
          console.log("this.roleId--2", this.roleId);

        });
        this.storage.get('userid').then(res => {
          this.userid = res;
          console.log("this.userid--2", this.userid);


        });*/
  }

  getGetApplicationToWorkConfirm(roleId, userid) {
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: this.methodName,
        srvparam: JSON.stringify({
          userId: userid,
          roleId: roleId,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getGetApplicationToWorkConfirmData = res[0].data;
          console.log(
            "self.getGetApplicationToWorkConfirmData",
            self.getGetApplicationToWorkConfirmData
          );
          // if (res[0].data[0].FarmerNameHnd == "") {
          //   self.farmerNameHnd = res[0].data[0].FarmerName;
          // } else {
          //   self.farmerNameHnd = res[0].data[0].FarmerNameHnd;
          //
          // }
        } else {
          if (res[0].data == "") {
            self.showPrompt(res[0].message);
          } else {
            self.showPrompt(res[0].data);
          }
        }
        // self.httpClient.showToast(res.message);
        self.httpClient.dismissLoadingImage();
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
            srvmethodnm: this.methodName,
            srvparam: JSON.stringify({
              userId: userid,
              roleId: roleId,
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

  gotoWorkConfirmationPage(data) {
    this.router.navigate([
      "work-confirmation",
      { objConfirm: JSON.stringify(data) },
    ]);
  }
}
