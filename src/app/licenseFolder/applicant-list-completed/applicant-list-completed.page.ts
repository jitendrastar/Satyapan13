import { Component, OnInit } from '@angular/core';
import {DatabaseServiceService} from '../../services/database-service.service';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {Storage} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-applicant-list-completed',
  templateUrl: './applicant-list-completed.page.html',
  styleUrls: ['./applicant-list-completed.page.scss'],
})
export class ApplicantListCompletedPage implements OnInit {
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
          console.log("res rs c", res);
          self.httpClient.dismissLoading();
          if (res.status == 0) {
            self.applicantList = res.data.filter((x) => x.Sataus == 'Completed');
            console.log('self.applicantList C',self.applicantList);
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
      "application-verification-completed",
      { data: JSON.stringify(data) },
    ]);
  }


 }
