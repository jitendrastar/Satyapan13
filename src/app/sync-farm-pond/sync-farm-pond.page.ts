import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { AlertController } from '@ionic/angular';
import { DatabaseServiceService } from '../services/database-service.service';

@Component({
  selector: 'app-sync-farm-pond',
  templateUrl: './sync-farm-pond.page.html',
  styleUrls: ['./sync-farm-pond.page.scss'],
})
export class SyncFarmPondPage implements OnInit {

  constructor(public httpClient: CommonService, public alertCtrl: AlertController, public dbService: DatabaseServiceService) { }

  ngOnInit() {
    this.getOfflineList();
  }
  dataForSubmission: any = [];
  formPondList: any = [];
  getOfflineList() {
    this.dataForSubmission = [];
    this.dbService.storage.executeSql('SELECT * FROM preVerificationOffline', []).then((res => {
      this.formPondList = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          if (res.rows.item(i).applicationSubmissionData != null) {
            var temp: any = res.rows.item(i).applicationSubmissionData;
            this.formPondList.push({ submissionData: JSON.parse(temp), applicationId: res.rows.item(i).ApplicationId });
          }

        }
      }
      console.log("this.formPondList", this.formPondList);
      // for (let j = 0; j < this.formPondList.length; j++) {
      //   var tempObject = this.formPondList[j].applicationData;
      //   this.dataForSubmission.push(JSON.parse(tempObject));
      // }
    }))
  }
  submitCheckList(data) {
    var sendRequestData = data;
    var self1 = this;
    this.httpClient.showLoading();
    this.httpClient.post(sendRequestData).subscribe(function (res: any) {
      console.log("res", res);
      self1.httpClient.dismissLoading();
      if (res[0].status == 0) {
        self1.showPrompt(res[0].message);
      } else {
        if (res[0].data == "") {
          self1.showPrompt(res[0].message);
        } else {
          self1.showPrompt(res[0].data);
        }
      }
    }
      , error => {
        self1.httpClient.showToast(self1.httpClient.errorMessage);
      });

  }
  async showPrompt(msg) {
    if (this.httpClient.currentLanguage == 'hindi') {

      const prompt = await this.alertCtrl.create({
        header: 'अलर्ट!',
        message: msg,
        backdropDismiss: false,
        buttons: [
          {
            text: 'ठीक है',
            handler: data => {
              console.log('Ok clicked');

            }
          }
        ]
      });
      await prompt.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Alert!',
        message: msg,
        backdropDismiss: false,
        buttons: [{
          text: 'OK',
          handler: data => {
            console.log('Ok clicked');

          }
        }]
      });
      await alert.present();
    }
  }

}
