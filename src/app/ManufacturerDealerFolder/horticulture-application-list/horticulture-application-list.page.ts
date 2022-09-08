import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {Storage} from '@ionic/storage';
import {CommonService} from '../../services/common.service';
 @Component({
  selector: 'app-horticulture-application-list',
  templateUrl: './horticulture-application-list.page.html',
  styleUrls: ['./horticulture-application-list.page.scss'],
})
export class HorticultureApplicationListPage {

 
  subsidyId: any;
  getHorticultureAppListData: any = [];
  brandData: any = [];

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public router: Router, public alertCtrl: AlertController,
              private callNumber: CallNumber, private route: ActivatedRoute, private storage: Storage, public httpClient: CommonService) {

    this.subsidyId = this.route.snapshot.paramMap.get('subsidyId');
    console.log(this.subsidyId);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AaoVerificationPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter AaoVerificationPage');
    this.storage.get('userData').then(res => {
      this.getHorticultureListData(this.subsidyId);


    });

  }

  getHorticultureListData(subsidyId) {
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      "obj": {
        "usrnm": "rajkisan",
        "psw": "rajkisan@123",
        "srvnm": "PostVerification",
        "srvmethodnm": "GetHorticultureDataList",
        "srvparam": "{'SubsidySchemeId':'"+subsidyId+"'}"
      }
    }
    console.log('GetHorticultureDataList - ',sendRequestData);
     this.httpClient.post(sendRequestData).subscribe(function(res: any) {
          console.log(" GetHorticultureDataList res", res);
           self.httpClient.dismissLoadingImage();

           if (res[0].status == 0) {
            self.getHorticultureAppListData = res[0].data;

             console.log('self.brandData',self.brandData);
             self.brandData=[];
             for(let i=0 ; i< self.getHorticultureAppListData.length ; i++){
              self.brandData.push({
                HortiBrandId:self.getHorticultureAppListData[i].HortiBrandId,
                Brand:self.getHorticultureAppListData[i].Brand
              })
              console.log('self.brandData',self.brandData);
             }
          }
          else {
              self.showPrompt(res[0].data);
            }
        }
        , error => {
          // self.httpClient.dismissLoading();
          // self.httpClient.showToast(self.httpClient.errorMessage);
             var errorRequestData = {
                 'obj': {
                     'usrnm': 'rajkisan',
                     'psw': 'rajkisan@123',
                     srvresponce: error,
                     userid: self.httpClient.userData.userid,
                     "srvnm": "PostVerification",
                     "srvmethodnm": "GetHorticultureDataList",
                     "srvparam": "{'SubsidySchemeId':'"+subsidyId+"'}"
                 }
             };
             console.log('errorRequestData new', errorRequestData);
             self.httpClient.getErrorMobileLogs(errorRequestData);
             self.httpClient.showToastError();
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
              this.navCtrl.pop();
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
            this.navCtrl.pop();
          }
        }]
      });
      await alert.present();
    }
  }

  gotoHortiApplicationDetailsPage(data) {
    console.log('data -', data);
    this.router.navigate(['horticulture-application-details', { data: JSON.stringify(data),brandData: JSON.stringify(this.brandData) }]);

  }
}