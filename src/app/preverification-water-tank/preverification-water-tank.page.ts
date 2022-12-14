import { Component, OnInit, NgZone } from "@angular/core";
import { CommonService } from "../services/common.service";
import {
  AlertController,
  NavController,
  ActionSheetController,
  Platform,
} from "@ionic/angular";
import { DatabaseServiceService } from "../services/database-service.service";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ActivatedRoute } from "@angular/router";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
  Downloader,
  NotificationVisibility,
  DownloadRequest,
} from "@ionic-native/downloader/ngx";
import { File } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
@Component({
  selector: "app-preverification-water-tank",
  templateUrl: "./preverification-water-tank.page.html",
  styleUrls: ["./preverification-water-tank.page.scss"],
})
export class PreverificationWaterTankPage implements OnInit {
  segmentSelected = "work";
  getPreVerificationData: any;
  farmerChoice: any = "yes";
  khasraNo: any;
  suitablekhasara: any;
  preVerificationChecklistData: any = [];
  ChecklistDetailList: any = [];
  mainDataSubmittedFlag = false;
  najariyaNaksha: any;
  imgFarmerAndOfficerWithFarmPondDateTime: any;
  imgFarmerAndOfficerWithFarmPond: any;
  najariyaNakshaDateTime: any;
  preVerificationId: any;
  farmerNonConsentLetter: any;
  imgFarmerWithOfficerNoCase: any;
  farmerNonConsentLetterDateTime: any;
  imgFarmerWithOfficerNoCaseDateTime: any;
  mobileToVerify: any;
  ngOnInit() { }
  offlineData: any;
  fileTransfer: any;
  constructor(
    private transfer: FileTransfer,
    public fileOpener: FileOpener,
    private downloader: Downloader,
    public dbService: DatabaseServiceService,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public camera: Camera,
    public geolocation: Geolocation,
    public route: ActivatedRoute,

    public httpClient: CommonService,
    public alertController: AlertController
  ) {
    this.fileTransfer = this.transfer.create();

    this.getPreVerificationData = JSON.parse(
      this.route.snapshot.paramMap.get("obj")
    );
    this.khasraNo = this.getPreVerificationData.KhasraNo;
    this.preVerificationId = this.getPreVerificationData.PreVerificationId;
    console.log("this.getPreVerificationData", this.getPreVerificationData);
    if (this.httpClient.isOffline) {

      this.mobileToVerify = this.getPreVerificationData.mobilToVerify;
      if (this.getPreVerificationData.mainDataSubmit) {
        this.mainDataSubmittedFlag = true;
        if (this.getPreVerificationData.imageOfnajariyaNaksha) {
          this.najariyaNaksha = this.getPreVerificationData.imageOfnajariyaNaksha;
          this.najariyaNakshaDateTime = new Date();
        }
        if (this.getPreVerificationData.imgFarmerAndOfficerWithFarmPond) {
          this.imgFarmerAndOfficerWithFarmPond = this.getPreVerificationData.imgFarmerAndOfficerWithFarmPond;
          this.imgFarmerAndOfficerWithFarmPondDateTime = new Date();
        }
      }


      // ImgSourceOfIrrigation
    } else if (parseInt(this.preVerificationId) > 0) {
      this.mainDataSubmittedFlag = true;
      if (this.getPreVerificationData.ImgSignedMap != "") {
        this.najariyaNaksha = this.getPreVerificationData.ImgSignedMap;
        this.najariyaNakshaDateTime = new Date();
      }
      if (this.getPreVerificationData.ImgfarmerWithOfficer != "") {
        this.imgFarmerAndOfficerWithFarmPond = this.getPreVerificationData.ImgfarmerWithOfficer;
        this.imgFarmerAndOfficerWithFarmPondDateTime = new Date();
      }
    }

    console.log(this.httpClient.userData);
    this.getCheckList();
    this.geolocation
      .getCurrentPosition({ timeout: 30000, enableHighAccuracy: true })
      .then((resp) => {
        this.httpClient.latitude = resp.coords.latitude;
        this.httpClient.longitude = resp.coords.longitude;
      })
      .catch((error) => { });
  }
  getCheckList() {
    if (this.httpClient.isOffline) {
      this.preVerificationChecklistData = this.getPreVerificationData.preVerificationChecklistData;
    } else {
      var self = this;
      self.httpClient.showLoadingImage();
      var sendRequestData = {
        obj: {
          usrnm: "rajkisan",
          psw: "i75Q7Q6nYgW3rgEitGndNA==",
          srvnm: "PreVerification",
          srvmethodnm: "VerificationChecklist",
          srvparam:
            "{'SchemeId':'" +
            this.getPreVerificationData.SubsidySchemeId +
            "', 'StepName':'Pre verification','ApplicationId':'" +
            this.getPreVerificationData.ApplicationId +
            "'}",
        },
      };
      this.httpClient.post(sendRequestData).subscribe(function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          self.preVerificationChecklistData = res[0].data;
          for (var i = 0; i < self.preVerificationChecklistData.length; i++) {
            self.preVerificationChecklistData[i].isSelectedClose = false;
            self.preVerificationChecklistData[i].isSelectedCheck = false;
            console.log(
              "self.preVerificationChecklistData[i]",
              self.preVerificationChecklistData[i]
            );
          }
        } else {
          if (res[0].data == "") {
            self.httpClient.showToast(res[0].message);
          } else {
            self.httpClient.showToast(res[0].data);
          }
          // self.httpClient.showToast(res.message);
        }
        // self.httpClient.showToast(res.message);
        self.httpClient.dismissLoadingImage();
      },
        (error) => {
          // self.httpClient.dismissLoading();
          var errorRequestData = {
            'obj': {
              'usrnm': 'rajkisan',
              'psw': 'rajkisan@123',
              srvresponce: error,
              userid: self.httpClient.userData.userid,
              srvnm: "PreVerification",
              srvmethodnm: "VerificationChecklist",
              srvparam:
                "{'SchemeId':'" +
                self.getPreVerificationData.SubsidySchemeId +
                "', 'StepName':'Pre verification','ApplicationId':'" +
                self.getPreVerificationData.ApplicationId +
                "'}",
            }
          };
          console.log('errorRequestData new', errorRequestData);
          self.httpClient.getErrorMobileLogs(errorRequestData);
          self.httpClient.showToastError();
        }
      );
    }
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
        headerTitleOfAlert = "?????????????????????";
        placeholderOfAlert = "????????????????????? ???????????? ????????????";
        okButtonText = "????????? ?????????";
        cancelButtonText = "???????????? ?????????";
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
                for (var i = 0; i < this.ChecklistDetailList.length; i++) {
                  if (
                    this.preVerificationChecklistData[index].Id ==
                    this.ChecklistDetailList[i].ChecklistId
                  ) {
                    this.ChecklistDetailList.splice(i, 1);
                    this.preVerificationChecklistData[
                      i
                    ].isSelectedCheck = false;
                  }
                }
                this.ChecklistDetailList.push({
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
      for (var i = 0; i < this.ChecklistDetailList.length; i++) {
        if (
          this.preVerificationChecklistData[index].Id ==
          this.ChecklistDetailList[i].ChecklistId
        ) {
          console.log("in check");
          this.ChecklistDetailList.splice(i, 1);
          this.preVerificationChecklistData[index].isSelectedClose = false;
          console.log("this.createdChecklist", this.ChecklistDetailList);
        }
      }
    }
  }

  checkedCheck(i, isSelectedCheck) {
    for (var j = 0; j < this.ChecklistDetailList.length; j++) {
      if (
        this.ChecklistDetailList[j].ChecklistId ==
        this.preVerificationChecklistData[i].Id
      ) {
        this.ChecklistDetailList.splice(j, 1);
      }
      this.preVerificationChecklistData[i].isSelectedClose = false;
    }
    if (isSelectedCheck == false) {
      this.ChecklistDetailList.push({
        ChecklistId: this.preVerificationChecklistData[i].Id,
        IsChecked: !isSelectedCheck,
        Remarks: "",
      });
      console.log(this.ChecklistDetailList);
    } else if (isSelectedCheck == true) {
      for (var l = 0; l < this.ChecklistDetailList.length; l++) {
        if (
          this.ChecklistDetailList[l].ChecklistId ==
          this.preVerificationChecklistData[i].Id
        ) {
          this.ChecklistDetailList.splice(l, 1);
        }
      }
      console.log(this.ChecklistDetailList);
    }

    this.preVerificationChecklistData[i].isSelectedCheck = !this
      .preVerificationChecklistData[i].isSelectedCheck;
  }
  submitMainData() {
    if (this.httpClient.latitude == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast(
          "??????????????? ?????? ??????????????????????????? ?????? ????????? ??????????????????  ??????????????? ???????????? ????????? ??????????????? ????????????"
        );
      } else {
        this.httpClient.showToast(
          "Please enable the location for this application then submit"
        );
      }
    } else if (this.httpClient.longitude == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast(
          "??????????????? ?????? ??????????????????????????? ?????? ????????? ??????????????????  ??????????????? ???????????? ????????? ??????????????? ????????????"
        );
      } else {
        this.httpClient.showToast(
          "Please enable the location for this application then submit"
        );
      }
    } else if (this.httpClient.latitude == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast(
          "??????????????? ?????? ??????????????????????????? ?????? ????????? ??????????????????  ??????????????? ???????????? ????????? ??????????????? ????????????"
        );
      } else {
        this.httpClient.showToast(
          "Please enable the location for this application then submit"
        );
      }
    } else if (this.httpClient.longitude == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast(
          "??????????????? ?????? ??????????????????????????? ?????? ????????? ??????????????????  ??????????????? ???????????? ????????? ??????????????? ????????????"
        );
      } else {
        this.httpClient.showToast(
          "Please enable the location for this application then submit"
        );
      }
    } else if (this.suitablekhasara == null) {
      if (this.httpClient.currentLanguage == "english") {
        this.httpClient.showToast(
          "Please enter the Suitable khasara for water tank"
        );
      } else {
        this.httpClient.showToast("??????????????? ?????? ????????? ?????? ????????? ????????????????????? ???????????? ???????????? ????????????");
      }
    } else if (
      this.preVerificationChecklistData.length !=
      this.ChecklistDetailList.length
    ) {
      if (this.httpClient.currentLanguage == "english") {
        this.httpClient.showToast("Please select all item of checklist");
      } else {
        this.httpClient.showToast("??????????????? ???????????????????????? ?????? ????????? ???????????? ?????? ????????? ????????????");
      }
    } else {
      var self = this;
      var tempOfflineFlag;
      if (this.httpClient.isOffline == true) {
        tempOfflineFlag = 1;
      } else {
        tempOfflineFlag = 0;
      }
      var sendRequestData = {
        obj: {
          usrnm: "rajkisan",
          psw: "rajkisan@123",
          srvnm: "PreVerification",
          srvmethodnm: "AddPreverificationBasicData",
          srvparam: JSON.stringify({
            IsFarmerAcceptance: "Yes",
            NotAcceptanceDocPath: "",
            ApplicationId: this.getPreVerificationData.ApplicationId,
            roleid: this.httpClient.userData.roleid,
            userid: this.httpClient.userData.userid,
            schemeid: this.getPreVerificationData.SubsidySchemeId,
            KhasraNo: this.suitablekhasara,
            latitude: this.httpClient.latitude,
            longitude: this.httpClient.longitude,
            AppVersion: this.httpClient.currentAppVersion,
            IsOnline_Offline: tempOfflineFlag,
            ChecklistDetailList: this.ChecklistDetailList,
          }),
        },
      };
      if (this.httpClient.isOffline) {
        var sendRequestDataOffline = {
          obj: {
            usrnm: "rajkisan",
            psw: "rajkisan@123",
            srvnm: "PreVerification",
            srvmethodnm: "AddPreverificationBasicData",
            srvparam: JSON.stringify({
              IsFarmerAcceptance: "Yes",
              NotAcceptanceDocPath: "",
              ApplicationId: this.getPreVerificationData.ApplicationId,
              roleid: this.httpClient.userData.roleid,
              userid: this.httpClient.userData.userid,
              schemeid: this.getPreVerificationData.SubsidySchemeId,
              KhasraNo: this.suitablekhasara,
              latitude: this.httpClient.latitude,
              longitude: this.httpClient.longitude,
              AppVersion: this.httpClient.currentAppVersion,
              IsOnline_Offline: tempOfflineFlag,
              ChecklistDetailList: this.ChecklistDetailList,
            }),
          },
        };
        var temp = this.getPreVerificationData;
        temp.mainDataSubmit = sendRequestDataOffline;
        var query = this.dbService.storage
          .executeSql(`UPDATE preVerificationOfflineWaterTank SET applicationData = '${JSON.stringify(temp)}'
                      WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
  `,
            []
          )
          .then(() => {
            this.successAlert();
          })
          .catch((e) => {
            alert("error " + JSON.stringify(e));
          });
      } else {
        self.httpClient.showLoading();
        this.httpClient.post(sendRequestData).subscribe(function (res: any) {
          console.log("res", res);
          if (res[0].status == 0) {
            self.preVerificationId = res[0].data[0].AddStatus;
            self.successAlert();
            // self.preVerificationId=
          } else {
            if (res[0].data == "") {
              self.httpClient.showToast(res[0].message);
            } else {
              self.httpClient.showToast(res[0].data);
            }
            // self.httpClient.showToast(res.message);
          }
          // self.httpClient.showToast(res.message);
          self.httpClient.dismissLoading();
        },
          (error) => {
            // self.httpClient.dismissLoading();
            var errorRequestData = {
              'obj': {
                'usrnm': 'rajkisan',
                'psw': 'rajkisan@123',
                srvresponce: error,
                userid: self.httpClient.userData.userid,
                srvnm: "PreVerification",
                srvmethodnm: "AddPreverificationBasicData",
                srvparam: JSON.stringify({
                  IsFarmerAcceptance: "Yes",
                  NotAcceptanceDocPath: "",
                  ApplicationId: self.getPreVerificationData.ApplicationId,
                  roleid: self.httpClient.userData.roleid,
                  userid: self.httpClient.userData.userid,
                  schemeid: self.getPreVerificationData.SubsidySchemeId,
                  KhasraNo: self.suitablekhasara,
                  latitude: self.httpClient.latitude,
                  longitude: self.httpClient.longitude,
                  AppVersion: self.httpClient.currentAppVersion,
                  IsOnline_Offline: tempOfflineFlag,
                  ChecklistDetailList: self.ChecklistDetailList,
                }),
              }
            };
            console.log('errorRequestData new', errorRequestData);
            self.httpClient.getErrorMobileLogs(errorRequestData);
            self.httpClient.showToastError();
          }

        );
      }
    }
  }
  async successAlert() {
    if (this.httpClient.currentLanguage == "english") {
      const alert = await this.alertController.create({
        header: "Alert",
        subHeader:
          "Successfully submitted now please submit the required photos",
        backdropDismiss: false,
        buttons: [
          {
            text: "Okay",
            handler: () => {
              // this.navCtrl.pop();
              this.mainDataSubmittedFlag = true;
            },
          },
        ],
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: "Alert",
        subHeader: "????????????????????????????????? ????????? ???????????? ????????? ?????? ??????????????? ??????????????? ??????????????? ??????????????? ????????? ",
        backdropDismiss: false,
        buttons: [
          {
            text: "????????? ",
            handler: () => {
              this.mainDataSubmittedFlag = true;
            },
          },
        ],
      });

      await alert.present();
    }
  }
  selectImage(flag, columnName) {
    var sendRequestData: any;
    var tempOfflineFlag;
    if (this.httpClient.isOffline == true) {
      tempOfflineFlag = 1;
    } else {
      tempOfflineFlag = 0;
    }

    this.camera.getPicture(this.httpClient.options).then(
      (imageData) => {

        let options: FileUploadOptions;
        if (flag == 0 || flag == 1) {
          options = {
            fileKey: "files",
            params: {
              id: this.preVerificationId,
              AppName: "PVapp",
              tableName: "Subsidy_PreVerificationDocList",
              columnName: columnName,
              uniqueidcolumnname: "PreVerificationDocListId",
              IsDirectUpload: "False",
            },
          };
        } else {
          options = {
            fileKey: "files",
            params: {
              AppName: "PVapp",
              IsDirectUpload: "True",
            },
          };
        }
        console.log("options", options);
        if (this.httpClient.isOffline) {
          this.dbService.storage.executeSql("SELECT * FROM preVerificationOfflineWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
            var temp = JSON.parse(res.rows.item(0).applicationData);
            if (flag == 0) {
              temp.imageOfnajariyaNaksha = imageData;
              temp.optionsOFnajariyaNaksha = options;
              console.log("temp", temp);
              let data = [JSON.stringify(temp)];
              this.dbService.storage.executeSql(`UPDATE preVerificationOfflineWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                .then(() => {
                  this.najariyaNaksha = imageData;
                })
                .catch((e) => {
                  console.log("error " + JSON.stringify(e));
                });
            } else if (flag == 1) {
              temp.imgFarmerAndOfficerWithFarmPond = imageData;
              temp.optionsOFimgFarmerAndOfficerWithFarmPond = options;
              let data = [JSON.stringify(temp)];
              this.dbService.storage.executeSql(`UPDATE preVerificationOfflineWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                .then(() => {
                  this.imgFarmerAndOfficerWithFarmPond = imageData;
                })
                .catch((e) => {
                  alert("error " + JSON.stringify(e));
                });
              // this.imgFarmerAndOfficerWithFarmPond = temp[0].data;
            } else if (flag == 2) {
              temp.imageOFimgFarmerWithOfficerNoCase = imageData;
              temp.optionsOFimgFarmerWithOfficerNoCase = options;
              console.log("temp", temp);
              let data = [JSON.stringify(temp)];
              this.dbService.storage.executeSql(`UPDATE preVerificationOfflineWaterTank SET applicationData = ?
                     WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                .then(() => {
                  var date2 = new Date();
                  this.imgFarmerWithOfficerNoCaseDateTime =
                    date2.getFullYear() +
                    "-" +
                    (date2.getMonth() + 1) +
                    "-" +
                    date2.getDate() +
                    " " +
                    date2.getHours() +
                    ":" +
                    date2.getMinutes() +
                    ":" +
                    date2.getSeconds();
                  this.imgFarmerWithOfficerNoCase = imageData;
                })
                .catch((e) => {
                  console.log("error " + JSON.stringify(e));
                });
            } else if (flag == 3) {
              temp.imageOFfarmerNonConsentLetter = imageData;
              temp.optionsOFfarmerNonConsentLetter = options;
              console.log("temp", temp);



              let data = [JSON.stringify(temp)];
              this.dbService.storage.executeSql(`UPDATE preVerificationOfflineWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                .then(() => {

                  var date1 = new Date();
                  this.farmerNonConsentLetterDateTime =
                    date1.getFullYear() +
                    "-" +
                    (date1.getMonth() + 1) +
                    "-" +
                    date1.getDate() +
                    " " +
                    date1.getHours() +
                    ":" +
                    date1.getMinutes() +
                    ":" +
                    date1.getSeconds();
                  this.farmerNonConsentLetter = imageData;
                })
                .catch((e) => {
                  console.log("error " + JSON.stringify(e));
                });
            }
          })
            .catch((e) => {
              alert("error " + JSON.stringify(e));
            });
        }
        else {
          this.httpClient.showLoading();
          this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then(
            (data) => {
              this.httpClient.dismissLoading();
              // success
              var temp = JSON.parse(data.response);
              console.log("temp[0].data", temp[0].data);
              if (flag == 0) {
                this.najariyaNaksha = temp[0].data;
                var date = new Date();
                var tempDateOfnajariyaNakshaDateTime;
                tempDateOfnajariyaNakshaDateTime =
                  date.getFullYear() +
                  "-" +
                  (date.getMonth() + 1) +
                  "-" +
                  date.getDate() +
                  " " +
                  date.getHours() +
                  ":" +
                  date.getMinutes() +
                  ":" +
                  date.getSeconds();
              } else if (flag == 1) {
                this.imgFarmerAndOfficerWithFarmPond = temp[0].data;
                var date1 = new Date();
                var tempDateOfIimgFarmerAndOfficerWithFarmPondDateTime;
                tempDateOfIimgFarmerAndOfficerWithFarmPondDateTime =
                  date1.getFullYear() +
                  "-" +
                  (date1.getMonth() + 1) +
                  "-" +
                  date1.getDate() +
                  " " +
                  date1.getHours() +
                  ":" +
                  date1.getMinutes() +
                  ":" +
                  date1.getSeconds();
              } else if (flag == 2) {
                this.imgFarmerWithOfficerNoCase = imageData;
                var date2 = new Date();
                this.imgFarmerWithOfficerNoCaseDateTime =
                  date2.getFullYear() +
                  "-" +
                  (date2.getMonth() + 1) +
                  "-" +
                  date2.getDate() +
                  " " +
                  date2.getHours() +
                  ":" +
                  date2.getMinutes() +
                  ":" +
                  date2.getSeconds();
              } else if (flag == 3) {
                this.farmerNonConsentLetter = imageData;
                var date1 = new Date();
                this.farmerNonConsentLetterDateTime ==
                  date1.getFullYear() +
                  "-" +
                  (date1.getMonth() + 1) +
                  "-" +
                  date1.getDate() +
                  " " +
                  date1.getHours() +
                  ":" +
                  date1.getMinutes() +
                  ":" +
                  date1.getSeconds();
              }
            },
            (err) => {
              this.httpClient.dismissLoading();
              console.log("err", err);
            }
          );
        }
      },
      (err) => {
        // Handle error
      }
    );
  }
  submitNoFormFinal() {
    if (this.httpClient.latitude == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast(
          "??????????????? ?????? ??????????????????????????? ?????? ????????? ??????????????????  ??????????????? ???????????? ????????? ??????????????? ????????????"
        );
      } else {
        this.httpClient.showToast(
          "Please enable the location for this application then submit"
        );
      }
    } else if (this.httpClient.longitude == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast(
          "??????????????? ?????? ??????????????????????????? ?????? ????????? ??????????????????  ??????????????? ???????????? ????????? ??????????????? ????????????"
        );
      } else {
        this.httpClient.showToast(
          "Please enable the location for this application then submit"
        );
      }
    } else if (this.httpClient.latitude == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast(
          "??????????????? ?????? ??????????????????????????? ?????? ????????? ??????????????????  ??????????????? ???????????? ????????? ??????????????? ????????????"
        );
      } else {
        this.httpClient.showToast(
          "Please enable the location for this application then submit"
        );
      }
    } else if (this.httpClient.longitude == null) {
      if (this.httpClient.currentLanguage == "hindi") {
        this.httpClient.showToast(
          "??????????????? ?????? ??????????????????????????? ?????? ????????? ??????????????????  ??????????????? ???????????? ????????? ??????????????? ????????????"
        );
      } else {
        this.httpClient.showToast(
          "Please enable the location for this application then submit"
        );
      }
    } else if (this.farmerNonConsentLetter == null) {
      if (this.httpClient.currentLanguage == "english") {
        this.httpClient.showToast("Please upload Farmer non-consent letter");
      } else {
        this.httpClient.showToast("???????????? ?????????????????? ???????????? ??????????????? ????????????");
      }
    } else if (this.imgFarmerWithOfficerNoCase == null) {
      if (this.httpClient.currentLanguage == "english") {
        this.httpClient.showToast("Please upload photo of farmer with officer");
      } else {
        this.httpClient.showToast(
          "???????????? ????????????????????? ?????? ????????? ??????????????? ?????? ???????????? ??????????????? ????????????"
        );
      }
    } else {
      var self = this;
      var tempOfflineFlag;
      if (this.httpClient.isOffline == true) {
        tempOfflineFlag = 1;
      } else {
        tempOfflineFlag = 0;
      }
      var sendRequestData = {
        obj: {
          usrnm: "rajkisan",
          psw: "rajkisan@123",
          srvnm: "PreVerification",
          srvmethodnm: "AddPreverificationBasicData",
          srvparam: JSON.stringify({
            IsFarmerAcceptance: "No",
            NotAcceptanceDocPath: this.farmerNonConsentLetter,
            NotAcceptanceDocPathDateTime: this.farmerNonConsentLetterDateTime,
            ApplicationId: this.getPreVerificationData.ApplicationId,
            ImgFarmerAndOfficerDateTime: this.imgFarmerWithOfficerNoCaseDateTime,
            roleid: this.httpClient.userData.roleid,
            userid: this.httpClient.userData.userid,
            schemeid: this.getPreVerificationData.SubsidySchemeId,
            KhasraNo: "",
            latitude: this.httpClient.latitude,
            longitude: this.httpClient.longitude,
            AppVersion: this.httpClient.currentAppVersion,
            ImgFarmer: this.imgFarmerWithOfficerNoCase,
            IsOnline_Offline: tempOfflineFlag,
          }),
        },
      };
      console.log("sendRequestData", sendRequestData);
      if (this.httpClient.isOffline) {
        this.dbService.storage.executeSql("SELECT * FROM preVerificationOfflineWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
          var temp: any;
          if (res.rows.length > 0) {
            temp = JSON.parse(res.rows.item(0).applicationData);
            temp.sendRequestDataFinal = {
              IsFarmerAcceptance: "No",
              NotAcceptanceDocPath: this.farmerNonConsentLetter,
              NotAcceptanceDocPathDateTime: this.farmerNonConsentLetterDateTime,
              ApplicationId: this.getPreVerificationData.ApplicationId,
              ImgFarmerAndOfficerDateTime: this
                .imgFarmerWithOfficerNoCaseDateTime,
              roleid: this.httpClient.userData.roleid,
              userid: this.httpClient.userData.userid,
              schemeid: this.getPreVerificationData.SubsidySchemeId,
              KhasraNo: "",
              latitude: this.httpClient.latitude,
              longitude: this.httpClient.longitude,
              AppVersion: this.httpClient.currentAppVersion,
              ImgFarmer: this.imgFarmerWithOfficerNoCase,
              IsOnline_Offline: tempOfflineFlag,
            };
            this.dbService.storage.executeSql(`UPDATE preVerificationOfflineWaterTank SET applicationData = '${JSON.stringify(temp)}'
              WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'`, []).then(() => {
              self.showPrompt("Successfully submitted!");
            })
              .catch((e) => {
                alert("error " + JSON.stringify(e));
              });
          }
        })
          .catch((e) => {
            alert("error " + JSON.stringify(e));
          });
      } else {
        self.httpClient.showLoading();
        this.httpClient.post(sendRequestData).subscribe(function (res: any) {
          console.log("res", res);
          if (res[0].status == 0) {
            self.showPrompt(res[0].message);
            // self.preVerificationId=
          } else {
            self.farmerNonConsentLetter = null;
            self.farmerNonConsentLetterDateTime = null;
            self.imgFarmerWithOfficerNoCaseDateTime = null;
            self.imgFarmerWithOfficerNoCase = null;
            if (res[0].data == "") {
              self.httpClient.showToast(res[0].message);
            } else {
              self.httpClient.showToast(res[0].data);
            }
            // self.httpClient.showToast(res.message);
          }
          // self.httpClient.showToast(res.message);
          self.httpClient.dismissLoading();
        },
          (error) => {
            // self.httpClient.dismissLoading();
            var errorRequestData = {
              'obj': {
                'usrnm': 'rajkisan',
                'psw': 'rajkisan@123',
                srvresponce: error,
                userid: self.httpClient.userData.userid,
                srvnm: "PreVerification",
                srvmethodnm: "AddPreverificationBasicData",
                srvparam: JSON.stringify({
                  IsFarmerAcceptance: "No",
                  NotAcceptanceDocPath: this.farmerNonConsentLetter,
                  NotAcceptanceDocPathDateTime: this.farmerNonConsentLetterDateTime,
                  ApplicationId: this.getPreVerificationData.ApplicationId,
                  ImgFarmerAndOfficerDateTime: this.imgFarmerWithOfficerNoCaseDateTime,
                  roleid: this.httpClient.userData.roleid,
                  userid: this.httpClient.userData.userid,
                  schemeid: this.getPreVerificationData.SubsidySchemeId,
                  KhasraNo: "",
                  latitude: this.httpClient.latitude,
                  longitude: this.httpClient.longitude,
                  AppVersion: this.httpClient.currentAppVersion,
                  ImgFarmer: this.imgFarmerWithOfficerNoCase,
                  IsOnline_Offline: tempOfflineFlag,
                }),
              }
            };
            console.log('errorRequestData new', errorRequestData);
            self.httpClient.getErrorMobileLogs(errorRequestData);
            self.httpClient.showToastError();
          }
        );
      }
    }
  }
  submitImagesOfYesCase(sendRequestData, flag) {
    var self = this;
    self.httpClient.showLoading();
    this.httpClient.post(sendRequestData).subscribe(function (res: any) {
      console.log("res", res);

      self.httpClient.dismissLoading();
      if (res[0].status == 0) {
        if (flag == 0) {
          self.najariyaNakshaDateTime = "uploaded";
        } else {
          self.imgFarmerAndOfficerWithFarmPondDateTime = "uploaded";
        }
      } else {
        if (flag == 0) {
          self.najariyaNakshaDateTime = null;
          self.najariyaNaksha = null;
        } else {
          self.imgFarmerAndOfficerWithFarmPondDateTime = null;
          self.imgFarmerAndOfficerWithFarmPond = null;
        }
        if (res[0].data == "") {
          self.httpClient.showToast(res[0].message);
        } else {
          self.httpClient.showToast(res[0].data);
        }
        // self.httpClient.showToast(res.message);
      }
      // self.httpClient.showToast(res.message);
    });
  }
  submitFinal() {
    if (this.farmerChoice == "yes") {
      if (this.najariyaNaksha == null) {
        if (this.httpClient.currentLanguage == "english") {
          this.httpClient.showToast("Please upload najariya naksha");
        } else {
          this.httpClient.showToast("??????????????? ?????????????????? ??????????????? ??????????????? ???????????? ");
        }
      } else if (this.imgFarmerAndOfficerWithFarmPond == null) {
        if (this.httpClient.currentLanguage == "english") {
          this.httpClient.showToast(
            "Please upload photo Farmer and officer with water tank"
          );
        } else {
          this.httpClient.showToast("??????????????? ??????????????? ?????? ????????????????????? ?????? ????????? ?????? ????????? ???????????? ??????????????? ???????????? ");
        }
      } else {
        var self = this;
        var sendRequestData = {
          obj: {
            usrnm: "rajkisan",
            psw: "rajkisan@123",
            srvnm: "PreVerification",
            srvmethodnm: "ConfirmPreVerification",
            srvparam: JSON.stringify({
              ApplicationId: this.getPreVerificationData.ApplicationId,
              userid: this.httpClient.userData.userid,
              SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
              roleid: this.httpClient.userData.roleid,
            }),
          },
        };
        if (this.httpClient.isOffline) {
          this.dbService.storage.executeSql("SELECT * FROM preVerificationOfflineWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
            var temp: any;
            if (res.rows.length > 0) {
              temp = JSON.parse(res.rows.item(0).applicationData);
              temp.sendRequestDataFinal = sendRequestData;
              this.dbService.storage.executeSql(`UPDATE preVerificationOfflineWaterTank SET applicationData = '${JSON.stringify(temp)}'
                WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'`, []).then(() => {
                self.showPrompt("Successfully submitted!");
              })
                .catch((e) => {
                  alert("error " + JSON.stringify(e));
                });
            }
          })
            .catch((e) => {
              alert("error " + JSON.stringify(e));
            });
        } else {
          self.httpClient.showLoading();
          this.httpClient.post(sendRequestData).subscribe(function (res: any) {
            console.log("res", res);
            self.httpClient.dismissLoading();
            if (res[0].status == 0) {
              self.showPrompt(res[0].message);
            } else {
              if (res[0].data == "") {
                self.httpClient.showToast(res[0].message);
              } else {
                self.httpClient.showToast(res[0].data);
              }
            }
          },
            (error) => {
              self.httpClient.dismissLoading();
              var errorRequestData = {
                'obj': {
                  'usrnm': 'rajkisan',
                  'psw': 'rajkisan@123',
                  srvresponce: error,
                  userid: self.httpClient.userData.userid,
                  srvnm: "PreVerification",
                  srvmethodnm: "ConfirmPreVerification",
                  srvparam: JSON.stringify({
                    ApplicationId: self.getPreVerificationData.ApplicationId,
                    userid: self.httpClient.userData.userid,
                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                    roleid: self.httpClient.userData.roleid,
                  }),
                }
              };
              console.log('errorRequestData new', errorRequestData);
              self.httpClient.getErrorMobileLogs(errorRequestData);
              self.httpClient.showToastError();
            }
          );
        }
      }
    }
  }
  async showPrompt(msg) {
    if (this.httpClient.currentLanguage == "hindi") {
      const prompt = await this.alertCtrl.create({
        header: "???????????????!",
        message: msg,
        backdropDismiss: false,
        buttons: [
          {
            text: "????????? ??????",
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
  getExtensionNazaria(item) {
    var request: DownloadRequest = {
      uri: item,
      title: "MyDownload",
      description: "",
      mimeType: "",
      visibleInDownloadsUi: true,
      notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
      destinationInExternalFilesDir: {
        dirType: "Downloads",
        subPath: "MyFile.pdf",
      },
    };

    this.downloader
      .download(request)
      .then((location: string) => {
        console.log("File downloaded at:" + location);
        this.fileOpener
          .showOpenWithDialog(location, "application/pdf")
          .then(() => console.log("File is opened"))
          .catch((e) => console.log("Error opening file", e));
      })
      .catch((error: any) => console.error(error));
  }
}
