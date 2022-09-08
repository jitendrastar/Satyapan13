import { Component, OnInit } from "@angular/core";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { DatabaseServiceService } from "../../services/database-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../services/common.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-lic-subsidy-dashboard",
  templateUrl: "./lic-subsidy-dashboard.page.html",
  styleUrls: ["./lic-subsidy-dashboard.page.scss"],
})
export class LicSubsidyDashboardPage {
  val: any = "1";
  url: any = "http://rajkisan.rajasthan.gov.in/Forms/FormP/FormP_41.pdf";
  Latitude: any = "";
  Longitude: any = "";
  gridSelected: any = true;
  listSelected: any = false;
  ssoLoginData: any;
  userName: any;
  header: any;
  headerEngHnd: any;
  postValue: any = false;
  progress = -1;
  data: any;
  roleId: any;
  userid: any;
  roleName_EN: any;
  getHortiSubsidyDashboard: any;
  totalPending: any = 0;
  totalComplete: any = 0;
  total: any = 0;
  pendingRow: any = true;

  constructor(
    public platform: Platform,
    public dbService: DatabaseServiceService,
    public navCtrl: NavController,
    private storage: Storage,
    public router: Router,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public httpClient: CommonService
  ) {
    // this.ssoLoginData = this.navParams.get('ssoLoginData');
    // this.userName=this.ssoLoginData.OfficerNameEn;
    this.header = this.route.snapshot.paramMap.get("header");
    if (this.header == "1") {
      this.headerEngHnd = "पूर्व सत्यापन";
    } else {
      this.headerEngHnd = "सत्यापन के बाद";
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PreVarificationPage");
  }

  ionViewWillEnter() {
    // setTimeout(() => {
    // this.httpClient.showLoadingImage();
    // });
    console.log("ionViewWillEnter PreVerificationPage");
    this.totalPending = 0;
    this.totalComplete = 0;
    this.total = 0;
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;
    this.roleName_EN = this.httpClient.userData.RoleName_EN;
    if (this.roleName_EN == "Dealer") {
      this.pendingRow = false;
    } else {
      this.pendingRow = true;
    }
    this.getSubsidyDashboard(this.roleId, this.userid);
  }

  getLoc() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        console.log(
          " getting location",
          resp.coords.latitude + "-----" + resp.coords.longitude
        );
        this.Latitude = resp.coords.latitude;
        this.Longitude = resp.coords.longitude;
      })
      .catch((error) => {
        console.log("Error getting location", error);
      });
  }

  gridSelectFunction() {
    if (this.listSelected == true) {
      this.listSelected = false;
      this.gridSelected = true;
    }
    console.log("Grid true");
  }

  listSelectFunction() {
    if (this.gridSelected == true) {
      this.gridSelected = false;
      this.listSelected = true;
    }
    console.log("List true");
  }

  getSubsidyDashboard(roleId, userid) {
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "HortiSubsidy",
        srvmethodnm: "GetHortiSubsidyDashboard",
        srvparam: "{'RoleId':'" + roleId + "','userId':'" + userid + "'}",
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getHortiSubsidyDashboard = res[0].data;
          // self.saveDashBoardOffline(self.getHortiSubsidyDashboard);
          console.log(
            "self.getHortiSubsidyDashboard",
            self.getHortiSubsidyDashboard
          );
          self.httpClient.dismissLoadingImage();
          if (self.header == "1") {
            for (var i = 0; i < self.getHortiSubsidyDashboard.length; i++) {
              self.totalPending += parseInt(
                self.getHortiSubsidyDashboard[i].TotalPending
              );
              self.totalComplete += parseInt(
                self.getHortiSubsidyDashboard[i].TotalCompleted
              );
              self.total = self.totalPending + self.totalComplete;
            }
          } else {
            for (var j = 0; j < self.getHortiSubsidyDashboard.length; j++) {
              self.totalPending += parseInt(
                self.getHortiSubsidyDashboard[j].TotalDealerAssignPending
              );
              self.totalComplete += parseInt(
                self.getHortiSubsidyDashboard[j].TotalDealerAssignCompleted
              );
              self.total = self.totalPending + self.totalComplete;
            }
          }
        } else {
          self.httpClient.showToast(res[0].message);
          self.httpClient.dismissLoadingImage();
        }
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
            srvnm: "HortiSubsidy",
            srvmethodnm: "GetHortiSubsidyDashboard",
            srvparam: "{'RoleId':'" + roleId + "','userId':'" + userid + "'}",
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();       }
    );
  }
  saveDashBoardOffline(data) {
    for (var i = 0; i < data.length; i++) {
      this.dbService.addSubsidyScheme(
        data[i].SubsidySchemeId,
        data[i].SubsidySchemeHi,
        data[i].SubsidySchemeEn,
        data[i].DashboardImg
      );
    }
  }
  onSubsidyClick(subsidyId) {
    console.log("subsidyId", subsidyId);
    // if (this.header == '1') {
    //   this.router.navigate(['subsidy-detail', { subsidyId: subsidyId }]);
    // } else {
    //   this.router.navigate(['post-subsidy-detail', { subsidyId: subsidyId }]);
    //
    // }
    this.router.navigate([
      "subsidy-application-list",
      { subsidyId: subsidyId },
    ]);
  }

  assignedToDealer(clickOpt) {
    this.router.navigate([
      "assign-to-dealer-application-list",
      { clickOpt: clickOpt },
    ]);
  }

  manageAs() {
    console.log("manageAs");
    // this.router.navigate(['verification-done-by']);
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
          self.dbService.emptyStorage();
          self.storage.remove('userData');
          self.storage.remove('roleList');
          self.navCtrl.navigateRoot("login");
        } else {
          self.httpClient.showToast(res.message);
        }
        self.httpClient.dismissLoading();
        // self.httpClient.showToast(res.message);
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
        self.httpClient.showToastError();      }
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
