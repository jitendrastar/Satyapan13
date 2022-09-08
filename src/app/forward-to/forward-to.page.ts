import { Component, OnInit } from '@angular/core';
import {CommonService} from '../services/common.service';
import {AlertController, ModalController, NavController, NavParams} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-forward-to',
  templateUrl: './forward-to.page.html',
  styleUrls: ['./forward-to.page.scss'],
})
export class ForwardToPage {

  val: any = '1';
  getAsListData: any;
  saveAssignASData: any;
  preSelectedValues: any;
  asName: any;
  roleId: any;
  userid: any;

  subsidySchemeId: any;
  applicationId: any;
  asListId: any;

  constructor(public viewCtrl: ModalController,public route: ActivatedRoute, public navCtrl: NavController,public navparams: NavParams,public alertCtrl: AlertController,  private storage: Storage, public httpClient: CommonService) {
    this.preSelectedValues = this.navparams.get('selectedValues');
    console.log("this.preSelectedValues", this.preSelectedValues);

    this.applicationId = this.navparams.get('applicationId');
    console.log("this.applicationId", this.applicationId);

    this.subsidySchemeId = this.navparams.get('subsidySchemeId');
    console.log("this.subsidySchemeId", this.subsidySchemeId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForwordtoPage');
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter AaoVerificationPage');
    this.storage.get('userData').then(res => {
      this.roleId = res.roleid;
      this.userid =res.userid;
      console.log("this.roleId----1",this.roleId);
      console.log("this.userid-----1",this.userid);
      this.GetAsList(this.userid)


    });
    // this.storage.get('roleId').then(res => {
    //   this.roleId = res;
    //   console.log("this.roleId--2",this.roleId);
    //
    // });
    // this.storage.get('userid').then(res => {
    //   this.userid = res;
    //   console.log("this.userid--2",this.userid);
      // this.saveAssignAS();
      // this.GetAsList(this.userid)


    // });
  }

  GetAsList(userid) {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      "obj": {
        "usrnm": "rajkisan",
        "psw": "i75Q7Q6nYgW3rgEitGndNA==", "srvnm": "PreVerification",
        "srvmethodnm": "GetAsList",
        "srvparam": "{'UserId':'"+userid+"','ApplicationId':'"+self.applicationId+"','SubsidySchemeId':'"+self.subsidySchemeId+"'}"
      }
    }

    this.httpClient.post(sendRequestData).subscribe(function (res: any) {
          console.log("res", res);
          if (res[0].status == 0) {
            self.getAsListData = res[0].data;
            self.asListId= self.getAsListData[0].UserId;


          } else {
            // self.httpClient.showToast(res[0].message);
            if(res[0].data==""){
              self.showPrompt(res[0].message);

            }else {
              self.showPrompt(res[0].data);
            }
          }


          // self.httpClient.showToast(res.message);
          self.httpClient.dismissLoading();
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
              "srvnm": "PreVerification",
              "srvmethodnm": "GetAsList",
              "srvparam": "{'UserId':'"+userid+"','ApplicationId':'"+self.applicationId+"','SubsidySchemeId':'"+self.subsidySchemeId+"'}"
            }
          };
          console.log('errorRequestData new', errorRequestData);
          self.httpClient.getErrorMobileLogs(errorRequestData);
          self.httpClient.showToastError();
        });
  }

  modalClose() {
    this.viewCtrl.dismiss({data: null});
  }

  saveAssignAS() {

    if(this.asListId==null)
    {
      if(this.httpClient.currentLanguage=='english'){
        this.httpClient.showToast("Please Select One Item");
      }else{
        this.httpClient.showToast("कृपया एक आइटम का चयन करें");

      }
    }else{
      var self = this;
      // self.httpClient.showLoading();
      var sendRequestData = {
        "obj": {
          "usrnm": "rajkisan",
          "psw": "i75Q7Q6nYgW3rgEitGndNA==",
          "srvnm": "PreVerification",
          "srvmethodnm": "SaveAssignAS",
          "srvparam": JSON.stringify({
            'ApplicationIds':this.preSelectedValues,
            'NextUserID':this.asListId,
            'RoleId':this.roleId,
            'UserId':this.userid,
            'schemeid':this.subsidySchemeId ,

          })
        }
      }

      this.httpClient.post(sendRequestData).subscribe(function (res: any) {
            console.log("res", res);
            if (res[0].status == 0) {
              // self.saveAssignASData = res[0].data;
              self.httpClient.showToast(res[0].message);
              self.viewCtrl.dismiss({data: 1});

            } else {
              // self.httpClient.showToast(res[0].message);
              // self.showPrompt(res[0].data);
              if(res[0].data==""){
                self.showPrompt(res[0].message);

              }else {
                self.showPrompt(res[0].data);
              }
            }


            // self.httpClient.showToast(res.message);
            self.httpClient.dismissLoading();
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
                "srvnm": "PreVerification",
                "srvmethodnm": "SaveAssignAS",
                "srvparam": JSON.stringify({
                  'ApplicationIds':self.preSelectedValues,
                  'NextUserID':self.asListId,
                  'RoleId':self.roleId,
                  'UserId':self.userid,
                  'schemeid':self.subsidySchemeId ,

                })
              }
            };
            console.log('errorRequestData new', errorRequestData);
            self.httpClient.getErrorMobileLogs(errorRequestData);
            self.httpClient.showToastError();
          });
    }
  }
  async showPrompt(msg) {
    if (this.httpClient.currentLanguage == 'hindi') {

      const prompt = await this.alertCtrl.create({
        header: 'अलर्ट!',
                message: msg, backdropDismiss:false,
        buttons: [
          {
            text: 'ठीक है',
            handler: data => {
              console.log('Ok clicked');
              // this.navCtrl.pop();
              this.viewCtrl.dismiss({data: null});

            }
          }
        ]
      });
      await prompt.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Alert!',
         message: msg, backdropDismiss:false,
        buttons: [{
          text: 'OK',
          handler: data => {
            console.log('Ok clicked');
            // this.navCtrl.pop();
            this.viewCtrl.dismiss({data: null});
          }
        }]
      });
      await alert.present();
    }
  }


}
