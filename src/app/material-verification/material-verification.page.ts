import { Component, OnInit } from "@angular/core";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";
import { DatabaseServiceService } from "../services/database-service.service";

@Component({
  selector: "app-material-verification",
  templateUrl: "./material-verification.page.html",
  styleUrls: ["./material-verification.page.scss"],
})
export class MaterialVerificationPage implements OnInit {
  preVerificationChecklistData: any = [];
  createdChecklist: any = [];
  getPreVerificationData: any;
  constructor(
    public alertController: AlertController,
    public dbService: DatabaseServiceService,
    public router: Router,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    private storage: Storage,
    public alertCtrl: AlertController,
    public httpClient: CommonService,
    private callNumber: CallNumber
  ) {
    this.getPreVerificationData = JSON.parse(
      this.route.snapshot.paramMap.get("obj")
    );
    this.VerificationChecklist();
  }
  VerificationChecklist() {
    var self = this;
    // self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "HortiSubsidy",
        srvmethodnm: "VerificationChecklist",
        srvparam: JSON.stringify({
          SchemeId: this.getPreVerificationData.SubsidyId,
          StepName: "Material Verification",
          ApplicationId: this.getPreVerificationData.ApplicationId,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.preVerificationChecklistData = res[0].data;
          // for (var i = 0; i < self.preVerificationChecklistData.length; i++) {
          //   self.preVerificationChecklistData[i].isSelectedClose = false;
          //   self.preVerificationChecklistData[i].isSelectedCheck = false;
          // }
        } else {
          self.httpClient.showToast(res[0].data);
        }
        // self.httpClient.(res[0].message);
        // self.httpClient.dismissLoading();
      },
      (error) => {
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            srvnm: "HortiSubsidy",
            srvmethodnm: "VerificationChecklist",
            srvparam: JSON.stringify({
              SchemeId: self.getPreVerificationData.SubsidyId,
              StepName: "Material Verification",
              ApplicationId: self.getPreVerificationData.ApplicationId,
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  async checkedClose(index, currentFlag) {
    if (!currentFlag) {
      var headerTitleOfAlert;
      var placeholderOfAlert;
      var okButtonText;
      var cancelButtonText;
      if (this.httpClient.currentLanguage == "english") {
        headerTitleOfAlert = "Remark";
        placeholderOfAlert = "Enter Remark";
        okButtonText = "Submit";
        cancelButtonText = "Cancel";
      } else {
        headerTitleOfAlert = "टिप्पणी";
        placeholderOfAlert = "टिप्पणी दर्ज करें";
        okButtonText = "जमा करे";
        cancelButtonText = "रद्द करे";
      }
      const alert = await this.alertController.create({
        header: headerTitleOfAlert,
        inputs: [
          {
            name: "remark",
            type: "text",
            placeholder: placeholderOfAlert,
          },
        ],
        buttons: [
          {
            text: cancelButtonText,
            role: "cancel",
            handler: () => {
              console.log("Confirm Cancel");
            },
          },
          {
            text: okButtonText,
            handler: (data) => {
              if (data.remark.length != 0) {
                console.log(
                  "this.createdChecklist.length",
                  this.createdChecklist.length
                );
                for (var i = 0; i < this.createdChecklist.length; i++) {
                  if (
                    this.preVerificationChecklistData[index].Id ==
                    this.createdChecklist[i].ChecklistId
                  ) {
                    this.createdChecklist.splice(i, 1);
                    this.preVerificationChecklistData[
                      index
                    ].isSelectedCheck = false;
                  }
                }
                this.createdChecklist.push({
                  ChecklistId: this.preVerificationChecklistData[index].Id,
                  IsChecked: false,
                  Remarks: data.remark,
                });
                this.preVerificationChecklistData[index].isSelectedClose = true;
              }
            },
          },
        ],
      });

      await alert.present();
    } else {
      for (var i = 0; i < this.createdChecklist.length; i++) {
        if (
          this.preVerificationChecklistData[index].Id ==
          this.createdChecklist[i].ChecklistId
        ) {
          console.log("in check");
          this.createdChecklist.splice(i, 1);
          this.preVerificationChecklistData[index].isSelectedClose = false;
          console.log("this.createdChecklist", this.createdChecklist);
        }
      }
    }
    console.log("this.createdChecklist", this.createdChecklist);
  }

  checkedCheck(index, currentFLag) {
    if (!currentFLag) {
      for (var i = 0; i < this.createdChecklist.length; i++) {
        if (
          this.preVerificationChecklistData[index].Id ==
          this.createdChecklist[i].ChecklistId
        ) {
          this.createdChecklist.splice(i, 1);
          this.preVerificationChecklistData[index].isSelectedClose = false;
        }
      }

      this.createdChecklist.push({
        ChecklistId: this.preVerificationChecklistData[index].Id,
        IsChecked: true,
        Remarks: "",
      });
      this.preVerificationChecklistData[index].isSelectedCheck = true;
      console.log("this.createdChecklist", this.createdChecklist);
    } else {
      for (var i = 0; i < this.createdChecklist.length; i++) {
        if (
          this.preVerificationChecklistData[index].Id ==
          this.createdChecklist[i].ChecklistId
        ) {
          console.log("in check");
          this.createdChecklist.splice(i, 1);
          this.preVerificationChecklistData[index].isSelectedCheck = false;
          console.log("this.createdChecklist", this.createdChecklist);
        }
      }
    }
    console.log("this.createdChecklist", this.createdChecklist);
  }
  submit() {
    if (
      this.preVerificationChecklistData.length != this.createdChecklist.length
    ) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast("कृपया सभी चेकलिस्ट को पूर्ण करे");
      } else {
        this.httpClient.showToast("Please complete all checklists");
      }
    } else {
      var self = this;
      self.httpClient.showLoading();
      var sendRequestData = {
        obj: {
          usrnm: "rajkisan",
          psw: "rajkisan@123",
          srvnm: "HortiSubsidy",
          srvmethodnm: "SaveMaterialVerificationChecklist",
          srvparam: JSON.stringify({
            ApplicationId: this.getPreVerificationData.ApplicationId,
            latitude: this.httpClient.latitude,
            longitude: this.httpClient.longitude,
            userid: this.httpClient.userData.userid,
            schemeid: this.getPreVerificationData.SubsidyId,
            roleid: this.httpClient.userData.roleid,
            ChecklistDetailList: this.createdChecklist,
          }),
        },
      };
      this.httpClient.post(sendRequestData).subscribe(
        function (res: any) {
          self.httpClient.dismissLoading();
          if (res[0].status == 0) {
            self.navCtrl.back();
          } else {
            self.httpClient.showToast(res[0].data);
          }
        },
        (error) => {
          var errorRequestData = {
            'obj': {
              'usrnm': 'rajkisan',
              'psw': 'rajkisan@123',
              srvresponce: error,
              userid: self.httpClient.userData.userid,
              srvnm: "HortiSubsidy",
              srvmethodnm: "SaveMaterialVerificationChecklist",
              srvparam: JSON.stringify({
                ApplicationId: self.getPreVerificationData.ApplicationId,
                latitude: self.httpClient.latitude,
                longitude: self.httpClient.longitude,
                userid: self.httpClient.userData.userid,
                schemeid: self.getPreVerificationData.SubsidyId,
                roleid: self.httpClient.userData.roleid,
                ChecklistDetailList: self.createdChecklist,
              }),
            }
          };
          console.log('errorRequestData new', errorRequestData);
          self.httpClient.getErrorMobileLogs(errorRequestData);
          self.httpClient.showToastError();
        }
      );
    }
    // else {

    // }
  }

  ngOnInit() { }
}
