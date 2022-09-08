import { Component, NgZone, OnInit } from "@angular/core";
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    NavController,
    ModalController,
} from "@ionic/angular";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ActivatedRoute } from "@angular/router";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { CommonService } from "../services/common.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file/ngx";
import { BillModelPage } from "../bill-model/bill-model.page";
import { DomSanitizer } from "@angular/platform-browser";
import {
    Downloader,
    NotificationVisibility,
    DownloadRequest,
} from "@ionic-native/downloader/ngx";
import { DatabaseServiceService } from "../services/database-service.service";
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

@Component({
    selector: "app-diggi-post-verification",
    templateUrl: "./diggi-post-verification.page.html",
    styleUrls: ["./diggi-post-verification.page.scss"],
})
export class DiggiPostVerificationPage {
    // By Aniruddha
    segmentSelected = "work";
    farmerChoice: any = "yes";
    selectedUploadBills: any;
    checkListClose = false;
    dimensionsClose = false;
    photoUploadClose = false;
    postverificationID: any;
    farmerChoiceFlag = true;

    toggleCheckList() {
        this.checkListClose = !this.checkListClose;
    }

    toggleDimensions() {
        this.dimensionsClose = !this.dimensionsClose;
    }

    togglePhotoUpload() {
        this.photoUploadClose = !this.photoUploadClose;
    }

    getPreVerificationData: any = [];
    preVerificationChecklistData: any = [];
    khashraNumber: any;
    createdChecklist: any = [];
    minorIrrigationList: any = [];
    billArray: any = [];
    totalAmountOfBill: any;
    lengthOfUpperFarmPond: number = 0;
    lengthOfBottomFarmPond: number = 0;
    widthOfUpperFarmPond: number = 0;
    widthOfBottomFarmPond: number = 0;
    depthOfFarmPond: number = 0;
    totalDimensionsOfFarmPond: number = 0;
    lat: any;
    lng: any;
    farmerPreviousGrant: any;
    photoFarmerWithOfficer: any;
    photoAffidavit: any;
    photoAffidavitDateTime: any;
    selectedTypeOfDiggi: any;
    selectedTypeOfDiggiAcceptance: any;

    photoKhasaraCertificate: any;
    photoFarmerWithOfficerDateTime: any;
    photoKhasaraCertificateDateTime: any;
    photoFarmerApprovalCertificate: any;
    photoFarmerApprovalCertificateDateTime: any;
    mainDetailsSubmitFlag = false;
    fileTransfer: FileTransferObject;

    listOfBIS: any = [];
    selectedBisNo: any = 0;
    selectedThickness: any = 0;
    listOfSheetThickness: any = [];

    selectedMeansOfIrrigation: any;
    meansOfIrrigationList: any = [];
    selectedMicroIrrigationSystem: any;
    microIrrigationSystemList: any = [];
    isSixMonthOld: any = 'no';
    nakshaTrace: any;

    jamabandiArray: any = [];
    constructor(
        private transfer: FileTransfer,
        private file: File,
        public dbService: DatabaseServiceService,
        private fileOpener: FileOpener,
        private downloader: Downloader,
        private sanitizer: DomSanitizer,
        public modalController: ModalController,
        public zone: NgZone,
        public navCtrl: NavController,
        public actionSheetController: ActionSheetController,
        public storage: Storage,
        public route: ActivatedRoute,
        public loadCtrl: LoadingController,
        public geolocation: Geolocation,
        public document: DocumentViewer,
        private camera: Camera,
        public httpClient: CommonService,
        public alertController: AlertController
    ) {
        this.fileTransfer = this.transfer.create();
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                this.lat = resp.coords.latitude;
                this.lng = resp.coords.longitude;
            })
            .catch((error) => {
                console.log("Error getting location", error);
            });
        this.getPreVerificationData = JSON.parse(
            this.route.snapshot.paramMap.get("obj")
        );
        console.log("this.getPreVerificationData test", this.getPreVerificationData);

        this.khashraNumber = this.getPreVerificationData.KhasraNo;

        if (this.httpClient.isOffline == true) {
            if (this.getPreVerificationData.sendRequestDataOffline) {
                this.mainDetailsSubmitFlag = true;
                this.farmerChoiceFlag = false;
                if (this.getPreVerificationData.billDetails) {
                    this.billArray = this.getPreVerificationData.billDetails;
                }
                if (this.getPreVerificationData.photophotoKhasaraCertificate) {
                    this.photoAffidavit = this.getPreVerificationData.photophotoKhasaraCertificate;
                }
                if (this.getPreVerificationData.photoAffidavit) {
                    this.photoKhasaraCertificate = this.getPreVerificationData.photoAffidavit;
                }
                if (this.getPreVerificationData.photophotophotoFarmerWithOfficer) {
                    this.photoFarmerWithOfficer = this.getPreVerificationData.photophotophotoFarmerWithOfficer;
                }
                if (this.getPreVerificationData.jamabandiArray) {
                    this.isSixMonthOld = 'yes';
                    for (var d = 0; d < this.getPreVerificationData.jamabandiArray.length; d++) {
                        this.jamabandiArray.push({ status: 0, data: (<any>window).Ionic.WebView.convertFileSrc(this.getPreVerificationData.jamabandiArray[d].jamabandiImageData) });

                    }
                    console.log("this.jamabandiArray", this.jamabandiArray);
                }

                if (this.getPreVerificationData.NakshaTrace != "") {
                    this.isSixMonthOld = 'yes';
                    this.nakshaTrace = this.getPreVerificationData.NakshaTrace;
                }

            }

        } else {
            if (parseInt(this.getPreVerificationData.PostVerificationId) > 0) {
                this.mainDetailsSubmitFlag = true;
                this.farmerChoiceFlag = false;
                this.postverificationID = this.getPreVerificationData.PostVerificationId;
                if (this.getPreVerificationData.ImgFarmerWithOfficer != "") {
                    this.photoFarmerWithOfficer = this.getPreVerificationData.ImgFarmerWithOfficer;
                }
                if (this.getPreVerificationData.ImgParchi != "") {
                    this.photoKhasaraCertificate = this.getPreVerificationData.ImgParchi;
                }
                if (
                    this.getPreVerificationData.SecurityCertificate_NazriyaNaksha != ""
                ) {
                    this.photoAffidavit = this.getPreVerificationData.SecurityCertificate_NazriyaNaksha;
                }
                if (this.getPreVerificationData.NakshaTrace != "" && this.getPreVerificationData.NakshaTrace != null) {
                    this.isSixMonthOld = 'yes';
                    this.nakshaTrace = this.getPreVerificationData.NakshaTrace;
                }
                if (this.getPreVerificationData.JamabandiDocuments != "" && this.getPreVerificationData.JamabandiDocuments != null) {
                    // this.photoAffidavit = this.getPreVerificationData.SecurityCertificate;
                    this.isSixMonthOld = 'yes';
                    var tempJamaBandi = this.getPreVerificationData.JamabandiDocuments.split(",");
                    // for()
                    console.log("tempJamaBandi", tempJamaBandi);
                    for (var ani = 0; ani < tempJamaBandi.length; ani++) {
                        var innerJamaBandi = tempJamaBandi[ani].split("$");
                        // var innerJamaBandi={data:tempJamaBandi[ani],status:tempJamaBandi[ani+1]};
                        console.log("innerJamaBandi", innerJamaBandi)
                        this.jamabandiArray.push({ status: innerJamaBandi[0], data: innerJamaBandi[1] });
                    }
                }
                this.getBills();
            }

        }
        this.VerificationChecklist();
        this.getMinorIrrigationList();


        this.getMicroIrrigationSystem();
        this.getListOfMeansofIrrigation();
    }

    getMinorIrrigationList() {
        if (this.httpClient.isOffline) {
            this.minorIrrigationList = this.getPreVerificationData.minorIrrigationList;
        } else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetMinorIrrigation",
                    srvparam: "{}",
                },
            };

            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    if (res[0].status == 0) {
                        self.minorIrrigationList = res[0].data;
                    } else {
                        self.httpClient.showToast(res[0].data);
                    }
                    // self.httpClient.(res[0].message);
                    // self.httpClient.dismissLoading();
                },
                (error) => {
                    // self.httpClient.dismissLoading();
                    var errorRequestData = {
                        obj: {
                            usrnm: "rajkisan",
                            psw: "i75Q7Q6nYgW3rgEitGndNA==",
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "GetMinorIrrigation",
                            srvparam: "{}",
                        },
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }

    getBills() {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "rajkisan@123",
                srvnm: "PostVerification",
                srvmethodnm: "GetPostVerificationBillDetails",
                srvparam: JSON.stringify({
                    ApplicationId: this.getPreVerificationData.ApplicationId,
                    SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                console.log("res", res);
                // self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.billArray = res[0].data;
                } else {
                    // self.httpClient.showToast(res[0].data);
                }
                // self.httpClient.(res[0].message);
            },
            (error) => {
                // self.httpClient.dismissLoading();
                var errorRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "i75Q7Q6nYgW3rgEitGndNA==",
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "PostVerification",
                        srvmethodnm: "GetMinorIrrigation",
                        srvparam: "{}",
                    },
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    calculateTotalDimensionsOfFarmPond() {
        this.totalDimensionsOfFarmPond =
            ((this.lengthOfUpperFarmPond + this.lengthOfBottomFarmPond) / 2) *
            ((this.widthOfUpperFarmPond + this.widthOfBottomFarmPond) / 2) *
            this.depthOfFarmPond;
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

    ionViewDidLoad() {
        console.log("ionViewDidLoad PostActionDetailPage");
    }

    VerificationChecklist() {
        if (this.httpClient.isOffline) {
            this.preVerificationChecklistData = this.getPreVerificationData.checklistData;
        } else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "i75Q7Q6nYgW3rgEitGndNA==",
                    srvnm: "PreVerification",
                    srvmethodnm: "VerificationChecklist",
                    srvparam:
                        "{'SchemeId':'" +
                        this.getPreVerificationData.SubsidySchemeId +
                        "', 'StepName':'Post verification','ApplicationId':'" +
                        this.getPreVerificationData.ApplicationId +
                        "'}",
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    if (res[0].status == 0) {
                        self.preVerificationChecklistData = res[0].data;
                        for (var i = 0; i < self.preVerificationChecklistData.length; i++) {
                            self.preVerificationChecklistData[i].isSelectedClose = false;
                            self.preVerificationChecklistData[i].isSelectedCheck = false;
                        }
                    } else {
                        self.httpClient.showToast(res[0].data);
                    }
                    // self.httpClient.(res[0].message);
                    // self.httpClient.dismissLoading();
                },
                (error) => {
                    // self.httpClient.dismissLoading();
                    var errorRequestData = {
                        obj: {
                            usrnm: "rajkisan",
                            psw: "i75Q7Q6nYgW3rgEitGndNA==",
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PreVerification",
                            srvmethodnm: "VerificationChecklist",
                            srvparam:
                                "{'SchemeId':'" +
                                self.getPreVerificationData.SubsidySchemeId +
                                "', 'StepName':'Post verification','ApplicationId':'" +
                                self.getPreVerificationData.ApplicationId +
                                "'}",
                        },
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }

    }

    async addBill() {
        const modal = await this.modalController.create({
            component: BillModelPage,
            backdropDismiss: false,
        });
        modal.onDidDismiss().then((data) => {
            if (data.data != null) {
                this.uploadBillDetails(data.data.enteredBillDetails);
            }
        });
        return await modal.present();
    }

    calculateTheTotalBillAmount() {
        this.totalAmountOfBill = 0;
        for (var i = 0; i < this.billArray.length; i++) {
            this.totalAmountOfBill = this.totalAmountOfBill + parseInt(this.billArray[i].BillAmount);
        }
    }

    sanitizeImage(billPhoto) {
        return this.sanitizer.bypassSecurityTrustUrl(billPhoto);
    }

    deleteBill(index) {
        if (this.httpClient.isOffline) {
            self.billArray.splice(index, 1);
            self.calculateTheTotalBillAmount();
        } else {
            var self = this;
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "DeleteBillDetails",
                    srvparam: JSON.stringify({
                        PostVerificationBillsId: this.billArray[index]
                            .PostVerificationBillsId,
                    }),
                },
            };
            self.httpClient.showLoading();
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.billArray.splice(index, 1);
                        self.calculateTheTotalBillAmount();
                    } else {
                        self.httpClient.showToast(res[0].data);
                    }
                },
                (error) => {
                    var errorRequestData = {
                        obj: {
                            usrnm: "rajkisan",
                            psw: "i75Q7Q6nYgW3rgEitGndNA==",
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "DeleteBillDetails",
                            srvparam: JSON.stringify({
                                PostVerificationBillsId: self.billArray[index]
                                    .PostVerificationBillsId,
                            }),
                        },
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }

    takePhoto(param, columnName) {
        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {

                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        id: this.postverificationID,
                        AppName: "PVapp",
                        tableName: "FP_PostVerification",
                        columnName: columnName,
                        uniqueidcolumnname: "FP_PostVerificationId",
                        IsDirectUpload: "False",
                    },
                };
                console.log("options", options);
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?",
                        [this.getPreVerificationData.ApplicationId]).then((res) => {
                            var temp = JSON.parse(res.rows.item(0).applicationData);

                            if (param == 3) {
                                temp.photoAffidavit = imageData;
                                temp.optionsOfphotoAffidavit = options;
                            } else if (param == 2) {
                                temp.photophotoKhasaraCertificate = imageData;
                                temp.optionsOfphotoKhasaraCertificate = options;
                            } else if (param == 1) {
                                temp.photophotophotoFarmerWithOfficer = imageData;
                                temp.optionsOfphotophotoFarmerWithOfficer = options;

                            }
                            console.log("temp", temp);

                            console.log("temp", temp);
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                                .then(() => {
                                    if (param == 3) {
                                        this.photoAffidavit = imageData;
                                    } else if (param == 2) {
                                        this.photoKhasaraCertificate = imageData;
                                    } else if (param == 1) {
                                        this.photoFarmerWithOfficer = imageData;
                                    }
                                })
                                .catch((e) => {
                                    console.log("error " + JSON.stringify(e));
                                });

                        })
                        .catch((e) => {
                            alert("error " + JSON.stringify(e));
                        });
                } else {
                    this.httpClient.showLoading();
                    this.fileTransfer
                        .upload(imageData, this.httpClient.imageUploadUrl, options)
                        .then(
                            (data) => {
                                this.httpClient.dismissLoading();
                                // success
                                var temp = JSON.parse(data.response);
                                console.log("temp[0].data", temp[0].data);
                                if (temp[0].data[0].URL) {
                                    if (param == 3) {
                                        this.photoAffidavit = temp[0].data;
                                    } else if (param == 2) {
                                        this.photoKhasaraCertificate = temp[0].data;
                                    } else if (param == 1) {
                                        this.photoFarmerWithOfficer = temp[0].data;
                                    }
                                } else {
                                    this.httpClient.showToastError();
                                }
                            },
                            (err) => {
                                // error

                                this.httpClient.dismissLoading();
                                this.httpClient.showToastError();
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


    finalSubmission() {
        if (this.billArray.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल अपलोड करें ");
            } else {
                this.httpClient.showToast("Please upload bills");
            }
        } else if (this.photoFarmerWithOfficer == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया कृषक व कार्मिक के साथ डिग्गी फोटो लें "
                );
            } else {
                this.httpClient.showToast(
                    "Please take photo of Farmer and Officer With diggi"
                );
            }
        } else if (this.photoAffidavit == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please take photo of Affidavit of Irrigated-Non-Irrigated Land and Security with najariya map"
                );
            } else {
                this.httpClient.showToast(
                    "सिंचित-असिंचित भूमि व सुरक्षा का शपथ पत्र और नजरिया नक्शा फोटो लें "
                );
            }
        } else {
            var self = this;
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "FinalSubmissionPostVerification",
                    srvparam: JSON.stringify({
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        userid: this.httpClient.userData.userid,
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        roleid: self.httpClient.userData.roleid,
                    }),
                },
            };
            if (this.httpClient.isOffline == true) {
                var offlineFinalSubmission = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "FinalSubmissionPostVerification",
                        srvparam: JSON.stringify({
                            ApplicationId: this.getPreVerificationData.ApplicationId,
                            userid: this.httpClient.userData.userid,
                            SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                            roleid: self.httpClient.userData.roleid,
                        }),
                    },
                };
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    temp.finalSubmission = offlineFinalSubmission;

                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                        .then(() => {
                            this.successAlertFinalSubmission();
                        })
                        .catch((e) => {
                            console.log("error " + JSON.stringify(e));
                        });

                })
                    .catch((e) => {
                        alert("error " + JSON.stringify(e));
                    });

            } else {
                self.httpClient.showLoading();
                console.log("sendRequestData", sendRequestData);
                this.httpClient.post(sendRequestData).subscribe(
                    function (res: any) {
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            self.successAlertFinalSubmission();
                        } else {
                            self.httpClient.showToast(res[0].data);
                        }
                    },
                    (error) => {
                        self.httpClient.dismissLoading();
                        self.httpClient.showToast(self.httpClient.errorMessage);
                    }
                );
            }
        }
    }

    async successAlertFinalSubmission() {
        if (this.httpClient.currentLanguage == "english") {
            const alert = await this.alertController.create({
                header: "Alert",
                subHeader: "Successfully Submitted.",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "Okay",
                        handler: () => {
                            this.navCtrl.pop();
                        },
                    },
                ],
            });

            await alert.present();
        } else {
            const alert = await this.alertController.create({
                header: "Alert",
                subHeader: "सफलतापूर्वक जमा किया गया | ",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "ओके ",
                        handler: () => {
                            this.navCtrl.pop();
                        },
                    },
                ],
            });

            await alert.present();
        }
    }

    submitYesForm() {
        // if (this.lat == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast(
        //             "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
        //         );
        //     } else {
        //         this.httpClient.showToast(
        //             "Please enable the location for this application then submit"
        //         );
        //     }
        // } else if (this.lng == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast(
        //             "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
        //         );
        //     } else {
        //         this.httpClient.showToast(
        //             "Please enable the location for this application then submit"
        //         );
        //     }
        // } else
         if (this.khashraNumber == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("निर्मित डिग्गी का खसरा नंबर लिखें");
            } else {
                this.httpClient.showToast("Write the khasara number of made diggi");
            }
        } else if (this.selectedMicroIrrigationSystem == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "डिग्गी के लिए उपलब्ध सूक्ष्म सिंचाई प्रणाली का चयन करें "
                );
            } else {
                this.httpClient.showToast(
                    "Please Select Micro Irrigation system available for Diggi"
                );
            }
        } else if (this.selectedMeansOfIrrigation == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया सिंचाई के साधन का चयन करें ");
            } else {
                this.httpClient.showToast("Please Select Means of Irrigation");
            }
        } else if (
            this.preVerificationChecklistData.length != this.createdChecklist.length
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया सभी चेकलिस्ट को पूर्ण करे");
            } else {
                this.httpClient.showToast("Please complete all checklists");
            }
        } else if (this.selectedTypeOfDiggi == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया डिग्गी का प्रकार चुने");
            } else {
                this.httpClient.showToast("Please select Type of Diggi");
            }
        } else if (
            this.selectedTypeOfDiggi == "Plastic Lining" &&
            this.selectedThickness == 0
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया प्लास्टिक शीट के प्रकार का चयन करें।"
                );
            } else {
                this.httpClient.showToast("Please Select Type of Plastic lining");
            }
        } else if (
            this.selectedTypeOfDiggi == "Plastic Lining" &&
            this.selectedBisNo == 0
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया BIS नंबर का चयन करें।");
            } else {
                this.httpClient.showToast("Please Select BIS Number");
            }
        } else if (
            this.lengthOfUpperFarmPond == 0 ||
            this.lengthOfUpperFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया ऊपरी तरफ की लंबाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Length of Upper side");
            }
        } else if (
            this.lengthOfBottomFarmPond == 0 ||
            this.lengthOfBottomFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया नीचे की ओर की लंबाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Length of Bottom side");
            }
        } else if (
            this.widthOfUpperFarmPond == 0 ||
            this.widthOfUpperFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया ऊपरी तरफ की चौड़ाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Width of Upper side");
            }
        } else if (
            this.widthOfBottomFarmPond == 0 ||
            this.widthOfBottomFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया नीचे की तरफ की चौड़ाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Width of Bottom side");
            }
        } else if (this.depthOfFarmPond == 0 || this.depthOfFarmPond == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया डिग्गी की गहराई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the depth of diggi");
            }
        } else {
            var tempOfflineFlag: any;
            if (this.httpClient.isOffline == true) {
                tempOfflineFlag = 1;
            } else {
                tempOfflineFlag = 0;
            }
            var self = this;

            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "AddDiggiPostVerification",
                    srvparam: JSON.stringify({
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        IrrigationTypeId: this.selectedMeansOfIrrigation,
                        Length:
                            (this.lengthOfUpperFarmPond + this.lengthOfBottomFarmPond) / 2,
                        Width: (this.widthOfUpperFarmPond + this.widthOfBottomFarmPond) / 2,
                        LengthUpper: this.lengthOfUpperFarmPond,
                        LengthBottom: this.lengthOfBottomFarmPond,
                        WidthUpper: this.widthOfUpperFarmPond,
                        WidthBottom: this.widthOfBottomFarmPond,
                        Height: this.depthOfFarmPond,
                        Size: this.totalDimensionsOfFarmPond,
                        ImgFarmerWithOfficer: "",
                        latitude: this.lat,
                        longitude: this.lng,
                        BISID: this.selectedBisNo,
                        ThickNessId: this.selectedThickness,
                        MicroIrrigationId: this.selectedMicroIrrigationSystem,
                        userid: self.httpClient.userData.userid,
                        roleid: self.httpClient.userData.roleid,
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        NotAcceptanceDocPath: "",
                        IsFarmerAcceptance: "Yes",
                        ImgFarmerWithOfficerDate: "",
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        diggitype: this.selectedTypeOfDiggi,
                        diggitypeAcceptance: this.selectedTypeOfDiggiAcceptance,
                        ChecklistDetailList: this.createdChecklist,
                    }),
                },
            };

            console.log("sendRequestData", sendRequestData);
            if (this.httpClient.isOffline == true) {
                var sendRequestDataOffline = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "AddDiggiPostVerification",
                        srvparam: JSON.stringify({
                            ApplicationId: this.getPreVerificationData.ApplicationId,
                            IrrigationTypeId: this.selectedMeansOfIrrigation,
                            Length:
                                (this.lengthOfUpperFarmPond + this.lengthOfBottomFarmPond) / 2,
                            Width: (this.widthOfUpperFarmPond + this.widthOfBottomFarmPond) / 2,
                            LengthUpper: this.lengthOfUpperFarmPond,
                            LengthBottom: this.lengthOfBottomFarmPond,
                            WidthUpper: this.widthOfUpperFarmPond,
                            WidthBottom: this.widthOfBottomFarmPond,
                            Height: this.depthOfFarmPond,
                            Size: this.totalDimensionsOfFarmPond,
                            ImgFarmerWithOfficer: "",
                            latitude: this.lat,
                            longitude: this.lng,
                            BISID: this.selectedBisNo,
                            ThickNessId: this.selectedThickness,
                            MicroIrrigationId: this.selectedMicroIrrigationSystem,
                            userid: self.httpClient.userData.userid,
                            roleid: self.httpClient.userData.roleid,
                            SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                            NotAcceptanceDocPath: "",
                            IsFarmerAcceptance: "Yes",
                            ImgFarmerWithOfficerDate: "",
                            AppVersion: "V." + this.httpClient.currentAppVersion,
                            IsOnline_Offline: tempOfflineFlag,
                            diggitype: this.selectedTypeOfDiggi,
                            diggitypeAcceptance: this.selectedTypeOfDiggiAcceptance,
                            ChecklistDetailList: this.createdChecklist,
                            mobilToVerify: this.getPreVerificationData.mobilToVerify
                        }),
                    },
                };

                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.sendRequestDataOffline = sendRequestDataOffline;
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                            .then(() => {
                                self.successAlert();

                            })
                            .catch((e) => {
                                console.log("error " + JSON.stringify(e));
                            });

                    })
                    .catch((e) => {
                        alert("error " + JSON.stringify(e));
                    });
            } else {
                self.httpClient.showLoading();
                this.httpClient.post(sendRequestData).subscribe(
                    function (res: any) {
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            self.postverificationID = res[0].data[0].PostVerificationId;
                            self.successAlert();
                            // self.uploadBillDetails(res[0].data[0].PostVerificationId);
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
                                'userid': self.httpClient.userData.userid,
                                srvnm: "PostVerification",
                                srvmethodnm: "AddDiggiPostVerification",
                                srvparam: JSON.stringify({
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    IrrigationTypeId: self.selectedMeansOfIrrigation,
                                    Length:
                                        (self.lengthOfUpperFarmPond + self.lengthOfBottomFarmPond) / 2,
                                    Width: (self.widthOfUpperFarmPond + self.widthOfBottomFarmPond) / 2,
                                    LengthUpper: self.lengthOfUpperFarmPond,
                                    LengthBottom: self.lengthOfBottomFarmPond,
                                    WidthUpper: self.widthOfUpperFarmPond,
                                    WidthBottom: self.widthOfBottomFarmPond,
                                    Height: self.depthOfFarmPond,
                                    Size: self.totalDimensionsOfFarmPond,
                                    ImgFarmerWithOfficer: "",
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    BISID: self.selectedBisNo,
                                    ThickNessId: self.selectedThickness,
                                    MicroIrrigationId: self.selectedMicroIrrigationSystem,
                                    userid: self.httpClient.userData.userid,
                                    roleid: self.httpClient.userData.roleid,
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    NotAcceptanceDocPath: "",
                                    IsFarmerAcceptance: "Yes",
                                    ImgFarmerWithOfficerDate: "",
                                    AppVersion: "V." + self.httpClient.currentAppVersion,
                                    IsOnline_Offline: tempOfflineFlag,
                                    diggitype: self.selectedTypeOfDiggi,
                                    diggitypeAcceptance: self.selectedTypeOfDiggiAcceptance,
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
        }
    }

    uploadBillDetails(enteredBillDetails) {
        var self = this;
        if (this.httpClient.isOffline) {

            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?",
                [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    if (!temp.billDetails) {
                        temp.billDetails = [];
                    }
                    console.log("temp", temp);
                    temp.billDetails.push(enteredBillDetails);
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                        .then(() => {
                            self.billArray.push({
                                BillNo: enteredBillDetails.BillNo,
                                BillAmount: enteredBillDetails.BillAmount,
                                BillImg: enteredBillDetails.BillImg,
                                displayImage: enteredBillDetails.displayImage
                            });
                            self.calculateTheTotalBillAmount();
                        })
                        .catch((e) => {
                            console.log("error " + JSON.stringify(e));
                        });

                })
                .catch((e) => {
                    alert("error " + JSON.stringify(e));
                });

        } else {
            self.httpClient.showLoading();
            console.log("enteredBillDetails", enteredBillDetails);
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "AddPostVerificationBillOneByOne",
                    srvparam: JSON.stringify({
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        PostVerificationId: this.postverificationID,
                        userid: self.httpClient.userData.userid,
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        BillNo: enteredBillDetails.BillNo,
                        BillAmount: enteredBillDetails.BillAmount,
                        BillImg: enteredBillDetails.BillImg,
                        BillDate: "",
                    }),
                },
            };
            console.log("sendRequestData", sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.billArray.push({
                            BillNo: enteredBillDetails.BillNo,
                            BillAmount: enteredBillDetails.BillAmount,
                            BillImg: enteredBillDetails.BillImg,
                            displayImage: enteredBillDetails.displayImage,
                            PostVerificationBillsId: res[0].data[0].AddStatus,
                        });
                        self.calculateTheTotalBillAmount();
                    } else {
                        self.httpClient.showToast(res[0].message);
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
                            srvnm: "PostVerification",
                            srvmethodnm: "AddPostVerificationBillOneByOne",
                            srvparam: JSON.stringify({
                                ApplicationId: self.getPreVerificationData.ApplicationId,
                                PostVerificationId: self.postverificationID,
                                userid: self.httpClient.userData.userid,
                                SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                BillNo: enteredBillDetails.BillNo,
                                BillAmount: enteredBillDetails.BillAmount,
                                BillImg: enteredBillDetails.BillImg,
                                BillDate: "",
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

    async successAlert() {
        if (this.httpClient.currentLanguage == "english") {
            const alert = await this.alertController.create({
                header: "Alert",
                subHeader:
                    "Successfully submitted now please submit the required photos and bills",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "Okay",
                        handler: () => {
                            // this.navCtrl.pop();
                            this.mainDetailsSubmitFlag = true;
                            this.farmerChoiceFlag = false;
                        },
                    },
                ],
            });

            await alert.present();
        } else {
            const alert = await this.alertController.create({
                header: "Alert",
                subHeader:
                    "सफलतापूर्वक जमा किया गया  कृपया अब जरूरी फोटोज व बिल अपलोड करे ",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "ओके ",
                        handler: () => {
                            this.mainDetailsSubmitFlag = true;
                            this.farmerChoiceFlag = false;
                        },
                    },
                ],
            });

            await alert.present();
        }
    }

    getExtensionJama() {
    }

    takePhotoNoCase(param) {
        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {

                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        AppName: "PVapp",
                        IsDirectUpload: "True",
                    },
                };
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?",
                        [this.getPreVerificationData.ApplicationId]).then((res) => {
                            var temp = JSON.parse(res.rows.item(0).applicationData);

                            if (param == 5) {
                                temp.photoFarmerWithOfficerNoCase = imageData;
                                temp.optionsOfPhotoFarmerWithOfficerNoCase = options;
                                // this.noCaseDateOfImgFarmer = new Date();
                            } else if (param == 4) {
                                temp.photoFarmerApprovalCertificate = imageData;
                                temp.optionsOfphotoFarmerApprovalCertificate = options;
                                // this.noCaseDateOfImgLetter = new Date();
                            }
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                                .then(() => {
                                    if (param == 5) {
                                        this.photoFarmerWithOfficer = imageData;
                                    } else if (param == 4) {
                                        this.photoFarmerApprovalCertificate = imageData;
                                    }
                                })
                                .catch((e) => {
                                    console.log("error " + JSON.stringify(e));
                                });

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
                        if (temp[0].data) {
                            if (param == 5) {
                                this.photoFarmerWithOfficer = temp[0].data;
                                // this.noCaseDateOfImgFarmer = new Date();
                            } else if (param == 4) {
                                this.photoFarmerApprovalCertificate = temp[0].data;
                                // this.noCaseDateOfImgLetter = new Date();
                            }
                        } else {
                            this.httpClient.showToastError();
                        }
                    },
                        (err) => {
                            // error

                            this.httpClient.dismissLoading();
                            this.httpClient.showToastError();
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

    submitNoForm() {
        // if (this.lat == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast(
        //             "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
        //         );
        //     } else {
        //         this.httpClient.showToast(
        //             "Please enable the location for this application then submit"
        //         );
        //     }
        // } else if (this.lng == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast(
        //             "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
        //         );
        //     } else {
        //         this.httpClient.showToast(
        //             "Please enable the location for this application then submit"
        //         );
        //     }
        // } else
         if (this.photoFarmerWithOfficer == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया कृषक व कार्मिक के साथ डिग्गी फोटो लेंवे"
                );
            } else {
                this.httpClient.showToast(
                    "Please Upload the photo of Farmer and Officer With diggi"
                );
            }
        } else if (this.photoFarmerApprovalCertificate == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया पटवारी द्वारा जारी डिग्गी के खसरा का प्रमाण पत्र फोटो लेंवे"
                );
            } else {
                this.httpClient.showToast(
                    "Please Upload the photo of Khasara certificate of diggi issued by patwari"
                );
            }
        } else {
            var self = this;
            var tempOfflineFlag: any;
            if (this.httpClient.isOffline == true) {
                tempOfflineFlag = 1;
            } else {
                tempOfflineFlag = 0;
            }

            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "AddDiggiPostVerification",
                    srvparam: JSON.stringify({
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        IrrigationTypeId: "",
                        Length: "0",
                        Width: "0",
                        Height: "0",
                        Size: "0",
                        ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                        latitude: this.lat,
                        longitude: this.lng,
                        userid: self.httpClient.userData.userid,
                        roleid: self.httpClient.userData.roleid,
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                        IsFarmerAcceptance: "No",
                        ImgFarmerWithOfficerDate: this.photoFarmerWithOfficerDateTime,
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        diggitype: "",
                        diggitypeAcceptance: "",
                        mobilToVerify: this.getPreVerificationData.ApplicationId.mobilToVerify
                    }),
                },
            };

            console.log("sendRequestData", sendRequestData);
            if (this.httpClient.isOffline == true) {
                var noDataOffline = {
                    ApplicationId: this.getPreVerificationData.ApplicationId,
                    IrrigationTypeId: "",
                    Length: "0",
                    Width: "0",
                    Height: "0",
                    Size: "0",
                    ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                    latitude: this.lat,
                    longitude: this.lng,
                    userid: self.httpClient.userData.userid,
                    roleid: self.httpClient.userData.roleid,
                    SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                    NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                    IsFarmerAcceptance: "No",
                    ImgFarmerWithOfficerDate: this.photoFarmerWithOfficerDateTime,
                    AppVersion: "V." + this.httpClient.currentAppVersion,
                    IsOnline_Offline: tempOfflineFlag,
                    diggitype: "",
                    diggitypeAcceptance: "",
                    mobilToVerify: this.getPreVerificationData.ApplicationId.mobilToVerify
                }

                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);

                        temp.finalSubmission = noDataOffline;

                        console.log("temp", temp);
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                            .then(() => {
                                this.successAlertFinalSubmission();
                            })
                            .catch((e) => {
                                console.log("error " + JSON.stringify(e));
                            });

                    })
                    .catch((e) => {
                        alert("error " + JSON.stringify(e));
                    });
            } else {
                self.httpClient.showLoading();
                this.httpClient.post(sendRequestData).subscribe(
                    function (res: any) {
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            self.successAlertFinalSubmission();
                        } else {
                            self.photoFarmerWithOfficer = null;
                            self.photoFarmerWithOfficerDateTime = null;
                            self.photoFarmerApprovalCertificate = null;
                            self.photoFarmerApprovalCertificateDateTime = null;
                            self.httpClient.showToast(res[0].data);
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
                                srvnm: "PostVerification",
                                srvmethodnm: "AddDiggiPostVerification",
                                srvparam: JSON.stringify({
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    IrrigationTypeId: "",
                                    Length: "0",
                                    Width: "0",
                                    Height: "0",
                                    Size: "0",
                                    ImgFarmerWithOfficer: self.photoFarmerWithOfficer,
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    userid: self.httpClient.userData.userid,
                                    roleid: self.httpClient.userData.roleid,
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    NotAcceptanceDocPath: self.photoFarmerApprovalCertificate,
                                    IsFarmerAcceptance: "No",
                                    ImgFarmerWithOfficerDate: self.photoFarmerWithOfficerDateTime,
                                    AppVersion: "V." + self.httpClient.currentAppVersion,
                                    IsOnline_Offline: tempOfflineFlag,
                                    diggitype: "",
                                    diggitypeAcceptance: "",
                                    mobilToVerify: self.getPreVerificationData.ApplicationId.mobilToVerify
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

    getBisList() {
        if (this.httpClient.isOffline) {
            this.listOfBIS = this.getPreVerificationData.listOfBIS;
        } else {
            var self = this;
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetThicknessAndBISCodeList",
                    srvparam: JSON.stringify({
                        Flag: "0",
                    }),
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (temp) {
                    var res: any = temp[0];

                    if (res.status == 0) {
                        self.httpClient.dismissLoading();

                        self.listOfBIS = res.data;
                        console.log("listOfBIS- > ", self.listOfBIS);
                    } else {
                        self.httpClient.dismissLoading();

                        if (res.data == "") {
                            self.httpClient.showToast(res.message);
                        } else {
                            self.httpClient.showToast(res.data);
                        }
                    }
                },
                (error) => {
                    self.httpClient.dismissLoading();
                    // self.httpClient.showToast(self.httpClient.errorMessage);
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "GetThicknessAndBISCodeList",
                            srvparam: JSON.stringify({
                                Flag: "0",
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

    getSheetThickness() {
        if (this.httpClient.isOffline) {
            this.listOfSheetThickness = this.getPreVerificationData.listOfSheetThickness;
        } else {
            var self = this;
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetThicknessAndBISCodeList",
                    srvparam: JSON.stringify({
                        Flag: "1",
                    }),
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (temp) {
                    var res: any = temp[0];

                    if (res.status == 0) {
                        self.httpClient.dismissLoading();

                        self.listOfSheetThickness = res.data;
                        console.log("listOfSheetThickness- > ", self.listOfSheetThickness);
                    } else {
                        self.httpClient.dismissLoading();

                        if (res.data == "") {
                            self.httpClient.showToast(res.message);
                        } else {
                            self.httpClient.showToast(res.data);
                        }
                    }
                },
                (error) => {
                    self.httpClient.dismissLoading();
                    // self.httpClient.showToast(self.httpClient.errorMessage);
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "GetThicknessAndBISCodeList",
                            srvparam: JSON.stringify({
                                Flag: "1",
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

    diggiTypeSelection(selectedTypeOfDiggi) {
        console.log("selectedTypeOfDiggi--RS --", selectedTypeOfDiggi);
        if (selectedTypeOfDiggi == "Plastic Lining") {
            this.getBisList();
            this.getSheetThickness();
        } else {
            this.selectedThickness = 0;
            this.selectedBisNo = 0;
        }
    }

    getListOfMeansofIrrigation() {
        if (this.httpClient.isOffline) {
            this.meansOfIrrigationList = this.getPreVerificationData.meansOfIrrigationList;
        } else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetMeansofIrrigation",
                    srvparam: "{'AgriLovValuesCode':'MeansofIrrigation'}",
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    if (res[0].status == 0) {
                        self.meansOfIrrigationList = res[0].data;
                    } else {
                        self.httpClient.showToast(res[0].data);
                    }
                    // self.httpClient.(res[0].message);
                    // self.httpClient.dismissLoading();
                },
                (error) => {
                    // self.httpClient.dismissLoading();
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "GetMeansofIrrigation",
                            srvparam: "{'AgriLovValuesCode':'MeansofIrrigation'}",

                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }

    getMicroIrrigationSystem() {
        if (this.httpClient.isOffline) {
            this.microIrrigationSystemList = this.getPreVerificationData.microIrrigationSystemList;
        } else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetMicroIrrigationSystem",
                    srvparam: "{'AgriLovValuesCode':'MicroIrrigationAvailableInApp'}",
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    if (res[0].status == 0) {
                        self.microIrrigationSystemList = res[0].data;
                    } else {
                        self.httpClient.showToast(res[0].data);
                    }
                    // self.httpClient.(res[0].message);
                    // self.httpClient.dismissLoading();
                },
                (error) => {
                    // self.httpClient.dismissLoading();
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "GetMicroIrrigationSystem",
                            srvparam: "{'AgriLovValuesCode':'MicroIrrigationAvailableInApp'}",
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }

    takePhotoJamabandi() {
        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {

                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        SubsidyId: this.getPreVerificationData.SubsidySchemeId,
                        AppName: "PVapp",
                        DocumentMasterId: '3',
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        CreatedBy: this.httpClient.userData.userid,
                        JamabandiFlag: "1"
                    },
                };
                console.log("options", options.params);
                if (!this.httpClient.isOffline) {
                    this.httpClient.showLoading();
                    this.fileTransfer
                        .upload(imageData, this.httpClient.imageUploadUrlForJamaBandi, options)
                        .then(
                            (data) => {
                                this.httpClient.dismissLoading();
                                // success
                                var temp = data.response;
                                var tempTwo = JSON.parse(temp);


                                console.log("data2", JSON.parse(temp));
                                // console.log("data2", JSON.parse(temp));

                                if (parseInt(tempTwo[0].status) > 0) {
                                    this.jamabandiArray.push({ data: tempTwo[0].data, status: tempTwo[0].status })
                                } else {
                                    this.httpClient.showToastError();
                                }
                            }),
                        (err) => {
                            this.httpClient.dismissLoading();
                            console.log("err", err);
                        }
                }
                else {
                    var self = this;
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);

                        // var innerJamaBandi = tempJamaBandi[ani].split("$");
                        // // var innerJamaBandi={data:tempJamaBandi[ani],status:tempJamaBandi[ani+1]};
                        // console.log("innerJamaBandi", innerJamaBandi)
                        // this.jamabandiArray.push({ status: innerJamaBandi[0], data: innerJamaBandi[1] });


                        if (!temp.jamabandiArray) {
                            temp.jamabandiArray = [];
                        }
                        console.log("temp", temp);
                        temp.jamabandiArray.push({ jamabandiImageData: imageData, jamabandiOption: options });
                        console.log("temp", temp);
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                            .then(() => {
                                this.jamabandiArray.push({ status: 0, data: (<any>window).Ionic.WebView.convertFileSrc(imageData) });
                            })
                            .catch((e) => {
                                console.log("error " + JSON.stringify(e));
                            });

                    })
                        .catch((e) => {
                            alert("error " + JSON.stringify(e));
                        });
                }

                (err) => {
                    // Handle error
                }
            }
        );
    }

    deletePhoto(data, i) {
        if (!this.httpClient.isOffline) {
            var self = this;
            var sendRequestData =
            {
                "obj":
                {
                    "usrnm": "rajkisan",
                    "psw": "rajkisan@123",
                    "srvnm": "PostVerification",
                    "srvmethodnm": "DeletePVDocument",
                    "srvparam": JSON.stringify({
                        'ApplicationId': this.getPreVerificationData.ApplicationId,
                        'SubsidySchemeId': this.getPreVerificationData.SubsidySchemeId,
                        'SubsidyDocumentsId': data.status
                    })
                }
            }
            this.httpClient.post(sendRequestData).subscribe(
                function (temp) {
                    var res: any = temp[0];

                    if (res.status == 0) {
                        self.jamabandiArray.splice(i, 1);
                        self.httpClient.dismissLoading();


                    } else {
                        self.httpClient.dismissLoading();

                        if (res.data == "") {
                            self.httpClient.showToast(res.message);
                        } else {
                            self.httpClient.showToast(res.data);
                        }
                    }
                },
                (error) => {
                    self.httpClient.dismissLoading();
                    self.httpClient.showToastError();
                }
            );
        }

        else {
            var self = this;
            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);

                temp.jamabandiArray.splice(i, 1)
                console.log("temp", temp);
                let data = [JSON.stringify(temp)];
                this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                    .then(() => {
                        this.jamabandiArray.splice(i, 1)
                    })
                    .catch((e) => {
                        console.log("error " + JSON.stringify(e));
                    });

            })
                .catch((e) => {
                    alert("error " + JSON.stringify(e));
                });
        }
    }

    takePhotoNakshaTrace() {
        this.camera.getPicture(this.httpClient.options).then((imageData) => {

            let options: FileUploadOptions = {
                fileKey: "files",
                params: {
                    SubsidyId: this.getPreVerificationData.SubsidySchemeId,
                    AppName: "PVapp",
                    DocumentMasterId: '1',
                    ApplicationId: this.getPreVerificationData.ApplicationId,
                    CreatedBy: this.httpClient.userData.userid,
                    JamabandiFlag: "1"
                },
            };
            console.log("options", options.params);
            if (!this.httpClient.isOffline) {
                this.httpClient.showLoading();
                this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrlForJamaBandi, options).then(
                    (data) => {
                        this.httpClient.dismissLoading();
                        // success
                        console.log("data", data);
                        var temp = data.response;
                        var tempTwo = JSON.parse(temp);


                        console.log("data2", JSON.parse(temp));
                        // console.log("data2", JSON.parse(temp));

                        if (parseInt(tempTwo[0].status) > 0) {
                            this.nakshaTrace = tempTwo[0].data;
                        } else {
                            this.httpClient.showToastError();
                        }
                    }),
                    (err) => {
                        this.httpClient.dismissLoading();
                        console.log("err", err);
                    }
                (err) => {
                    // Handle error
                }
            }
            else {

                var self = this;
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    console.log("temp", temp);
                    temp.NakshaTrace = { nakshaTraceImage: imageData, nakshaTraceOptions: options }
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfDiggi SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data).then(() => {
                        self.nakshaTrace = imageData;
                    })
                        .catch((e) => {
                            console.log("error " + JSON.stringify(e));
                        });

                })
                    .catch((e) => {
                        console.log("error " + JSON.stringify(e));
                    });

            }


        })
            , (err) => ({
                // Handle error
            });
    }
    viewPhoto(item,i){

    }
}
