import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { NavController, Platform } from "@ionic/angular";

import { Storage } from "@ionic/storage";
import { CommonService } from "../services/common.service";
import {Downloader, DownloadRequest, NotificationVisibility} from '@ionic-native/downloader/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage {
  ssoID: any;
  roleId: any;
  userid: any;
  officerNameEn: any;
  roleName_EN: any;

  uri: any="http://rajkisan.rajasthan.gov.in/content/LicenceFiles/429847572FDA43D5A160A110A77FEC5A.pdf";
  checked: any;
  userName: any = "";
  password: any = "";
  ssoLoginData: any;
  rememberFlag = 0;
  type = "password";
  showPass = false;
  rno: any = Math.floor(1000 + Math.random() * 9000).toString();

  constructor(
    public router: Router,
    public navCtrl: NavController,
    public httpClient: CommonService,
    private storage: Storage,
    public platform: Platform , private downloader: Downloader,
  public file: File,
  private fileOpener: FileOpener,
  ) {
    
    this.fetchLoginCredentials();
   
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
  }

  ssoLogIn() {
    var self = this;
    var pwd = this.httpClient.encryptData(this.password);
    var rno = this.httpClient.encryptData(this.rno);
    var newpwd = this.httpClient.encryptData(pwd + rno + this.rno);
    self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "i75Q7Q6nYgW3rgEitGndNA==",
        srvnm: "SubsidyUserLogin",
        userid: "0",
        srvmethodnm: "GetLoggedUserdetails",
        srvparam: JSON.stringify({
          SSOid: this.httpClient.encryptData(this.userName),
          pwd: newpwd + "#@$" + rno,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        if (res[0].status == 0) {
          var tempArray = res[0].data;
          self.navCtrl.navigateRoot([
            "subsidy-lic-selection",
            { userData: JSON.stringify(res[0].data) },
          ]);
          // var test = tempArray.filter((x) => x.RoleName_EN == "Manufacturer");
          // var test2 = tempArray.filter((x) => x.RoleName_EN == "Horticulture Agent");
          // if (test.length > 0 || test2.length > 0) {
          //   if (test.length == 1 || test2.length == 1) {
          //     // Navigate to horticulture dashboard
          //     res[0].data.userType='Horticulture';
          //     self.httpClient.login(res[0].data[0]);
          //     self.navCtrl.navigateRoot([
          //           "manufacture-dashboard",
          //           { userDataDashboard: JSON.stringify(res[0].data[0]) },
          //         ]);
          //   } else {
          //     //  Navigate to horticulture role selection
          //   }
          // } else {
          //   self.navCtrl.navigateRoot([
          //     "subsidy-lic-selection",
          //     { userData: JSON.stringify(res[0].data) },
          //   ]);
          // }

          // if (res[0].data.length == 1) {
          //   // if (
          //   //   res[0].data[0].RoleName_EN == "Manufacturer" ||
          //   //   res[0].data[0].RoleName_EN == "Horticulture Agent"
          //   // ) {
          //   //   self.navCtrl.navigateRoot([
          //   //     "manufacture-dashboard",
          //   //     { userDataDashboard: JSON.stringify(self.ssoLoginData) },
          //   //   ]);
          //   // } else {
          //     // self.navCtrl.navigateRoot([
          //     //   "subsidy-lic-selection",
          //     //   { userDataDashboard: JSON.stringify(self.ssoLoginData) },
          //     // ]);
          //   // }
          // } else {
          //   self.storage.set("ssoLoginData", res[0].data);
          //   self.navCtrl.navigateRoot("selectrole");
          // }

          self.getVersion();
        } else {
          self.httpClient.showToast(res[0].message);
        }
        self.httpClient.dismissLoading();
      },
      (error) => {
        setTimeout(function () {
          self.httpClient.dismissLoading();
          var errorRequestData = {
            'obj': {
              'usrnm': 'rajkisan',
              'psw': 'rajkisan@123',
              srvresponce: error,
               userid: "0",
              srvmethodnm: "GetLoggedUserdetails",
              srvparam: JSON.stringify({
                SSOid: self.httpClient.encryptData(self.userName),
                pwd: newpwd + "#@$" + rno,
              }),
            }
          };
          console.log('errorRequestData new', errorRequestData);
          self.httpClient.getErrorMobileLogs(errorRequestData);
          self.httpClient.showToastError();         }, 3000);
        // self.httpClient.showToast(JSON.stringify(error));
      }
    );
  }

  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = "text";
    } else {
      this.type = "password";
    }
  }

  // activeUser(userID) {
  //   var self = this;
  //   self.httpClient.showLoading();
  //   var sendRequestData = {
  //     obj: {
  //       usrnm: "rajkisan",
  //       psw: "rajkisan@123",
  //       srvnm: "PreVerification",
  //       srvmethodnm: "UpdateActiveUserbyUserId",
  //       srvparam: "{'userid':'" + userID + "'}",
  //     },
  //   };
  //   this.httpClient.post(sendRequestData).subscribe(
  //     function (res: any) {
  //       console.log(" UpdateActiveUserbyUserId----> res", res);

  //       // self.httpClient.showToast(res.message);
  //       self.httpClient.dismissLoading();
  //     },
  //     (error) => {
  //       // self.httpClient.dismissLoading();
  //       self.httpClient.showToastError();
  //     }
  //   );
  // }

  /*
        versionCheck() {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData =
                {
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        'srvnm': 'PostVerification',
                        'srvmethodnm': 'GetPVAppversionByName',
                        'srvparam': "{'appname':'PVapp'}"
                    }
                }
            this.httpClient.post(sendRequestData).subscribe(function(res: any) {
                    console.log('GetPVAppversionByName----> res', res);
    
                    // self.httpClient.showToast(res.message);
                    self.httpClient.dismissLoading();
                }
                , error => {
                    // self.httpClient.dismissLoading();
                    self.httpClient.showToastError();
                });
        }
    */
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
          // self.httpClient.showToast(res.message);
        },
        (error) => { }
      );
    });
  }

  licFolder() {
    this.navCtrl.navigateRoot(["subsidy-lic-selection"]);
  }

  fetchLoginCredentials() {
    this.storage.get("username").then((res) => {
      console.log("already stored username = " + res);
      if (res == null) {
        this.userName = "";
      } else {
        this.userName = res;
      }
    });
    this.storage.get("password").then((res1) => {
      console.log("already stored password = " + res1);
      if (res1 == null) {
        this.password = "";
      } else {
        this.password = res1;
      }
    });
  }

  rememberMe() {
    console.log("remember Me = " + this.rememberFlag);
    if (this.rememberFlag == 0) {
      this.storage.set("username", this.userName);
      this.storage.set("password", this.password);
      this.rememberFlag = 1;
    } else {
      this.rememberFlag = 0;
    }
  }
}
