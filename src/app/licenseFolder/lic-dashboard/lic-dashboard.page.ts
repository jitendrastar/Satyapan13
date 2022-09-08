import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { CommonService } from "../../services/common.service";
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DatabaseServiceService } from "../../services/database-service.service";
@Component({
  selector: "app-lic-dashboard",
  templateUrl: "./lic-dashboard.page.html",
  styleUrls: ["./lic-dashboard.page.scss"],
})
export class LicDashboardPage {
  licenseSubMasterId: any;
  getVerificationDashboardData: any;
  SelfTotalPending: any;
  SelfTotalCompleted: any;
  AssignedTOASTotalPending: any;
  AssignedTOASTotalCompleted: any;
  PostVerificationPending: any;
  PostVerificationCompleted: any;
  PostVerificationPendingConfirmation: any;
  roleId: any;
  officerNameEn: any;
  roleName_EN: any;
  userid: any;
  ssoID: any;
  userName: any;
  ssoLoginData: any;
  pageName: any;
  pendingRow: any = true;
  userDataDashboard: any;
  latitude: any = "";
  longitude: any = "";

  checkLocationAvailableRes: any;
  checkIsLocationEnabledRes: any;
  checkIsGpsLocationAvailableRes: any;
  checkIsGpsLocationEnabledRes: any;
  isLocation: any = true;

  upcomingData: any;
  dashboardCount: any;

  constructor(
    public dbServices: DatabaseServiceService,
    public navCtrl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public httpClient: CommonService,
    public storage: Storage,
    public platform: Platform,
    public geolocation: Geolocation
  ) {
    this.upcomingData = JSON.parse(this.route.snapshot.paramMap.get("data"));
    console.log(this.upcomingData);
  }
  applicantList(status) {
    if (status == 'P') {

      if (this.dashboardCount.SelfTotalPending != '0')
        this.navCtrl.navigateForward(["applicant-list", { data: JSON.stringify(this.upcomingData) },]);
    }
    else if (status == 'assigned') {
      if (this.dashboardCount.Assigned != '0')
        this.navCtrl.navigateForward(["assigned-list", { data: JSON.stringify(this.upcomingData) },]);
    }
    else {

      if (this.dashboardCount.SelfTotalCompleted != '0')
        this.navCtrl.navigateForward(["applicant-list-completed", { data: JSON.stringify(this.upcomingData) },]);
    }
  }
  ionViewWillEnter() {
    var self = this;
    this.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "SubsidyDashboard",
        srvmethodnm: "GetLicenseVerificationDashboard",
        srvparam: JSON.stringify({
          roleid: self.httpClient.userData.roleid,
          userid: self.httpClient.userData.userid,
          LicenseSubMasterId: this.upcomingData.LicenseSubMasterId,
        }),
      },
    };

    self.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        self.httpClient.dismissLoading();
        if (res.status == 0) {
          self.dashboardCount = res.data[0];
        } else {
          self.httpClient.showToast(res.message);
        }
      },
      (error) => {
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "SubsidyDashboard",
            srvmethodnm: "GetLicenseVerificationDashboard",
            srvparam: JSON.stringify({
              roleid: self.httpClient.userData.roleid,
              userid: self.httpClient.userData.userid,
              LicenseSubMasterId: self.upcomingData.LicenseSubMasterId,
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad DashboardPage");
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
        userid: self.userid,
        srvparam: JSON.stringify({ userid: self.userid }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        if (res.status == 0) {
          self.dbServices.emptyStorage();
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
            srvparam: JSON.stringify({ userid: self.userid }),
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
        header: "लॉग आउट",
        message: msg,
        backdropDismiss: false,

        buttons: [
          {
            text: "रद्द करें",
            role: "cancel",
            handler: () => { },
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
            handler: () => { },
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

  getVersion() {
    var self = this;
    this.platform.ready().then(() => {
      var sendRequestData = {
        obj: {
          usrnm: "rajkisan",
          psw: "rajkisan@123",
          srvnm: "PostVerification",
          srvmethodnm: "GetPVAppversionByName",
          srvparam: "{'appname':'PVapp'}",
        },
      };
      self.httpClient.post(sendRequestData).subscribe(
        function (temp) {
          var res: any = temp[0];
          console.log("res", res);

          if (res.status == 0) {
            if (
              parseFloat(res.data[0].version) >
              self.httpClient.currentAppVersion
            ) {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  param: res.data[0].version,
                },
              };
              self.navCtrl.navigateRoot(["version-update"], navigationExtras);
            }
          } else {
          }
        },
        (error) => {
          self.httpClient.showToastError();
        }
      );
    });
  }

  async showLocationPrompt(msg) {
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
              navigator["app"].exitApp();
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
              navigator["app"].exitApp();
            },
          },
        ],
      });
      await alert.present();
    }
  }
  changeRole() {
    this.navCtrl.navigateRoot(["selectrole"]);
  }
}
