import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AlertController, NavController, Platform, ModalController, } from "@ionic/angular";
import { CommonService } from "../../services/common.service";
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DatabaseServiceService } from "../../services/database-service.service";
import { AssignmodalPage } from "../assignmodal/assignmodal.page";

@Component({
  selector: "app-applicant-list",
  templateUrl: "./applicant-list.page.html",
  styleUrls: ["./applicant-list.page.scss"],
})
export class ApplicantListPage implements OnInit {
  applicantList: any = [];
  upcomingData: any;
  constructor(
    public dbServices: DatabaseServiceService,
    public navCtrl: NavController,
    public router: Router,
    public route: ActivatedRoute,
    public alertCtrl: AlertController,
    public httpClient: CommonService,
    public storage: Storage,
    public platform: Platform,
    public geolocation: Geolocation,
    public modalController: ModalController,
  ) {
    this.upcomingData = JSON.parse(this.route.snapshot.paramMap.get("data"));
    console.log("this.upcomingData", this.upcomingData);
  }

  ngOnInit() { }
/*
  ionViewWillEnter() {
    var self = this;
    this.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "GetLicensePVPendingList",
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
          self.applicantList = res.data;
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
            srvnm: "PreVerification",
            srvmethodnm: "GetLicensePVPendingList",
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
*/

  ionViewWillEnter() {
    var self = this;
    self.applicantList = [];
    this.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "GetLicensePVPendingList",
        srvparam: JSON.stringify({
          roleid: self.httpClient.userData.roleid,
          userid: self.httpClient.userData.userid,
          LicenseSubMasterId: this.upcomingData.LicenseSubMasterId,
          AppType: this.upcomingData.ApplicationType,

        }),
      },
    };

    self.httpClient.post(sendRequestData).subscribe(
        function (temp) {
          var res: any = temp[0];
          console.log("res rs", res);
          self.httpClient.dismissLoading();
          if (res.status == 0) {
            self.applicantList = res.data.filter((x) => x.Sataus == 'Pending');
            console.log('self.applicantList P',self.applicantList);
            if(self.applicantList.length<=0)
            {
              self.httpClient.showToast('No Record Found');
            }
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
              srvnm: "PreVerification",
              srvmethodnm: "GetLicensePVPendingList",
              srvparam: JSON.stringify({
                roleid: self.httpClient.userData.roleid,
                userid: self.httpClient.userData.userid,
                LicenseSubMasterId: self.upcomingData.LicenseSubMasterId,
                AppType: this.upcomingData.ApplicationType,

              }),
            }
          };
          console.log('errorRequestData new', errorRequestData);
          self.httpClient.getErrorMobileLogs(errorRequestData);
          self.httpClient.showToastError();
        }
    );
  }

  verificationDetails(data) {
    this.router.navigate([
      "application-verification",
      { data: JSON.stringify(data) },
    ]);
  }


  async assign() {
    var tempSelectedArray = this.applicantList.filter((x) => x.isChecked == true);
    console.log("tempSelectedArray", tempSelectedArray);
    if (tempSelectedArray.length > 0) {
      var selectedIds;
      for (var i = 0; i < tempSelectedArray.length; i++) {
        if (selectedIds) {
          selectedIds = selectedIds + "," + tempSelectedArray[i].Applicationid + "~" + tempSelectedArray[i].ApplicationType;
        } else {
          selectedIds = tempSelectedArray[i].Applicationid+ "~" + tempSelectedArray[i].ApplicationType;
        }
      }
      const modal = await this.modalController.create({
        component: AssignmodalPage,
        backdropDismiss: false,
        componentProps: { value: selectedIds }
      });
      modal.onDidDismiss().then((data) => {
        this.ionViewWillEnter();
      });
      return await modal.present();
    }
    else {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया एप्लीकेशन का चयन करें ' : 'Please select at least one application');
    }

  }
}
