import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
  ActionSheetController
} from "@ionic/angular";
import { Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { CommonService } from "../services/common.service";
import { ForwardToPage } from "../forward-to/forward-to.page";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-aao-verification",
  templateUrl: "./aao-verification.page.html",
  styleUrls: ["./aao-verification.page.scss"],
})
export class AaoVerificationPage {
  val: any = "1";
  checkedFlag: any = 0;
  checkedList: any;
  getPreVerificationAssignListMobileData: any = [];
  getPreVerificationAssignListMobileDataTwo: any = [];
  farmerNameHnd: any;
  roleId: any;
  userid: any;
  ifPending = false;

  applicationCheckedList: any = [];
  subsidySchemeId: any;
  applicationId: any;
  counter: number;
  filterSection = false;
  listLength = false;
  listOfSubsidy: any = [];
  constructor(public actionSheetController: ActionSheetController, public navCtrl: NavController, public modalCtrl: ModalController, public router: Router, public alertCtrl: AlertController, private callNumber: CallNumber, private storage: Storage, public httpClient: CommonService) {

  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad AaoVerificationPage");
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter AaoVerificationPage");
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;
    this.getPreVerificationAssignListMobile(this.roleId, this.userid);
  }
  loadData() {
    console.log("this.getPreVerificationAssignListMobileData.length", this.getPreVerificationAssignListMobileData.length);

    for (var i = this.getPreVerificationAssignListMobileData.length; i < this.counter + 10; i++) {
      console.log("i", i);

      if (this.getPreVerificationAssignListMobileDataTwo[i]) {
        console.log("this.getPreVerificationAssignListMobileDataTwo[i]", this.getPreVerificationAssignListMobileDataTwo[i]);

        this.getPreVerificationAssignListMobileData.push(this.getPreVerificationAssignListMobileDataTwo[i]);
      }
    }
    this.counter = this.counter + 10;
  }
  getPreVerificationAssignListMobile(roleId, userid) {
    var self = this;
    self.httpClient.showLoadingImage();
    self.getPreVerificationAssignListMobileData=[];
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "i75Q7Q6nYgW3rgEitGndNA==",
        srvnm: "PreVerification",
        srvmethodnm: "GetPreVerificationAssignListMobile",
        srvparam: "{'roleid':'" + roleId + "','userid':'" + userid + "'}",
      },
    };
    var tempArrayOfPendingList: any = [];
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {

          if (res[0].data.length < 10) {
            self.getPreVerificationAssignListMobileData = res[0].data;
            self.listLength = false;

          }
          else {
            for (var i = 0; i < 10; i++) {
              self.getPreVerificationAssignListMobileData.push(res[0].data[i]);
            }
            self.counter = 10;

            self.listLength = true;
          }
          self.getPreVerificationAssignListMobileDataTwo = res[0].data;
          console.log("self.getPreVerificationAssignListMobileDataTwo", self.getPreVerificationAssignListMobileDataTwo);

          // self.getPreVerificationAssignListMobileData = res[0].data;
          for (var i = 0; i < self.getPreVerificationAssignListMobileData.length; i++) {
            self.getPreVerificationAssignListMobileData[i].isChecked = false;
            console.log("tempArrayOfPendingList.length", tempArrayOfPendingList.length);
            if (self.getPreVerificationAssignListMobileData[i].Status == "Pending") {
              tempArrayOfPendingList.push(self.getPreVerificationAssignListMobileData[i]);
            }
          }
          if (tempArrayOfPendingList.length != 0) {
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
        // for (var a = 0; a < res[0].data.length; a++) {
        //   if (self.listOfSubsidy.length == 0) {
        //     self.listOfSubsidy.push({ SubsidySchemeId: res[0].data[a].SubsidySchemeId, SchemeNameEng: res[0].data[a].SchemeNameEng, SchemeNameHnd: res[0].data[a].SchemeNameHnd })
        //   }
        //   else {
        //     var test: any = [];
        //     test = self.listOfSubsidy.filter((x) => x.SubsidySchemeId == res[0].data[a].SubsidySchemeId);
        //     if (test.length == 0) {
        //       self.listOfSubsidy.push({ SubsidySchemeId: res[0].data[a].SubsidySchemeId, SchemeNameEng: res[0].data[a].SchemeNameEng, SchemeNameHnd: res[0].data[a].SchemeNameHnd })
        //     }
        //   }
        // }
        // self.httpClient.showToast(res.message);
        self.httpClient.dismissLoadingImage();
      },
      (error) => {
        var errorRequestData = {
          obj: {
            usrnm: "rajkisan",
            psw: "i75Q7Q6nYgW3rgEitGndNA==",
            srvnm: "PreVerification",
            srvresponce: error,
            'userid': self.httpClient.userData.userid,
            srvmethodnm: "GetPreVerificationAssignListMobile",
            srvparam: "{'roleid':'" + roleId + "','userid':'" + userid + "'}",
          },
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();

      }
    );
  }

  async showPrompt(msg) {
    if (this.httpClient.currentLanguage == "hindi") {
      const prompt = await this.alertCtrl.create({
        header: "अलर्ट!",
        message: msg,
        backdropDismiss: false,
        buttons: [
          {
            text: "ठीक है",
            handler: (data) => {
              console.log("Ok clicked");
              this.navCtrl.pop();
            },
          },
        ],
      });
      await prompt.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: "Alert!",
        message: msg,
        backdropDismiss: false,

        buttons: [
          {
            text: "OK",
            handler: (data) => {
              console.log("Ok clicked");
              this.navCtrl.pop();
            },
          },
        ],
      });
      await alert.present();
    }
  }

  async forwardTo() {
    var selectedValues: any = 0;
    for (let i = 0; i < this.applicationCheckedList.length; i++) {
      selectedValues = selectedValues + "," + this.applicationCheckedList[i];
    }

    if (selectedValues != 0) {
      selectedValues = selectedValues.replace("0,", "");
      const modal = await this.modalCtrl.create({
        component: ForwardToPage,
        cssClass: "my-custom-modal-css",
        backdropDismiss: false,
        componentProps: {
          selectedValues: selectedValues,
          applicationId: this.applicationId,
          subsidySchemeId: this.subsidySchemeId,
        },
      });
      modal.onDidDismiss().then((data) => {
        console.log(data);
        if (data.data != null) {
          selectedValues = 0;

          this.getPreVerificationAssignListMobileAfter();
        }
      });
      return await modal.present();
    } else {
      if (this.httpClient.currentLanguage == "english") {
        this.httpClient.showToast("Please Check at least one application.");
      } else {
        this.httpClient.showToast("कृपया एप्लीकेशन का चयन करें");
      }
    }
  }

  getPreVerificationAssignListMobileAfter() {
    this.roleId = this.httpClient.userData.roleid;
    this.userid = this.httpClient.userData.userid;
    console.log("this.roleId----1", this.roleId);
    console.log("this.userid-----1", this.userid);

    var self = this;
    self.httpClient.showLoadingImage();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "i75Q7Q6nYgW3rgEitGndNA==",
        srvnm: "PreVerification",
        srvmethodnm: "GetPreVerificationAssignListMobile",
        srvparam:
          "{'roleid':'" + this.roleId + "','userid':'" + this.userid + "'}",
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.getPreVerificationAssignListMobileData = res[0].data;
          // self.applicationId = self.getPreVerificationAssignListMobileData[0].ApplicationId;
          // self.subsidySchemeId = self.getPreVerificationAssignListMobileData[0].SubsidySchemeId;
          var tempArrayOfPendingList: any = [];
          for (
            var i = 0;
            i < self.getPreVerificationAssignListMobileData.length;
            i++
          ) {
            self.getPreVerificationAssignListMobileData[i].isChecked = false;
            if (
              self.getPreVerificationAssignListMobileData[i].Status == "Pending"
            ) {
              tempArrayOfPendingList.push(
                self.getPreVerificationAssignListMobileData[i]
              );
            }
          }
          if (tempArrayOfPendingList.length != 0) {
            console.log(
              "tempArrayOfPendingList.length",
              tempArrayOfPendingList.length
            );
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
      },
      (error) => {
        var errorRequestData = {
          obj: {
            usrnm: "rajkisan",
            psw: "i75Q7Q6nYgW3rgEitGndNA==",
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "PreVerification",
            srvmethodnm: "GetPreVerificationAssignListMobile",
            srvparam:
              "{'roleid':'" + self.roleId + "','userid':'" + self.userid + "'}",
          },
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }

  gotoSubmissionPage(data) {
    this.router.navigate([
      "assign-submission",
      { dataForAs: JSON.stringify(data) },
    ]);
  }

  pendingSelectCheck(index, SubsidySchemeId, ApplicationId) {
    for (let i = 0; i < this.applicationCheckedList.length; i++) {
      console.log(
        "this.applicationCheckedList[i].ApplicationId",
        this.applicationCheckedList[i]
      );
      if (
        this.getPreVerificationAssignListMobileData[index].ApplicationId ==
        this.applicationCheckedList[i]
      ) {
        this.applicationCheckedList.splice(i, 1);
        this.subsidySchemeId = SubsidySchemeId;
        this.applicationId = ApplicationId;
        console.log("this.subsidySchemeId", this.subsidySchemeId);
        console.log("this.applicationCheckedList", this.applicationCheckedList);
      }
    }
    if (this.getPreVerificationAssignListMobileData[index].isChecked == true) {
      this.applicationCheckedList.push(
        this.getPreVerificationAssignListMobileData[index].ApplicationId
      );
      console.log("this.applicationCheckedList", this.applicationCheckedList);
      this.subsidySchemeId = SubsidySchemeId;
      this.applicationId = ApplicationId;
      console.log("this.subsidySchemeId", this.subsidySchemeId);
    }
    // console.log("index  = " + index);
    // console.log("checkedFlag  = " + this.checkedFlag);
    // if (this.checkedFlag == 0) {
    //   this.checkedFlag = 1;
    // } else {
    //   this.checkedFlag = 0;
    // }
  }
  async toggleFilterSection() {
    this.filterSection = !this.filterSection;
  }
  initializeItems() {
    this.getPreVerificationAssignListMobileData = this.getPreVerificationAssignListMobileDataTwo;
  }
  getItems(ev) {

    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log("val", val);

    this.initializeItems();

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {

      console.log("val", val)
      this.getPreVerificationAssignListMobileData = this.getPreVerificationAssignListMobileDataTwo.filter((item) => {
        return (
          (item.SchemeNameEng.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.SchemeNameHnd.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.FarmerName.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.FarmerNameHnd.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.FatherName.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.Village_Eng.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.Village_Mangal.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.MobileNo.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.Status.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.BLOCK_ENG.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.BLOCK_MANGAL.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.DISTRICT_ENG.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.ApplicationId.toLowerCase().indexOf(val.toLowerCase()) > -1)

        );

      })
    }
    else {
      this.getPreVerificationAssignListMobile(this.roleId, this.userid);
    }
  }
}
