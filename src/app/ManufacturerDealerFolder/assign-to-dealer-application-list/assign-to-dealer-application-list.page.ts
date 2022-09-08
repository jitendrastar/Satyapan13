import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {Storage} from '@ionic/storage';
import {CommonService} from '../../services/common.service';
import {ForwardToPage} from '../../forward-to/forward-to.page';

@Component({
  selector: 'app-assign-to-dealer-application-list',
  templateUrl: './assign-to-dealer-application-list.page.html',
  styleUrls: ['./assign-to-dealer-application-list.page.scss'],
})
export class AssignToDealerApplicationListPage  {
  val: any = '1';
  checkedFlag: any = 0;
  checkedList: any;
  getPreVerificationAssignListMobileData: any;
  farmerNameHnd: any;
  roleId: any;
  userid: any;
  ifPending = false;

  applicationCheckedList: any = [];
  subsidySchemeId: any;
  applicationId: any;
  clickOpt: any;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public router: Router, public alertCtrl: AlertController,
              private callNumber: CallNumber, private route: ActivatedRoute, private storage: Storage, public httpClient: CommonService) {

    this.clickOpt = this.route.snapshot.paramMap.get('clickOpt');
    if (this.clickOpt == "assignToDealer") {
      this.clickOpt = '0';

    } else {
      console.log(this.clickOpt);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AaoVerificationPage');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter AaoVerificationPage');
    this.storage.get('userData').then(res => {
      this.roleId = res.roleid;
      this.userid =res.userid;
      console.log("this.roleId----1",this.roleId);
      console.log("this.userid-----1",this.userid);
      this.getPreVerificationAssignListMobile(this.roleId,this.userid,this.clickOpt);

    });
    // this.storage.get('roleId').then(res => {
    //   this.roleId = res;
    //   console.log("this.roleId--2", this.roleId);
    //
    // });
    // this.storage.get('userid').then(res => {
    //   this.userid = res;
    //   console.log("this.userid--2", this.userid);
    // this.getPreVerificationAssignListMobile(this.roleId);


    // });
  }

  getPreVerificationAssignListMobile(roleId,userid,clickOpt) {
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData =  {
      "obj": {
        "usrnm": "rajkisan",
        "psw": "rajkisan@123",
        "srvnm": "HortiSubsidy",
        "srvmethodnm": "GetHortiApplicationListMobileManufDealer",
        "srvparam": "{'roleId':'"+roleId+"','userId':'"+userid+"','schemeid':'"+clickOpt+"'}"
      }
    }
    var tempArrayOfPendingList: any = [];
    this.httpClient.post(sendRequestData).subscribe(function (res: any) {
          console.log("res", res);
          if (res[0].status == 0) {
            self.getPreVerificationAssignListMobileData = res[0].data;
            // self.applicationId = self.getPreVerificationAssignListMobileData[0].ApplicationId;
            // self.subsidySchemeId = self.getPreVerificationAssignListMobileData[0].SubsidySchemeId;
            for (var i = 0; i < self.getPreVerificationAssignListMobileData.length; i++) {
              self.getPreVerificationAssignListMobileData[i].isChecked = false;
              console.log("tempArrayOfPendingList.length", tempArrayOfPendingList.length);
              if (self.getPreVerificationAssignListMobileData[i].Status == 'Pending') {
                console.log("tedst");
                tempArrayOfPendingList.push(self.getPreVerificationAssignListMobileData[i]);
              }
            }
            if (tempArrayOfPendingList.length != 0) {
              console.log("tempArrayOfPendingList.length", tempArrayOfPendingList.length);
              self.ifPending = true;
            } else {
              self.ifPending = false;
            }
            // if (res[0].data[0].FarmerNameHnd == "") {
            //   self.farmerNameHnd = res[0].data[0].FarmerName;
            // } else {
            //   self.farmerNameHnd = res[0].data[0].FarmerNameHnd;
            //
            // }

          } else {
            if (res[0].data == "") {
              self.showPrompt(res[0].message);

            } else {
              self.showPrompt(res[0].data);
            }
          }
          // self.httpClient.showToast(res.message);
          self.httpClient.dismissLoadingImage();
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
              "srvnm": "HortiSubsidy",
              "srvmethodnm": "GetHortiApplicationListMobileManufDealer",
              "srvparam": "{'roleId':'"+roleId+"','userId':'"+userid+"','schemeid':'"+clickOpt+"'}"
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
        backdropDismiss:false,
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
        backdropDismiss:false,

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

  async forwardTo() {
    var selectedValues: any = 0;
    for (let i = 0; i < this.applicationCheckedList.length; i++) {
      selectedValues = selectedValues + "," + this.applicationCheckedList[i];
      console.log("selectedValues", selectedValues);
      console.log("this.applicationCheckedList[i]--->", this.applicationCheckedList[i]);
    }

    if (selectedValues != 0) {
      selectedValues = selectedValues.replace("0,", "");
      const modal = await this.modalCtrl.create({
        component: ForwardToPage,
        cssClass: 'my-custom-modal-css',
        backdropDismiss:false,
        componentProps: {
          selectedValues: selectedValues,
          applicationId: this.applicationId,
          subsidySchemeId:this.subsidySchemeId
        }
      });  modal.onDidDismiss().then((data) => {
        console.log(data);
        if (data.data != null) {
          selectedValues=0;

          this.getPreVerificationAssignListMobileAfter();
        }
      });
      return await modal.present();
      // const modal = await this.modalCtrl.create('ForwordtoPage', {
      //   selectedValues: selectedValues,
      //   applicationId: this.applicationId,
      //   subsidySchemeId: this.subsidySchemeId
      // });
      // modal.onDidDismiss(data => {
      //   if (data.data != null) {
      //
      //     this.getPreVerificationAssignListMobileAfter()
      //   }
      //
      // });
      // return await modal.present();
      //  this.presentModal(selectedValues,this.applicationId,this.subsidySchemeId);
    } else {
      if (this.httpClient.currentLanguage == 'english') {
        this.httpClient.showToast("Please Check at least one application.");
      } else {
        this.httpClient.showToast("कृपया एप्लीकेशन का चयन करें");

      }
    }

  }
  // async presentModal(selectedValues,applicationId,subsidySchemeId) {
  //   const modal = await this.modalCtrl.create({
  //     component: ForwardToPage,
  //     componentProps: {
  //         selectedValues: selectedValues,
  //         applicationId: applicationId,
  //         subsidySchemeId:subsidySchemeId
  //     }
  //   });  modal.onDidDismiss().then((data) => {
  //     console.log(data)
  //   });
  //   return await modal.present();
  // }
  getPreVerificationAssignListMobileAfter() {
    this.storage.get('userData').then(res => {
      this.roleId = res.roleid;
      this.userid =res.userid;
      console.log("this.roleId----1",this.roleId);
      console.log("this.userid-----1",this.userid);
      // this.getPreVerificationAssignListMobile(this.roleId,this.userid);

    });
    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      "obj": {
        "usrnm": "rajkisan",
        "psw": "rajkisan@123",
        "srvnm": "HortiSubsidy",
        "srvmethodnm": "GetHortiApplicationListMobileManufDealer",
        "srvparam": "{'RoleId':'"+this.roleId+"','userId':'"+this.userid+"','schemeid ':'0'}"
      }
    }
    this.httpClient.post(sendRequestData).subscribe(function (res: any) {
          console.log("res", res);
          if (res[0].status == 0) {
            self.getPreVerificationAssignListMobileData = res[0].data;
            // self.applicationId = self.getPreVerificationAssignListMobileData[0].ApplicationId;
            // self.subsidySchemeId = self.getPreVerificationAssignListMobileData[0].SubsidySchemeId;
            var tempArrayOfPendingList: any = [];
            for (var i = 0; i < self.getPreVerificationAssignListMobileData.length; i++) {
              self.getPreVerificationAssignListMobileData[i].isChecked = false;
              if (self.getPreVerificationAssignListMobileData[i].Status == 'Pending') {
                tempArrayOfPendingList.push(self.getPreVerificationAssignListMobileData[i]);
              }
            }
            if (tempArrayOfPendingList.length != 0) {
              console.log("tempArrayOfPendingList.length", tempArrayOfPendingList.length);
              self.ifPending = true;
            } else {
              self.ifPending = false;
            }
            // if (res[0].data[0].FarmerNameHnd == "") {
            //   self.farmerNameHnd = res[0].data[0].FarmerName;
            // } else {
            //   self.farmerNameHnd = res[0].data[0].FarmerNameHnd;
            //
            // }


          } else {
            // self.httpClient.showToast(res[0].message);
            if (res[0].data == "") {
              self.showPrompt(res[0].message);

            } else {
              self.showPrompt(res[0].data);
            }
          }
          // self.httpClient.showToast(res.message);
          self.httpClient.dismissLoadingImage();
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
              "srvnm": "HortiSubsidy",
              "srvmethodnm": "GetHortiApplicationListMobileManufDealer",
              "srvparam": "{'RoleId':'"+self.roleId+"','userId':'"+self.userid+"','schemeid ':'0'}"
            }
          };
          console.log('errorRequestData new', errorRequestData);
          self.httpClient.getErrorMobileLogs(errorRequestData);
          self.httpClient.showToastError();
        });
  }

  gotoSubmissionPage(data) {
    if(this.httpClient.userData.RoleName_EN=='Manufacturer'){
      this.router.navigate(['dealer-assign-submission', {dataForAs: JSON.stringify(data)}]);
    }else{
      this.router.navigate(['dealer-application-details', {dataForAs: JSON.stringify(data)}]);

    }
  }


  pendingSelectCheck(index,SubsidySchemeId,ApplicationId) {
    for (let i = 0; i < this.applicationCheckedList.length; i++) {
      console.log("this.applicationCheckedList[i].ApplicationId", this.applicationCheckedList[i]);
      if (this.getPreVerificationAssignListMobileData[index].ApplicationId == this.applicationCheckedList[i]) {
        this.applicationCheckedList.splice(i, 1);
        this.subsidySchemeId=SubsidySchemeId;
        this.applicationId=ApplicationId;
        console.log("this.subsidySchemeId", this.subsidySchemeId);
        console.log("this.applicationCheckedList", this.applicationCheckedList);
      }
    }
    if (this.getPreVerificationAssignListMobileData[index].isChecked == true) {
      this.applicationCheckedList.push(this.getPreVerificationAssignListMobileData[index].ApplicationId);
      console.log("this.applicationCheckedList", this.applicationCheckedList);
      this.subsidySchemeId=SubsidySchemeId;
      this.applicationId=ApplicationId;
      console.log("this.subsidySchemeId", this.subsidySchemeId);
    }
  }
}
