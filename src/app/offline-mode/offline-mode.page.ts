import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { DatabaseServiceService } from '../services/database-service.service';
import { ActionSheetController } from '@ionic/angular';

import { Geolocation } from "@ionic-native/geolocation/ngx";
@Component({
  selector: 'app-offline-mode',
  templateUrl: './offline-mode.page.html',
  styleUrls: ['./offline-mode.page.scss'],
})
export class OfflineModePage implements OnInit {
  dashboardList: any = [];
  constructor(private geolocation: Geolocation,public actionSheetController: ActionSheetController, public dbService: DatabaseServiceService, public router: Router, public httpClient: CommonService) {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.httpClient.latitude = resp.coords.latitude;
      this.httpClient.longitude = resp.coords.longitude;
      console.log(
          "location",
          this.httpClient.latitude,
          this.httpClient.longitude
      );
  })
      .catch((error) => {
          console.log("Error getting location", error);
      });
   }

  ngOnInit() {
    var self = this;
    setTimeout(function () {
      self.getOffLineData();
    }, 3000);
  }
  getOffLineData() {
    this.dashboardList = [];
    this.dbService.storage.executeSql('SELECT * FROM dashboard', []).then((res => {
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          console.log("res.rows.item(i)", res.rows.item(i));
          this.dashboardList.push(res.rows.item(i));

        }
      }
    }))
  }
  gotoOffLinePreVerification(subsidyId) {
    this.router.navigate(['subsidy-detail', { subsidyId: subsidyId }]);
  }

  gotoFarmPondOffLinePostVerification(subsidyId) {
    this.router.navigate(['post-subsidy-detail', { subsidyId: subsidyId }]);
  }
  async actionSheetOfVerificationType(subsidyId) {
    var headerText: any;
    var postVerificationText: any;
    var preVerificationText: any;
    if (this.httpClient.currentLanguage == 'hindi') {
      headerText = 'सत्यापन के प्रकार का चयन करें ';
      postVerificationText = 'सत्यापन के बाद';
      preVerificationText = 'पूर्व सत्यापन'
    }
    else {
      headerText = 'Select the verification type';
      postVerificationText = 'Post Verification';
      preVerificationText = 'Pre Verification';

    }
    const actionSheet = await this.actionSheetController.create({
      header: headerText,
      buttons: [{
        text: preVerificationText,
        handler: () => {
          this.gotoOffLinePreVerification(subsidyId);
        }
      }, {
        text: postVerificationText,
        handler: () => {
          this.gotoFarmPondOffLinePostVerification(subsidyId);
        }
      }]
    });
    await actionSheet.present();
  }
}
