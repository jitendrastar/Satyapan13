import { Component, OnInit } from '@angular/core';
import { DatabaseServiceService } from '../../services/database-service.service';
import { AlertController, ModalController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-assigned-list',
  templateUrl: './assigned-list.page.html',
  styleUrls: ['./assigned-list.page.scss'],
})
export class AssignedListPage implements OnInit {
  applicantList: any = [];
  applicantListTwo: any = [];
  upcomingData: any;
  completed=false;
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
    console.log("this.upcomingData assigned-list RS", this.upcomingData);
  }

  ngOnInit() { }
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.applicantList = this.applicantList.filter((item) => {
        return ((item.ApplicantName.toLowerCase().indexOf(val.toLowerCase()) > -1) );
          //  
      })
    }
  }
  initializeItems() {
    this.applicantList = this.applicantListTwo;
  }

  ionViewWillEnter() {
    var self = this;
    self.applicantList = [];
    this.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "GetLicenseAssignedPVList",
        srvparam: JSON.stringify({
          roleid: self.httpClient.userData.roleid,
          userid: self.httpClient.userData.userid,
          LicenseSubMasterId: self.upcomingData.LicenseSubMasterId,
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
          self.applicantList = res.data;
          self.applicantListTwo = res.data;
          // console.log('self.applicantList C', self.applicantList);
          // if (self.applicantList.length <= 0) {
          //   self.httpClient.showToast('No Record Found');
          // }

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

  }


}
