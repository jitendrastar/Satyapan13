import { Component, OnInit } from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {ActivatedRoute} from '@angular/router';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-dealer-assign-submission',
  templateUrl: './dealer-assign-submission.page.html',
  styleUrls: ['./dealer-assign-submission.page.scss'],
})
export class DealerAssignSubmissionPage   {

  farmerPhoto: any;
  farmerName: any;
  schemeName: any;
  schemeNameHnd: any;
  applicationNo: any;
  mobileNo: any;
  fatherName: any;
  caste: any;
  subCaste: any;
  khasraNo: any;
  totalLandArea: any;
  farmCategory: any;
  isSprinkler: any;
  farmPondCategory: any;
  shape: any;
  creationDate: any;
  farmerNameH: any;
  statusAssignPending: any;
  assignedToNameEn: any;
  assignedToNameHi: any;
  applicationId: any;

  listDeatailForAssign: any;
  getAsListData: any;

  asListId: any;
  asName: any;
  asNameHi: any;

  village: any;
  district: any;
  block: any;
  villageH: any;
  districtH: any;
  blockH: any;
  schemeNameH: any;
  roleId: any;
  userid: any;
  subsidySchemeId: any;
  listLength: any;
  constructor(public navCtrl: NavController,private storage: Storage,private route: ActivatedRoute, public alertCtrl: AlertController,
              public httpClient: CommonService) {
    this.listDeatailForAssign=JSON.parse(this.route.snapshot.paramMap.get("dataForAs"));
    this.applicationId = this.listDeatailForAssign.ApplicationId;
    this.subsidySchemeId = this.listDeatailForAssign.SubsidySchemeId;
    console.log("this.subsidySchemeId",this.subsidySchemeId);
    console.log("this.applicationId",this.applicationId);

    this.farmerName = this.listDeatailForAssign.FarmerName;

    this.schemeName = this.listDeatailForAssign.SchemeNameEng;
    this.schemeNameHnd = this.listDeatailForAssign.SchemeNameHnd;

    this.khasraNo = this.listDeatailForAssign.KhasraNo;
    this.totalLandArea = this.listDeatailForAssign.TotalLandArea;
    this.farmCategory = this.listDeatailForAssign.FarmCategory;
    this.isSprinkler = this.listDeatailForAssign.IsSprinkler;
    this.farmPondCategory = this.listDeatailForAssign.SubsidyCategory;
    // this.shape = this.listDeatailForAssign.Shape;
    if (this.listDeatailForAssign.Shape == "") {
      this.shape = 'null';
    } else {
      this.shape = this.listDeatailForAssign.Shape;

    }
    // this.farmPondCategory = this.listDeatailForAssign.FarmerCost;
    // this.farmPondCategory = this.listDeatailForAssign.FarmPondCategory;

    this.village = this.listDeatailForAssign.Village_Eng;
    this.district = this.listDeatailForAssign.DISTRICT_ENG;
    this.block = this.listDeatailForAssign.BLOCK_ENG;

    if (this.listDeatailForAssign.FarmerNameHnd == "") {
      this.farmerNameH = this.listDeatailForAssign.FarmerName;
    } else {
      this.farmerNameH = this.listDeatailForAssign.FarmerNameHnd;

    }

    this.villageH = this.listDeatailForAssign.Village_Mangal;
    this.districtH = this.listDeatailForAssign.DISTRICT_MANGAL;
    this.blockH = this.listDeatailForAssign.BLOCK_MANGAL;
    this.mobileNo = this.listDeatailForAssign.MobileNo;
    this.caste = this.listDeatailForAssign.Caste;
    this.subCaste = this.listDeatailForAssign.SubCaste;
    this.creationDate = this.listDeatailForAssign.CreationDate;
    this.fatherName = this.listDeatailForAssign.FatherName;
    this.farmerPhoto = this.listDeatailForAssign.FarmerPhoto;
    this.applicationNo = this.listDeatailForAssign.ApplicationNo;
    this.statusAssignPending = this.listDeatailForAssign.Status;
    this.assignedToNameEn = this.listDeatailForAssign.AssignedToNameEn;
    if(this.listDeatailForAssign.AssignedToNameHi=="")
    {
      this.assignedToNameHi = this.listDeatailForAssign.AssignedToNameEn;

    }else
    {
      this.assignedToNameHi = this.listDeatailForAssign.AssignedToNameHi;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssignsubmissionPage');
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter AssignsubmissionPage');
    this.storage.get('userData').then(res => {
      this.roleId = res.roleid;
      this.userid =res.userid;
      console.log("this.roleId----1",this.roleId);
      console.log("this.userid-----1",this.userid);
      this.getAsList(this.userid);


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
    // this.getAsList(this.userid);


    // });
  }
  getAsList(userid) {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      "obj": {
        "usrnm": "rajkisan",
        "psw": "rajkisan@123",
        "srvnm": "HortiSubsidy",
        "srvmethodnm": "GetDripSprinklerManufAgentList",
        "srvparam": "{ 'userId':'"+userid+"'}"
      }
    }
    this.httpClient.post(sendRequestData).subscribe(function (res: any) {
          console.log("res", res);
          if (res[0].status == 0) {
            self.getAsListData = res[0].data;

            console.log("self.getAsListData ", self.getAsListData);
            console.log("res[0].data.length--> ", res[0].data.length);
            self.listLength = res[0].data.length;
            if(self.listLength==1)
            {
              self.asName= self.getAsListData[0].OfficerNameEn;
              self.asNameHi= self.getAsListData[0].OfficerNameHi;
              self.asListId= self.getAsListData[0].UserId;
            }

          } else {
            // self.httpClient.showToast(res[0].data);
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
              "srvnm": "HortiSubsidy",
              "srvmethodnm": "GetDripSprinklerManufAgentList",
              "srvparam": "{ 'userId':'"+userid+"'}"
            }
          };
          console.log('errorRequestData new', errorRequestData);
          self.httpClient.getErrorMobileLogs(errorRequestData);
          self.httpClient.showToastError();
        });
  }

  submitAssignAs(){
    console.log("Submit")
  }
  saveAssignAS() {

    if(this.asListId==null)
    {
      if(this.httpClient.currentLanguage=='english'){
        this.httpClient.showToast("Please Select One Item");
      }else{
        this.httpClient.showToast("Please Select One Item");

      }
    }else{
      var self = this;
      // self.httpClient.showLoading();
      var sendRequestData ={
        "obj": {
          "usrnm": "rajkisan",
          "psw": "rajkisan@123",
          "srvnm": "HortiSubsidy",
          "srvmethodnm": "SetDealerToHortiApplication",
          "srvparam": "{ 'ApplicationId':'"+this.applicationId+"','userId':'"+this.asListId+"'}"
        }
      }
      // {
      //   "obj": {
      //   "usrnm": "rajkisan",
      //       "psw": "i75Q7Q6nYgW3rgEitGndNA==",
      //       "srvnm": "PreVerification",
      //       "srvmethodnm": "SaveAssignAS",
      //       "srvparam": JSON.stringify({
      //     'ApplicationIds':this.applicationId,
      //     'NextUserID':this.asListId,
      //     'RoleId':this.roleId,
      //     'UserId':this.userid,
      //     'schemeid':this.subsidySchemeId ,
      //   })
      // }
      // }
      this.httpClient.post(sendRequestData).subscribe(function (res: any) {
            console.log("res", res);
            if (res[0].status == 0) {
              // self.saveAssignASData = res[0].data;
              self.showPrompt(res[0].message);
            } else {

              self.showPrompt(res[0].data);
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
                "srvnm": "HortiSubsidy",
                "srvmethodnm": "SetDealerToHortiApplication",
                "srvparam": "{ 'ApplicationId':'"+self.applicationId+"','userId':'"+self.asListId+"'}"
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
        message: msg,        backdropDismiss:false,

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
        message: msg,        backdropDismiss:false,

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
  onAsClick(){
    console.log('asListId-->',this.asListId);
  }
}
