import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
} from "@ionic/angular";
import { CommonService } from "../services/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DatabaseServiceService } from "../services/database-service.service";

@Component({
  selector: "app-pre-verification",
  templateUrl: "./pre-verification.page.html",
  styleUrls: ["./pre-verification.page.scss"],
})
export class PreVerificationPage {
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
  getSubsidyDashboardData: any;
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
    if (this.roleName_EN == "Agriculture Supervisor") {
      this.pendingRow = false;
    } else {
      this.pendingRow = true;
    }
    this.getSubsidyDashboard(this.roleId, this.userid, this.header);
  }

  getLoc() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
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

  /*gotoAAOVerification() {
    this.navCtrl.push('AaoVerificationPage');
  }

  assignsubmissionPage() {
    this.navCtrl.push('AssignsubmissionPage');

  }

  pvDoneBy() {
    this.navCtrl.push('VarificationdonebyPage');

  }

  detailAfterPVDone() {
    this.navCtrl.push('PvDetailsPage');

  }

  dashboardPage() {
    this.navCtrl.push('DashboardPage');

  }*/

  //   progressBar(){
  //
  // console.log("progress");
  //     const fileTransfer: FileTransferObject = this.transfer.create();
  //
  //     var URL = encodeURI(this.url);
  //     fileTransfer.onProgress((progressEvent) => {
  //       console.log(progressEvent);
  //       var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
  //       this.progress = perc;
  //       console.log(this.progress);
  //
  //     });
  //     fileTransfer.download(URL,this.file.dataDirectory + 'file.pdf').then((entry) => {
  //       console.log('download complete: ' + entry.toURL());
  //
  //     }, (error) => {
  //       // handle error
  //       console.log('err',error);
  //     });
  //   }

  getSubsidyDashboard(roleId, userid, flag) {
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "i75Q7Q6nYgW3rgEitGndNA==",
        srvnm: "SubsidyDashboard",
        srvmethodnm: "GetSubsidyDashboard",
        srvparam: JSON.stringify({
          RoleId: roleId,
          UserId: userid,
          Flag: flag,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getSubsidyDashboardData = res[0].data;
          self.saveDashBoardOffline(self.getSubsidyDashboardData);
          console.log(
            "self.getSubsidyDashboardData",
            self.getSubsidyDashboardData
          );
          for (var i = 0; i < self.getSubsidyDashboardData.length; i++) {
            self.totalPending += parseInt(
              self.getSubsidyDashboardData[i].TotalPending
            );
            self.totalComplete += parseInt(
              self.getSubsidyDashboardData[i].TotalCompleted
            );
            self.total = self.totalPending + self.totalComplete;
          }
          self.httpClient.dismissLoadingImage();
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
            srvnm: "SubsidyDashboard",
            srvmethodnm: "GetSubsidyDashboard",
            srvparam: JSON.stringify({
              RoleId: roleId,
              UserId: userid,
              Flag: flag,
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
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
  onSubsidyClick(subsidyId, count) {
    console.log("count", count);
    // if (count != "0") {
    console.log("subsidyId", subsidyId);
    if (this.header == "1") {
      this.router.navigate(["subsidy-detail", { subsidyId: subsidyId }]);
    } else {
      this.router.navigate(["post-subsidy-detail", { subsidyId: subsidyId }]);
    }
    // }
  }

  assignedToAs() {
    this.router.navigate(["aao-verification"]);
  }

  manageAs() {
    console.log("manageAs");
    this.router.navigate(["verification-done-by"]);
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
}
