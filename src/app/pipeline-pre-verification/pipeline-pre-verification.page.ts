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

import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@Component({
    selector: "app-pipeline-pre-verification",
    templateUrl: "./pipeline-pre-verification.page.html",
    styleUrls: ["./pipeline-pre-verification.page.scss"],
})
export class PipelinePreVerificationPage implements OnInit {
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
    EstimatedPipelineLength: any;

    ngOnInit() {
    }

    sourceofIrrigation: any;
    sourceofIrrigationDateTime: any;
    offlineData: any;
    fileTransfer: any;

    constructor(
        public androidPermissions: AndroidPermissions,
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
        public alertController: AlertController,
        public locationAccuracy: LocationAccuracy
    ) {
        this.fileTransfer = this.transfer.create();
        this.checkGPSPermission();
        this.getPreVerificationData = JSON.parse(
            this.route.snapshot.paramMap.get("obj")
        );
        this.khasraNo = this.getPreVerificationData.KhasraNo;
        this.preVerificationId = this.getPreVerificationData.PreVerificationId;

        console.log("this.getPreVerificationData", this.getPreVerificationData);
        if (this.httpClient.isOffline) {
            if (this.getPreVerificationData.mainDataSubmit) {
                this.mainDataSubmittedFlag = true;
                this.mobileToVerify = this.getPreVerificationData.mobilToVerify;
                if (this.getPreVerificationData.imageOFImgfarmerWithOfficer) {
                    this.imgFarmerAndOfficerWithFarmPond = this.getPreVerificationData.imageOFImgfarmerWithOfficer;
                }
                if (this.getPreVerificationData.imageOFImgSignedMap) {
                    this.najariyaNaksha = this.getPreVerificationData.imageOFImgSignedMap;
                    this.najariyaNakshaDateTime = new Date();
                }
                if (this.getPreVerificationData.imageOFImgSourceOfIrrigation) {
                    this.sourceofIrrigation = this.getPreVerificationData.imageOFImgSourceOfIrrigation;
                    this.sourceofIrrigationDateTime = new Date();
                }

                if (this.getPreVerificationData.najariyaNakshaSubmit != undefined && this.getPreVerificationData.najariyaNakshaSubmit != null) {

                    this.najariyaNaksha = "uploaded";
                    this.najariyaNakshaDateTime = new Date();
                }
                if (this.getPreVerificationData.ImgFarmerSubmit != undefined && this.getPreVerificationData.ImgFarmerSubmit != null) {
                    this.mainDataSubmittedFlag = true;
                    this.imgFarmerAndOfficerWithFarmPond = "uploaded";
                    this.imgFarmerAndOfficerWithFarmPondDateTime = new Date();
                }

                if (this.getPreVerificationData.ImgSourceOfIrrigation != "" && this.getPreVerificationData.ImgSourceOfIrrigation != null) {
                    this.mainDataSubmittedFlag = true;
                    this.sourceofIrrigation = "uploaded";
                    this.sourceofIrrigationDateTime = new Date();
                }

            }
            // ImgSourceOfIrrigation
        } else {
            if (parseInt(this.preVerificationId) > 0) {
                this.mainDataSubmittedFlag = true;
                if (this.getPreVerificationData.ImgSignedMap != "" && this.getPreVerificationData.ImgSignedMap != null) {
                    this.najariyaNaksha = this.getPreVerificationData.ImgSignedMap;
                    this.najariyaNakshaDateTime = new Date();
                }
                if (this.getPreVerificationData.ImgfarmerWithOfficer != "" && this.getPreVerificationData.ImgfarmerWithOfficer != null) {
                    this.imgFarmerAndOfficerWithFarmPond = this.getPreVerificationData.ImgfarmerWithOfficer;
                    this.imgFarmerAndOfficerWithFarmPondDateTime = new Date();
                }
                if (this.getPreVerificationData.ImgSourceOfIrrigation != "" && this.getPreVerificationData.ImgSourceOfIrrigation != null) {
                    this.sourceofIrrigation = this.getPreVerificationData.ImgSourceOfIrrigation;
                    this.sourceofIrrigationDateTime = new Date();
                }
            }
        }

        console.log(this.httpClient.userData);
        this.getCheckList();
        // this.geolocation.getCurrentPosition({ timeout: 30000, enableHighAccuracy: true }).then((resp) => {
        //     this.httpClient.latitude = resp.coords.latitude;
        //     this.httpClient.longitude = resp.coords.longitude;
        // })
        //     .catch((error) => {
        //     });
    }
    checkGPSPermission() {
        // this.httpClient.showLoading();
        this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then((result) => {
            if (result.hasPermission) {
                //If having permission show 'Turn On GPS' dialogue
                this.askToTurnOnGPS();
            } else {
                //If not having permission ask for permission
                this.requestGPSPermission();
            }
        },
            (err) => {
                alert(err);
            }
        );
    }
    requestGPSPermission() {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                console.log('4');
            } else {
                //Show 'GPS Permission Request' dialogue
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(() => {
                    // call method to turn on GPS
                    this.askToTurnOnGPS();
                },
                    (error) => {
                        //Show alert if user click on 'No Thanks'
                        alert('requestPermission Error requesting location permissions ' + error);
                    }
                );
            }
        });
    }
    askToTurnOnGPS() {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
            // When GPS Turned ON call method to get Accurate location coordinates
            this.getLoc();
        },
            (error) =>
                alert(
                    'Error requesting location permissions ' + JSON.stringify(error)
                )
        );
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
    getLoc() {

        this.geolocation.getCurrentPosition().then((resp) => {
            this.httpClient.latitude = resp.coords.latitude;
            this.httpClient.longitude = resp.coords.longitude;
            // this.httpClient.dismissLoading();
        })
            .catch((error) => {
                this.httpClient.dismissLoading();
                console.log('Error getting location', error);
                this.httpClient.showToast('Please Enable Location!!!');

            });
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
            // if (this.getPreVerificationData.SubsidySchemeId == '5') {
            //   for (var i = 0; i < this.ChecklistDetailList.length; i++) {
            //     if (this.preVerificationChecklistData[index].Id == this.ChecklistDetailList[i].ChecklistId) {
            //       this.ChecklistDetailList.splice(i, 1);
            //       this.preVerificationChecklistData[i].isSelectedCheck = false;
            //     }
            //   }
            //   this.ChecklistDetailList.push({
            //     'ChecklistId': this.preVerificationChecklistData[index].Id,
            //     'IsChecked': false,
            //     'Remarks': ''
            //   });
            //   this.preVerificationChecklistData[index].isSelectedClose = true;
            // }
            // else {
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
            // }
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
                    "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please enable the location for this application then submit"
                );
            }
        } else if (this.httpClient.longitude == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please enable the location for this application then submit"
                );
            }
        } else if (this.suitablekhasara == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please enter the Suitable khasara for pipelione"
                );
            } else {
                this.httpClient.showToast(
                    "कृपया पाइपलाइन के लिए उपयुक्त खसरा दर्ज करें"
                );
            }
        }
        else if (this.EstimatedPipelineLength == null || this.EstimatedPipelineLength == 0) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please enter the Estimated length of pipeline"
                );
            } else {
                this.httpClient.showToast(
                    "कृपया पाइपलाइन की अनुमानित लंबाई"
                );
            }
        }

        // EstimatedPipelineLength
        else if (
            this.preVerificationChecklistData.length !=
            this.ChecklistDetailList.length
        ) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Please select all item of checklist");
            } else {
                this.httpClient.showToast("कृपया चेकलिस्ट के सभी आइटम का चयन करें");
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
                        EstimatedPipelineLength: this.EstimatedPipelineLength
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
                            mobileToVerify: this.mobileToVerify,
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
                            EstimatedPipelineLength: this.EstimatedPipelineLength,
                        }),
                    },
                };
                var temp = this.getPreVerificationData;
                temp.mainDataSubmit = sendRequestDataOffline;
                var query = this.dbService.storage
                    .executeSql(
                        `
            UPDATE preVerificationOfflinePipeline
            SET applicationSubmissionData = '${JSON.stringify(temp)}'
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
                    });
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
                        text: "Ok",
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
                subHeader: "सफलतापूर्वक जमा किया गया अब कृपया जरूरी फोटोज अपलोड करे ",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "ओके ",
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
                if (flag == 0 || flag == 1 || flag == 4) {
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
                    // preVerificationOfflinePipeline (ApplicationId,applicationSubmissionData

                    this.dbService.storage.executeSql("SELECT * FROM preVerificationOfflinePipeline WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationSubmissionData);
                        if (flag == 0) {
                            temp.imageOFImgSignedMap = imageData;
                            temp.optionsOFImgSignedMap = options;
                            console.log("temp", temp);
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE preVerificationOfflinePipeline SET applicationSubmissionData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                                .then(() => {
                                    this.najariyaNaksha = imageData;
                                })
                                .catch((e) => {
                                    console.log("error " + JSON.stringify(e));
                                });
                        } else if (flag == 1) {
                            temp.imageOFImgfarmerWithOfficer = imageData;
                            temp.optionsOFImgfarmerWithOfficer = options;
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE preVerificationOfflinePipeline SET applicationSubmissionData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                                .then(() => {
                                    this.imgFarmerAndOfficerWithFarmPond = imageData;
                                })
                                .catch((e) => {
                                    alert("error " + JSON.stringify(e));
                                });
                            // this.imgFarmerAndOfficerWithFarmPond = temp[0].data;
                        } else if (flag == 4) {
                            temp.imageOFImgSourceOfIrrigation = imageData;
                            temp.optionsOFImgSourceOfIrrigation = options;
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE preVerificationOfflinePipeline SET applicationSubmissionData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                                .then(() => {
                                    this.sourceofIrrigation = imageData;
                                })
                                .catch((e) => {
                                    alert("error " + JSON.stringify(e));
                                });

                        } else if (flag == 2) {
                            temp.imageOFimgFarmerWithOfficerNoCase = imageData;
                            temp.optionsOFimgFarmerWithOfficerNoCase = options;
                            console.log("temp", temp);
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE preVerificationOfflinePipeline SET applicationSubmissionData = ?
                                 WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                                .then(() => {
                                    var date2 = new Date();
                                    this.imgFarmerAndOfficerWithFarmPondDateTime =
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
                            this.dbService.storage.executeSql(`UPDATE preVerificationOfflinePipeline SET applicationSubmissionData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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

                } else {
                    this.httpClient.showLoading();
                    this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then((data) => {
                        this.httpClient.dismissLoading();
                        // success
                        var temp = JSON.parse(data.response);

                        console.log("temp[0].data", temp[0].data);
                        if (temp[0].data[0].URL) {
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
                            }
                            else if (flag == 4) {
                                this.sourceofIrrigation = temp[0].data;
                                var date1 = new Date();
                                var tempDateOfIimgsourceofIrrigation;
                                tempDateOfIimgsourceofIrrigation =
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
                        } else if (temp[0].data) {
                            if (flag == 2) {
                                this.imgFarmerWithOfficerNoCase = temp[0].data;
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
                                this.farmerNonConsentLetter = temp[0].data;
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
                            } else {
                                this.httpClient.showToastError();
                                this.httpClient.dismissLoading();
                            }
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
                    "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please enable the location for this application then submit"
                );
            }
        } else if (this.httpClient.longitude == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
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
                this.httpClient.showToast("कृषक असहमति पत्र अपलोड करें");
            }
        } else if (this.imgFarmerWithOfficerNoCase == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Please upload photo of farmer with officer");
            } else {
                this.httpClient.showToast(
                    "कृषक अधिकारी के साथ किसान का फोटो अपलोड करें"
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
                    }),
                },
            };
            console.log("sendRequestData", sendRequestData);
            if (this.httpClient.isOffline) {
                var sendRequestDataOffline = {
                    IsFarmerAcceptance: "No",
                    mobileToVerify: this.mobileToVerify,
                    NotAcceptanceDocPath: this.farmerNonConsentLetter,
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
                }
                this.dbService.storage
                    .executeSql(
                        "SELECT * FROM preVerificationOfflinePipeline WHERE ApplicationId = ?",
                        [this.getPreVerificationData.ApplicationId]
                    ).then((rews) => {
                        var temp = JSON.parse(rews.rows.item(0).applicationSubmissionData);
                        temp.sendRequestDataFinal = sendRequestDataOffline;
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE preVerificationOfflinePipeline SET applicationSubmissionData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                            .then(() => {
                                self.showPrompt("Successfully submitted!");
                            })
                            .catch((e) => {
                                alert("error " + JSON.stringify(e));
                            });
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
                }
                    ,
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
                                    NotAcceptanceDocPath: self.farmerNonConsentLetter,
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    ImgFarmerAndOfficerDateTime: self.imgFarmerWithOfficerNoCaseDateTime,
                                    roleid: self.httpClient.userData.roleid,
                                    userid: self.httpClient.userData.userid,
                                    schemeid: self.getPreVerificationData.SubsidySchemeId,
                                    KhasraNo: "",
                                    latitude: self.httpClient.latitude,
                                    longitude: self.httpClient.longitude,
                                    AppVersion: self.httpClient.currentAppVersion,
                                    ImgFarmer: self.imgFarmerWithOfficerNoCase,
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
                } else if (flag == 1) {
                    self.imgFarmerAndOfficerWithFarmPondDateTime = "uploaded";
                } else {
                    self.sourceofIrrigationDateTime = "uploaded";
                }
            } else {
                if (flag == 0) {
                    self.najariyaNakshaDateTime = null;
                    self.najariyaNaksha = null;
                } else if (flag == 1) {
                    self.imgFarmerAndOfficerWithFarmPondDateTime = null;
                    self.imgFarmerAndOfficerWithFarmPond = null;
                } else {
                    self.sourceofIrrigationDateTime = null;
                    self.sourceofIrrigation = null;
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
                    this.httpClient.showToast("कृपया नजरिया नक्शा अपलोड करें ");
                }
            } else if (this.imgFarmerAndOfficerWithFarmPond == null) {
                if (this.httpClient.currentLanguage == "english") {
                    this.httpClient.showToast(
                        "Please upload photo Farmer and officer with pipeline"
                    );
                } else {
                    this.httpClient.showToast(
                        "कृपया किसान और अधिकारी पाइपलाइन के साथ फोटो अपलोड करें "
                    );
                }
            } else if (this.sourceofIrrigation == null) {
                if (this.httpClient.currentLanguage == "english") {
                    this.httpClient.showToast(
                        "Please upload photo of source of irrigration"
                    );
                } else {
                    this.httpClient.showToast(
                        "कृपया सिंचाई के स्रोत की फोटो अपलोड करें "
                    );
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
                    this.dbService.storage
                        .executeSql(
                            "SELECT * FROM preVerificationOfflinePipeline WHERE ApplicationId = ?",
                            [this.getPreVerificationData.ApplicationId]
                        )
                        .then((res) => {
                            var temp: any;
                            if (res.rows.length > 0) {
                                temp = JSON.parse(res.rows.item(0).applicationSubmissionData);
                                temp.sendRequestDataFinal = sendRequestData;
                                this.dbService.storage.executeSql(`UPDATE preVerificationOfflinePipeline
                                    SET applicationSubmissionData = '${JSON.stringify(temp)}'
                                    WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'`,
                                    []
                                )
                                    .then(() => {
                                        self.showPrompt("Successfully submitted!");
                                    })
                                    .catch((e) => {
                                        alert("error " + JSON.stringify(e));
                                    });
                            }
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
                    }
                        ,
                        (error) => {
                            // self.httpClient.dismissLoading();
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
    validate(e) {
        // var test = JSON.parse(this.EstimatedPipelineLength);
        console.log("this.EstimatedPipelineLength", this.EstimatedPipelineLength)
        var str2 = this.EstimatedPipelineLength.indexOf("-");

        console.log("str2", str2)
        if (str2 != -1) {
            // this.getKSKOfficeAssetsMaster();
            this.EstimatedPipelineLength = "";
            // e.target.value = "";
            this.httpClient.showToast('Only Numbers are Allow in this field')
        }
    }
}
