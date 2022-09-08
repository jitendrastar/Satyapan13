import { Component, OnInit } from "@angular/core";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { DatabaseServiceService } from "../../services/database-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "../../services/common.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Storage } from "@ionic/storage";

import { Observable, interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
@Component({
  selector: "app-lic-sub-list",
  templateUrl: "./lic-sub-list.page.html",
  styleUrls: ["./lic-sub-list.page.scss"],
})
export class LicSubListPage implements OnInit {
  licListData: any = [];
  licenseMasterId: any;

  gridSelected: any = true;
  listSelected: any = false;
  userDataDashboard: any;
  imgUrl: any='http://rajkisan.rajasthan.gov.in/content/LicenceFiles/F08F12FA91AC45B982D4EAE94B5FB1B9.jpg';
  pdfUrl: any='http://rajkisan.rajasthan.gov.in/Content/SPPMobileApp/SPP_8904_436_060921102435.pdf';
  message$: Observable<string>;

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
    // this.licenseMasterId = JSON.parse(
    //   this.route.snapshot.paramMap.get("LicenseMasterId")
    // );
    // console.log("this.LicenseMasterId", this.licenseMasterId);
    this.message$ = this.getResendObservable();
    console.log('this.imgUrl',this.imgUrl.substring(this.imgUrl.lastIndexOf('.') + 1));
    console.log('this.pdfUrl',this.pdfUrl.substring(this.pdfUrl.lastIndexOf('.') + 1));
    console.log('this.pdfUrl',this.pdfUrl.split(".").pop());
  }


  private messages = [
    'You are my hero!',
    'You are the best hero!',
    'Will you be my hero?'
  ];

  resend() {
    this.message$ = this.getResendObservable();
  }

  private getResendObservable() {
    return interval(500).pipe(
        map(i => this.messages[i]),
        take(this.messages.length)
    );
  }

  ionViewWillEnter() {
    var temp="RJ45CM4402";
       temp.substring( temp.length - 4);
     console.log(temp);
     this.gotoLicDetails();
    this.getDistance(
      this.httpClient.latitude,
      this.httpClient.longitude,
      26.9124,
      75.7873
    );

    // 26.8767° N, ° E

    // ° N, ° E
  }

  getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    console.log("distance", d);
    // this.httpClient.showToast(d);
  }
  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  ngOnInit() { }

  gotoLicDetails() {
    var self = this;
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "GetMasterData",
        srvmethodnm: "getmasterdataforMobilebytable",
        srvparam: JSON.stringify({
          tablename: "LicenseSubMaster",
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
            srvnm: "GetMasterData",
            srvmethodnm: "getmasterdataforMobilebytable",
            srvparam: JSON.stringify({
              tablename: "LicenseSubMaster",
              filterfirst: "",
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
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

  gotoCountDashboard(data) {
    this.navCtrl.navigateForward([
      "lic-dashboard",
      {
        data: JSON.stringify(data),
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

  home() {
    if (this.httpClient.userList.length == 0) {
        this.navCtrl.navigateRoot([
            "subsidy-lic-selection",
            { userData: JSON.stringify([this.httpClient.userData]) },
        ]);
    }
    else {
        this.navCtrl.navigateRoot([
            "subsidy-lic-selection",
            { userData: JSON.stringify(this.httpClient.userList) },
        ]);
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
  changeRole() {
    this.navCtrl.navigateRoot(["selectrole"]);
  }
}
