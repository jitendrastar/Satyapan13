import { BillModelFarmImplementPage } from "./../bill-model-farm-implement/bill-model-farm-implement.page";
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
    selector: "app-water-tank-post-verification",
    templateUrl: "./water-tank-post-verification.page.html",
    styleUrls: ["./water-tank-post-verification.page.scss"],
})
export class WaterTankPostVerificationPage {
    // By Aniruddha
    segmentSelected = "work";
    farmerChoice: any = "yes";
    selectedUploadBills: any;
    checkListClose = true;
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
    billArray: any = [];
    totalAmountOfBill: any;
    lengthOfFarmPond: number = 0;
    widthOfFarmPond: number = 0;

    lengthOfUpperFarmPond: number = 0;
    lengthOfBottomFarmPond: number = 0;
    widthOfUpperFarmPond: number = 0;
    widthOfBottomFarmPond: number = 0;
    depthOfFarmPond: number = 0;
    totalDimensionsOfFarmPond: number = 0;
    lat: any;
    lng: any;
    farmerPreviousGrant: any;

    photoAffidavit: any;
    photoAffidavitDateTime: any;

    photoKhasaraCertificate: any;
    photoFarmerWithOfficerDateTime: any;
    photoKhasaraCertificateDateTime: any;
    photoFarmerApprovalCertificate: any;
    photoFarmerApprovalCertificateDateTime: any;
    mainDetailsSubmitFlag = true;

    // NEW CODE
    basicDetailsSubmit = true;
    billAndPhotoFlag = false;
    selectedTypeWaterTank: any;
    lengthOfFarmPondSqure: any = 0;
    radiusOfFarmPond: any = 0;
    fileTransfer: any;
    photoIrrigationBarSlip: any;
    photoFarmerWithOfficer: any;
    listOfWaterTankType: any = [];
    noCaseDateOfImgFarmer: any;
    noCaseDateOfImgLetter: any;

    selectedMeansOfIrrigation: any;
    meansOfIrrigationList: any = [];
    selectedMicroIrrigationSystem: any;
    microIrrigationSystemList: any = [];
    isSixMonthOld: any = 'no';
    nakshaTrace: any;

    jamabandiArray: any = [];
    constructor(
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
        public alertController: AlertController,
        private transfer: FileTransfer,
        private file: File
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
        this.khashraNumber = this.getPreVerificationData.KhasraNo;

        if (this.httpClient.isOffline == true) {
            console.log("this.getPreVerificationData", this.getPreVerificationData);
            this.preVerificationChecklistData = this.getPreVerificationData.preVerificationChecklistData;
            this.listOfWaterTankType = this.getPreVerificationData.listOfWaterTankType;
            this.meansOfIrrigationList = this.getPreVerificationData.meansOfIrrigationList;
            this.microIrrigationSystemList = this.getPreVerificationData.microIrrigationSystemList;
            if (this.getPreVerificationData.sendRequestDataOffline) {
                this.basicDetailsSubmit = false;
                this.billAndPhotoFlag = true;
                this.mainDetailsSubmitFlag = true;
                this.farmerChoiceFlag = false;
            }
            if (this.getPreVerificationData.billDetails) {
                this.billArray = this.getPreVerificationData.billDetails;
            }

            if (this.getPreVerificationData.photoFarmerWithOfficer) {
                this.photoFarmerWithOfficer = this.getPreVerificationData.photoFarmerWithOfficer;
            }
            if (this.getPreVerificationData.photoIrrigationBarSlip) {
                this.photoIrrigationBarSlip = this.getPreVerificationData.photoIrrigationBarSlip;
            }
            if (this.getPreVerificationData.photoAffidavit) {
                this.photoAffidavit = this.getPreVerificationData.photoAffidavit;
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

        } else {
           
            if (parseInt(this.getPreVerificationData.PostVerificationId) > 0) {
                this.basicDetailsSubmit = false;
                this.billAndPhotoFlag = true;
                this.postverificationID = this.getPreVerificationData.PostVerificationId;
                if (this.getPreVerificationData.ImgFarmerWithOfficer != "") {
                    this.photoFarmerWithOfficer = this.getPreVerificationData.ImgFarmerWithOfficer;
                }
                if (this.getPreVerificationData.ImgParchi != "") {
                    this.photoIrrigationBarSlip = this.getPreVerificationData.ImgParchi;
                }
                if (this.getPreVerificationData.SecurityCertificate_NazriyaNaksha != "") {
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
            this.VerificationChecklist();
            // this.microIrrigationPlantWaterType();
            this.getListOfWaterTankType();
            this.getMicroIrrigationSystem();
            this.getListOfMeansofIrrigation();
        }
    }

    getBills() {
        var self = this;
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
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "PostVerification",
                        srvmethodnm: "GetPostVerificationBillDetails",
                        srvparam: JSON.stringify({
                            ApplicationId: self.getPreVerificationData.ApplicationId,
                            SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    reset() {
        this.depthOfFarmPond = this.widthOfFarmPond = this.radiusOfFarmPond = this.lengthOfFarmPond = 0;
    }

    calculateTotalDimensionsOfFarmPondCircle() {
        this.totalDimensionsOfFarmPond =
            3.14 * this.radiusOfFarmPond * this.depthOfFarmPond;
    }

    calculateTotalDimensionsOfFarmPondSqure() {
        this.depthOfFarmPond = this.widthOfFarmPond = this.lengthOfFarmPond;
        this.totalDimensionsOfFarmPond =
            this.lengthOfFarmPond * this.widthOfFarmPond * this.lengthOfFarmPond;
    }

    getListOfWaterTankType() {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "rajkisan@123",
                srvnm: "PostVerification",
                srvmethodnm: "GetWaterStorageTypeLov",
                srvparam: "{'AgriLovValuesCode':'ShapeWaterTank'}",
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                console.log("res", res);
                if (res[0].status == 0) {
                    self.listOfWaterTankType = res[0].data;
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
                        srvmethodnm: "GetWaterStorageTypeLov",
                        srvparam: "{'AgriLovValuesCode':'ShapeWaterTank'}",
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    calculateTotalDimensionsOfFarmPond() {
        console.log("test");
        this.totalDimensionsOfFarmPond =
            // this.lengthOfFarmPond * this.widthOfFarmPond * this.depthOfFarmPond;
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
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "PreVerification",
                        srvmethodnm: "VerificationChecklist",
                        srvparam:
                            "{'SchemeId':'" +
                            this.getPreVerificationData.SubsidySchemeId +
                            "', 'StepName':'Post verification','ApplicationId':'" +
                            this.getPreVerificationData.ApplicationId +
                            "'}",
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    async addBill() {
        // this.httpClient.selectedId = this.postverificationID;
        const modal = await this.modalController.create({
            component: BillModelFarmImplementPage,
            cssClass: "my-custom-class",
            backdropDismiss: false,
            componentProps: {
                asDate: null,
            },
            //
        });
        modal.onDidDismiss().then((data) => {
            if (data.data != null) {
                this.uploadBillDetails(data.data.enteredBillDetails);
            }
        });
        return await modal.present();
    }

    uploadBillDetails(enteredBillDetails) {
        var self = this;
        var imageUrl: any;
        if (this.httpClient.isOffline) {
            this.dbService.storage.executeSql(
                "SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?",
                [this.getPreVerificationData.ApplicationId]
            ).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);
                if (!temp.billDetails) {
                    temp.billDetails = [];
                }
                console.log("temp", temp);
                temp.billDetails.push(enteredBillDetails);
                console.log("temp", temp);
                let data = temp;
                this.dbService.storage.executeSql(
                    `
                  UPDATE postVerificationOfflineOfWaterTank
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `,
                    []
                )
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
                        BillDate: enteredBillDetails.BillDate,
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
                                BillDate: enteredBillDetails.BillDate,
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

    calculateTheTotalBillAmount() {
        this.totalAmountOfBill = 0;
        for (var i = 0; i < this.billArray.length; i++) {
            this.totalAmountOfBill = this.totalAmountOfBill + parseInt(this.billArray[i].BillAmount);
        }
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
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "DeleteBillDetails",
                            srvparam: JSON.stringify({
                                PostVerificationBillsId: this.billArray[index]
                                    .PostVerificationBillsId,
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

    sanitizeImage(billPhoto) {
        this.sanitizer.bypassSecurityTrustUrl(billPhoto);
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
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                        console.log("second");
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        console.log("third");
                        if (param == 1) {
                            temp.photoFarmerWithOfficer = imageData;
                            temp.optionOfPhotoFarmerWithOfficer = options;
                        } else if (param == 2) {
                            temp.photoIrrigationBarSlip = imageData;
                            temp.optionOfPhotoIrrigationBarSlip = options;
                        } else if (param == 3) {
                            temp.photoAffidavit = imageData;
                            temp.optionOfPhotoAffidavit = options;
                        }

                        let data = temp;
                        this.dbService.storage.executeSql(
                            `
                  UPDATE postVerificationOfflineOfWaterTank
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `,
                            []
                        ).then(() => {

                            if (param == 1) {
                                this.photoFarmerWithOfficer = imageData;
                            } else if (param == 2) {
                                this.photoIrrigationBarSlip = imageData;
                            } else if (param == 3) {
                                this.photoAffidavit = imageData;
                            }

                        })
                            .catch((e) => {
                                console.log("err one");
                                console.log("error " + e + JSON.stringify(e));
                            });

                    })
                        .catch((e) => {
                            console.log("err two", e);
                            alert("error " + e + JSON.stringify(e));
                        });

                } else {
                    this.httpClient.showLoading();
                    this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then((data) => {
                        this.httpClient.dismissLoading();
                        // success
                        var temp = JSON.parse(data.response);
                        console.log("temp[0].data", temp[0].data);
                        if (temp[0].data[0].URL) {
                            if (param == 1) {
                                this.photoFarmerWithOfficer = temp[0].data;
                            } else if (param == 2) {
                                this.photoIrrigationBarSlip = temp[0].data;
                            } else if (param == 3) {
                                this.photoAffidavit = temp[0].data;
                            }
                        } else {
                            this.httpClient.showToastError();
                        }
                    },
                        (err) => {
                            // error

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

    takePhotoNoCase(param, columnName) {
        // photoImplemenWIthFarmer

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
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                        console.log("second");
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        console.log("third");
                        if (param == 1) {
                            temp.photoFarmerWithOfficerNoCase = imageData;
                            temp.optionOfphotoFarmerWithOfficerNoCase = options;
                        } else if (param == 4) {
                            temp.photoFarmerApprovalCertificateNoCase = imageData;
                            temp.optionOfphotoFarmerApprovalCertificateNoCase = options;
                        }

                        let data = temp;
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfWaterTank
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `, []
                        ).then(() => {

                            if (param == 1) {
                                this.photoFarmerWithOfficer = imageData;
                                this.noCaseDateOfImgFarmer = new Date();
                            } else if (param == 4) {
                                this.photoFarmerApprovalCertificate = imageData;
                                this.noCaseDateOfImgLetter = new Date();
                            }

                        })
                            .catch((e) => {
                                console.log("err one");
                                console.log("error " + e + JSON.stringify(e));
                            });

                    })
                        .catch((e) => {
                            console.log("err two", e);
                            alert("error " + e + JSON.stringify(e));
                        });
                } else {
                    this.httpClient.showLoading();
                    this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then((data) => {
                        this.httpClient.dismissLoading();
                        // success
                        var temp = JSON.parse(data.response);
                        console.log("temp[0].data", temp[0].data);
                        if (temp[0].data) {
                            if (param == 1) {
                                this.photoFarmerWithOfficer = temp[0].data;
                                this.noCaseDateOfImgFarmer = new Date();
                            } else if (param == 4) {
                                this.photoFarmerApprovalCertificate = temp[0].data;
                                this.noCaseDateOfImgLetter = new Date();
                            }
                        } else {
                            this.httpClient.showToastError();
                            this.httpClient.dismissLoading();
                        }

                    },
                        (err) => {
                            // error
                            this.httpClient.showToastError();
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


    finalSubmission() {
        if (this.billArray.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल का विवरण जोड़ें ");
            } else {
                this.httpClient.showToast("Please Add Bill Details");
            }
        } else if (this.photoFarmerWithOfficer == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया कृषक व कार्मिक के साथ फोटो लें ");
            } else {
                this.httpClient.showToast(
                    "Please take photo of Farmer and Officer With Water Tank"
                );
            }
        } else if (this.photoAffidavit == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please take photo of Security with najariya map"
                );
            } else {
                this.httpClient.showToast("नजरिया नक्शा फोटो लें ");
            }
        } else if (this.photoIrrigationBarSlip == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Please take photo of Irrigation bar slip");
            } else {
                this.httpClient.showToast("सिंचाई बारी की पर्ची फोटो लें ");
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
                var offlineFinalSubmission = sendRequestData;
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    temp.finalSubmission = offlineFinalSubmission;

                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                        var errorRequestData = {
                            'obj': {
                                'usrnm': 'rajkisan',
                                'psw': 'rajkisan@123',
                                srvresponce: error,
                                userid: self.httpClient.userData.userid,
                                srvnm: "PostVerification",
                                srvmethodnm: "FinalSubmissionPostVerification",
                                srvparam: JSON.stringify({
                                    ApplicationId: this.getPreVerificationData.ApplicationId,
                                    userid: this.httpClient.userData.userid,
                                    SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
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

    selectImage(test, testtest) {
    }

    submitYesForm() {
        if (
            this.preVerificationChecklistData.length != this.createdChecklist.length
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया सभी चेकलिस्ट को पूर्ण करे");
            } else {
                this.httpClient.showToast("Please complete all checklists");
            }
        } else if (this.selectedMicroIrrigationSystem == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "जल हौज के लिए उपलब्ध सूक्ष्म सिंचाई प्रणाली का चयन करें "
                );
            } else {
                this.httpClient.showToast(
                    "Please Select Micro Irrigation system available for Water Tank"
                );
            }
        } else if (this.selectedMeansOfIrrigation == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया सिंचाई के साधन का चयन करें ");
            } else {
                this.httpClient.showToast("Please Select Means of Irrigation");
            }
        }
        // else if (this.selectedIrrigration == null) {
        //   if (this.httpClient.currentLanguage == "hindi") {
        //     this.httpClient.showToast(
        //       "कृपया जल हौज पर उपलब्ध सूक्ष्म सिंचाई संयंत्र का चयन करे"
        //     );
        //   } else {
        //     this.httpClient.showToast(
        //       "Please Select the minor irrigation available on water tank"
        //     );
        //   }
        // }
        else if (this.selectedTypeWaterTank == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया जल हौज का प्रकार");
            } else {
                this.httpClient.showToast("Please Type of Water Tank");
            }
        }

        //
        // else if (
        //   this.selectedTypeWaterTank == "201" &&
        //   this.lengthOfFarmPond == 0
        // ) {
        //   if (this.httpClient.currentLanguage == "hindi") {
        //     this.httpClient.showToast("कृपया जल हौज की लंबाई दर्ज करें");
        //   } else {
        //     this.httpClient.showToast("Please enter the length of Water Tank");
        //   }
        // } else if (
        //   this.selectedTypeWaterTank == "201" &&
        //   this.widthOfFarmPond == 0
        // ) {
        //   if (this.httpClient.currentLanguage == "hindi") {
        //     this.httpClient.showToast("कृपया जल हौज की चौड़ाई दर्ज करें");
        //   } else {
        //     this.httpClient.showToast("Please enter the width of Water Tank");
        //   }
        // }
        else if (
            (this.selectedTypeWaterTank == "201" &&
                this.lengthOfUpperFarmPond == 0) ||
            this.lengthOfUpperFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया ऊपरी तरफ की लंबाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Length of Upper side");
            }
        } else if (
            (this.selectedTypeWaterTank == "201" &&
                this.lengthOfBottomFarmPond == 0) ||
            this.lengthOfBottomFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया नीचे की ओर की लंबाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Length of Bottom side");
            }
        } else if (
            (this.selectedTypeWaterTank == "201" && this.widthOfUpperFarmPond == 0) ||
            this.widthOfUpperFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया ऊपरी तरफ की चौड़ाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Width of Upper side");
            }
        } else if (
            (this.selectedTypeWaterTank == "201" &&
                this.widthOfBottomFarmPond == 0) ||
            this.widthOfBottomFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया नीचे की तरफ की चौड़ाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Width of Bottom side");
            }
        } else if (
            this.selectedTypeWaterTank == "201" &&
            this.depthOfFarmPond == 0
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया जल हौज की गहराई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the depth of Water Tank");
            }
        }

        //
        // else if (
        //   this.selectedTypeWaterTank == "203" &&
        //   this.lengthOfFarmPond == 0
        // ) {
        //   if (this.httpClient.currentLanguage == "hindi") {
        //     this.httpClient.showToast("कृपया जल हौज की लंबाई दर्ज करें");
        //   } else {
        //     this.httpClient.showToast("Please enter the length of Water Tank");
        //   }
        // }
        //
        //
        else if (
            (this.selectedTypeWaterTank == "203" &&
                this.lengthOfUpperFarmPond == 0) ||
            this.lengthOfUpperFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया ऊपरी तरफ की लंबाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Length of Upper side");
            }
        } else if (
            (this.selectedTypeWaterTank == "203" &&
                this.lengthOfBottomFarmPond == 0) ||
            this.lengthOfBottomFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया नीचे की ओर की लंबाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Length of Bottom side");
            }
        } else if (
            (this.selectedTypeWaterTank == "203" && this.widthOfUpperFarmPond == 0) ||
            this.widthOfUpperFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया ऊपरी तरफ की चौड़ाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Width of Upper side");
            }
        } else if (
            (this.selectedTypeWaterTank == "203" &&
                this.widthOfBottomFarmPond == 0) ||
            this.widthOfBottomFarmPond == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया नीचे की तरफ की चौड़ाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Width of Bottom side");
            }
        } else if (
            this.selectedTypeWaterTank == "203" &&
            this.depthOfFarmPond == 0
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया जल हौज की गहराई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the depth of Water Tank");
            }
        } else if (
            this.selectedTypeWaterTank == "204" &&
            this.radiusOfFarmPond == 0
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया जल हौज की त्रिज्या दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the Radius of Water Tank");
            }
        } else if (
            this.selectedTypeWaterTank == "204" &&
            this.depthOfFarmPond == 0
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया जल हौज की गहराई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the depth of Water Tank");
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
                    srvnm: "PostVerification",
                    srvmethodnm: "AddWaterStorageTankPostVerification",
                    srvparam: JSON.stringify({
                        IsFarmerAcceptance: "Yes",
                        NotAcceptanceDocPath: "",
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        latitude: this.lat,
                        longitude: this.lng,
                        roleid: self.httpClient.userData.roleid,
                        userid: self.httpClient.userData.userid,
                        ChecklistDetailList: this.createdChecklist,
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        radius: this.radiusOfFarmPond,
                        // Length: this.lengthOfFarmPond,
                        // Width: this.widthOfFarmPond,
                        Length:
                            (this.lengthOfUpperFarmPond + this.lengthOfBottomFarmPond) / 2,
                        Width: (this.widthOfUpperFarmPond + this.widthOfBottomFarmPond) / 2,
                        LengthUpper: this.lengthOfUpperFarmPond,
                        LengthBottom: this.lengthOfBottomFarmPond,
                        WidthUpper: this.widthOfUpperFarmPond,
                        WidthBottom: this.widthOfBottomFarmPond,
                        Height: this.depthOfFarmPond,
                        mobilToVerify: "1",
                        // MicroIrrPlantOnWaterStorage: this.selectedIrrigration,
                        IrrigationTypeId: this.selectedMeansOfIrrigation,
                        MicroIrrigationId: this.selectedMicroIrrigationSystem,
                        ImgFarmerWithOfficerDateTime: null,
                        ImgParchiDateTime: null,
                        SecurityCertificate_NazriyaNakshaDateTime: null,
                        WaterStorageType: this.selectedTypeWaterTank,
                    }),
                },
            };
            console.log("sendRequestData", sendRequestData);
            if (this.httpClient.isOffline == true) {
                var offlineYesSubmit = sendRequestData;
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.sendRequestDataOffline = offlineYesSubmit;
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                            .then(() => {
                                self.basicDetailsSubmit = false;
                                self.billAndPhotoFlag = true;
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
                this.httpClient.post(sendRequestData).subscribe(function (res: any) {
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.postverificationID = res[0].data[0].PostVerificationId;
                        self.basicDetailsSubmit = false;
                        self.billAndPhotoFlag = true;
                        self.successAlert();
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
                                srvnm: "PostVerification",
                                srvmethodnm: "AddWaterStorageTankPostVerification",
                                srvparam: JSON.stringify({
                                    IsFarmerAcceptance: "Yes",
                                    NotAcceptanceDocPath: "",
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    roleid: self.httpClient.userData.roleid,
                                    userid: self.httpClient.userData.userid,
                                    ChecklistDetailList: self.createdChecklist,
                                    AppVersion: "V." + self.httpClient.currentAppVersion,
                                    IsOnline_Offline: tempOfflineFlag,
                                    radius: self.radiusOfFarmPond,
                                    // Length: this.lengthOfFarmPond,
                                    // Width: this.widthOfFarmPond,
                                    Length:
                                        (self.lengthOfUpperFarmPond + self.lengthOfBottomFarmPond) / 2,
                                    Width: (self.widthOfUpperFarmPond + self.widthOfBottomFarmPond) / 2,
                                    LengthUpper: self.lengthOfUpperFarmPond,
                                    LengthBottom: self.lengthOfBottomFarmPond,
                                    WidthUpper: self.widthOfUpperFarmPond,
                                    WidthBottom: self.widthOfBottomFarmPond,
                                    Height: self.depthOfFarmPond,
                                    mobilToVerify: "1",
                                    // MicroIrrPlantOnWaterStorage: this.selectedIrrigration,
                                    IrrigationTypeId: self.selectedMeansOfIrrigation,
                                    MicroIrrigationId: self.selectedMicroIrrigationSystem,
                                    ImgFarmerWithOfficerDateTime: null,
                                    ImgParchiDateTime: null,
                                    SecurityCertificate_NazriyaNakshaDateTime: null,
                                    WaterStorageType: self.selectedTypeWaterTank,
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
                subHeader: "सफलतापूर्वक जमा किया गया अब कृपया जरूरी फोटोज अपलोड करे ",
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

    submitNoForm() {
        if (this.httpClient.latitude == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया इस एप्लिकेशन के लिए लोकेशन सक्षम करें फिर सबमिट करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please enable the location for this application then submit"
                );
            }
        } else if (this.httpClient.longitude == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया इस एप्लिकेशन के लिए लोकेशन सक्षम करें फिर सबमिट करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please enable the location for this application then submit"
                );
            }
        } else if (this.photoFarmerWithOfficer == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया कृषक व कार्मिक का फोटो लेंवे");
            } else {
                this.httpClient.showToast(
                    "Please Upload the photo of Farmer and Officer"
                );
            }
        } else if (this.photoFarmerApprovalCertificate == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया स्वीकृति पत्र का फोटो अपलोड करें");
            } else {
                this.httpClient.showToast(
                    "Please Upload the photo of not acceptance later"
                );
            }
        } else {
            var tempOfflineFlag;
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
                    srvmethodnm: "AddWaterStorageTankPostVerification",
                    srvparam: JSON.stringify({
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        userid: self.httpClient.userData.userid,
                        WaterStorageType: "0",
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        latitude: this.lat,
                        longitude: this.lng,
                        roleid: self.httpClient.userData.roleid,
                        radius: "0",
                        Length: "0",
                        Width: "0",
                        LengthUpper: "0",
                        LengthBottom: "0",
                        WidthUpper: "0",
                        WidthBottom: "0",
                        Height: "0",
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        mobilToVerify: "1",
                        IsFarmerAcceptance: "No",
                        // MicroIrrPlantOnWaterStorage: "0",
                        IrrigationTypeId: "0",
                        MicroIrrigationId: "0",
                        NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                        NotAcceptanceDocPathDateTime: this.noCaseDateOfImgLetter,
                        ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                        ImgFarmerWithOfficerDateTime: this.noCaseDateOfImgFarmer,
                    }),
                },
            };

            console.log("sendRequestData", sendRequestData);
            if (this.httpClient.isOffline == true) {
                var noDataOffline = {
                    ApplicationId: this.getPreVerificationData.ApplicationId,
                    userid: self.httpClient.userData.userid,
                    WaterStorageType: "0",
                    SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                    latitude: this.lat,
                    longitude: this.lng,
                    roleid: self.httpClient.userData.roleid,
                    radius: "0",
                    Length: "0",
                    Width: "0",
                    LengthUpper: "0",
                    LengthBottom: "0",
                    WidthUpper: "0",
                    WidthBottom: "0",
                    Height: "0",
                    AppVersion: "V." + this.httpClient.currentAppVersion,
                    IsOnline_Offline: tempOfflineFlag,
                    mobilToVerify: "1",
                    IsFarmerAcceptance: "No",
                    // MicroIrrPlantOnWaterStorage: "0",
                    IrrigationTypeId: "0",
                    MicroIrrigationId: "0",
                    NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                    NotAcceptanceDocPathDateTime: this.noCaseDateOfImgLetter,
                    ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                    ImgFarmerWithOfficerDateTime: this.noCaseDateOfImgFarmer,
                };
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    temp.finalSubmission = noDataOffline;

                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                                srvmethodnm: "AddWaterStorageTankPostVerification",
                                srvparam: JSON.stringify({
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    userid: self.httpClient.userData.userid,
                                    WaterStorageType: "0",
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    roleid: self.httpClient.userData.roleid,
                                    radius: "0",
                                    Length: "0",
                                    Width: "0",
                                    LengthUpper: "0",
                                    LengthBottom: "0",
                                    WidthUpper: "0",
                                    WidthBottom: "0",
                                    Height: "0",
                                    AppVersion: "V." + self.httpClient.currentAppVersion,
                                    IsOnline_Offline: tempOfflineFlag,
                                    mobilToVerify: "1",
                                    IsFarmerAcceptance: "No",
                                    // MicroIrrPlantOnWaterStorage: "0",
                                    IrrigationTypeId: "0",
                                    MicroIrrigationId: "0",
                                    NotAcceptanceDocPath: self.photoFarmerApprovalCertificate,
                                    NotAcceptanceDocPathDateTime: self.noCaseDateOfImgLetter,
                                    ImgFarmerWithOfficer: self.photoFarmerWithOfficer,
                                    ImgFarmerWithOfficerDateTime: self.noCaseDateOfImgFarmer,
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

    getListOfMeansofIrrigation() {
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
                self.httpClient.dismissLoading();
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

    getMicroIrrigationSystem() {
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
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
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
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);

                temp.jamabandiArray.splice(i, 1)
                console.log("temp", temp);
                let data = [JSON.stringify(temp)];
                this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    console.log("temp", temp);
                    temp.NakshaTrace = { nakshaTraceImage: imageData, nakshaTraceOptions: options }
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfWaterTank SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data).then(() => {
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
    viewPhoto(data,i){

    }
}
