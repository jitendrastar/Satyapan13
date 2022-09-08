import { DatabaseServiceService } from "./../../services/database-service.service";
import { Component, OnInit } from "@angular/core";
import { CommonService } from "../../services/common.service";
import { NavController, AlertController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-lic-list",
  templateUrl: "./lic-list.page.html",
  styleUrls: ["./lic-list.page.scss"],
})
export class LicListPage implements OnInit {
  licListData: any = [];
  userDataDashboard: any;

  constructor(
    public httpClient: CommonService,
    public dbService: DatabaseServiceService,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public storage: Storage,
    public route: ActivatedRoute
  ) {
    this.userDataDashboard = JSON.parse(
      this.route.snapshot.paramMap.get("userDataDashboard")
    );
    this.httpClient.login(this.userDataDashboard);
  }

  ngOnInit() {
    this.gotoLicList();
  }

  gotoLicList() {
    var self = this;
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "GetMasterData",
        srvmethodnm: "getmasterdataforMobilebytable",
        srvparam: JSON.stringify({
          tablename: "LicenseMaster",
          filterfirst: "",
        }),
      },
    };
    self.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);

        if (res.status == 0) {
          self.licListData = res.data;
        } else {
        }
        // self.httpClient.showToast(res.message);
      },
      (error) => {
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "GetMasterData",
            srvmethodnm: "getmasterdataforMobilebytable",
            srvparam: JSON.stringify({
              tablename: "LicenseMaster",
              filterfirst: "",
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();       }
    );
  }
  gotoLicDetails(LicenseMasterId) {
    this.navCtrl.navigateForward([
      "lic-sub-list",
      {
        LicenseMasterId: LicenseMasterId,
      },
    ]);
  }
  logoutPopUp() {
    if (this.httpClient.currentLanguage == "english") {
      this.showPrompt("Are you sure you want to logout");
    } else {
      this.showPrompt("क्या आप लॉग आउट करना चाहते हैं");
    }
  }

  logout() {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "logoutMobileuser",
        // userid: self.httpClient.userData.userid,
        srvparam: JSON.stringify({
          userid: self.httpClient.userData.userid,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        if (res.status == 0) {
          self.dbService.emptyStorage();
          self.storage.remove('userData');
          self.storage.remove('roleList');
          self.navCtrl.navigateRoot("login");
        } else {
          self.httpClient.showToast(res.message);
        }
        self.httpClient.dismissLoading();
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
            srvmethodnm: "logoutMobileuser",
             srvparam: JSON.stringify({
              userid: self.httpClient.userData.userid,
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();        }
    );
  }

  async showPrompt(msg) {
    if (this.httpClient.currentLanguage == "hindi") {
      const prompt = await this.alertCtrl.create({
        header: "लॉग आउट",
        message: msg,
        backdropDismiss: false,

        buttons: [
          {
            text: "रद्द करें",
            role: "cancel",
            handler: () => {},
          },
          {
            text: "ठीक है",
            handler: (data) => {
              console.log("Ok clicked");
              this.logout();
            },
          },
        ],
      });
      await prompt.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: "Logout",
        message: msg,
        backdropDismiss: false,

        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {},
          },
          {
            text: "OK",
            handler: (data) => {
              console.log("Ok clicked");
              this.logout();
            },
          },
        ],
      });
      await alert.present();
    }
  }
}
