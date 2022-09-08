import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { CommonService } from "../../services/common.service";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { DatabaseServiceService } from "../../services/database-service.service";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { LocationAccuracy } from "@ionic-native/location-accuracy/ngx";

@Component({
  selector: "app-manufacture-dashboard",
  templateUrl: "./manufacture-dashboard.page.html",
  styleUrls: ["./manufacture-dashboard.page.scss"],
})
export class ManufactureDashboardPage {
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
  OfficerNameHi: any;
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
  getHortiSubsidyDashboard: any = [];
  totalPending: any = 0;
  totalComplete: any = 0;
  total: any = 0;
  totalPendingD: any = 0;
  totalCompleteD: any = 0;
  totalD: any = 0;

  locationCoords: any = [];
  timetest: any;

  constructor(
    public dbService: DatabaseServiceService,
    public navCtrl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public httpClient: CommonService,
    public storage: Storage,
    public platform: Platform,
    public androidPermissions: AndroidPermissions,
    public geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy
  ) {
    this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: "",
    };
    this.timetest = Date.now();
    this.userDataDashboard = JSON.parse(
      this.route.snapshot.paramMap.get("userDataDashboard")
    );
    this.httpClient.login(this.userDataDashboard);
  }

  ionViewWillEnter() {
    this.totalPending = 0;
    this.totalComplete = 0;
    this.total = 0;
    this.totalPendingD = 0;
    this.totalCompleteD = 0;
    this.totalD = 0;
    this.getLoc();
    this.ssoID = this.httpClient.userData.ssoId;
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;
    this.officerNameEn = this.httpClient.userData.OfficerNameEn;
    this.OfficerNameHi = this.httpClient.userData.OfficerNameHi;
    this.roleName_EN = this.httpClient.userData.RoleName_EN;
    if (this.roleName_EN == "Horticulture Agent") {
      this.pendingRow = false;
    } else {
      this.pendingRow = true;
    }
    this.getVerificationDashboard(this.roleId, this.userid);
    this.getVersion();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad DashboardPage");
  }
  checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        (result) => {
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        (err) => {
          alert(err);
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            (error) => {
              //Show alert if user click on 'No Thanks'
              alert(
                "requestPermission Error requesting location permissions " +
                  error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getLoc();
        },
        (error) =>
          alert(
            "Error requesting location permissions " + JSON.stringify(error)
          )
      );
  }
  getLoc() {
    this.geolocation
      .getCurrentPosition({ enableHighAccuracy: true })
      .then((resp) => {
        this.httpClient.latitude = resp.coords.latitude;
        this.httpClient.longitude = resp.coords.longitude;
        var acc = resp.coords.accuracy;
        var timestamp = resp.timestamp;
        console.log(acc);
        console.log(timestamp);
        this.isLocation = true;
      })
      .catch((error) => {
        this.isLocation = true;
        console.log("error", error);
        if (this.httpClient.currentLanguage == "english") {
          this.showLocationPrompt(
            "You will have to enable the location or GPS permission for this app."
          );
        } else {
          this.showLocationPrompt(
            "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
          );
        }
      });
  }

  getVerificationDashboard(roleId, userid) {
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
          console.log(
            "self.getHortiSubsidyDashboard",
            self.getHortiSubsidyDashboard
          );
          for (var i = 0; i < self.getHortiSubsidyDashboard.length; i++) {
            self.totalPending += parseInt(
              self.getHortiSubsidyDashboard[i].TotalPending
            );
            self.totalComplete += parseInt(
              self.getHortiSubsidyDashboard[i].TotalCompleted
            );
            self.total = self.totalPending + self.totalComplete;
          }
          for (var j = 0; j < self.getHortiSubsidyDashboard.length; j++) {
            self.totalPendingD += parseInt(
              self.getHortiSubsidyDashboard[j].TotalDealerAssignPending
            );
            self.totalCompleteD += parseInt(
              self.getHortiSubsidyDashboard[j].TotalDealerAssignCompleted
            );
            self.totalD = self.totalPendingD + self.totalCompleteD;
          }
        } else {
          self.httpClient.showToast(res[0].message);
        }
        self.httpClient.dismissLoadingImage();
      },
      (error) => {
        // self.httpClient.showToast(self.httpClient.errorMessage);
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
        self.httpClient.showToastError();
      }
    );
  }

  gotoSubsidyDashboardPage(onClick) {
    this.router.navigate(["subsidy-dashboard", { header: onClick }]);
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
      },
      (error) => {
        self.httpClient.dismissLoading();
        // self.httpClient.showToast(self.httpClient.errorMessage);
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

  doRefresh(event) {
    this.totalPending = 0;
    this.totalComplete = 0;
    this.total = 0;
    this.totalPendingD = 0;
    this.totalCompleteD = 0;
    this.totalD = 0;

    setTimeout(() => {
      console.log("Async operation has ended");

      this.getVerificationDashboard(this.roleId, this.userid);

      event.target.complete();
    });
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
        (error) => {}
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
              // navigator["app"].exitApp();
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
              // navigator["app"].exitApp();
            },
          },
        ],
      });
      await alert.present();
    }
  }
}
