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

import { File } from "@ionic-native/file/ngx";

@Component({
    selector: "app-farm-implements-post-verification",
    templateUrl: "./farm-implements-post-verification.page.html",
    styleUrls: ["./farm-implements-post-verification.page.scss"],
})
export class FarmImplementsPostVerificationPage {
    // By Aniruddha
    segmentSelected = "work";
    farmerChoice: any = "yes";
    selectedUploadBills: any;
    checkListClose = false;
    dimensionsClose = false;
    photoUploadClose = true;
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
    depthOfFarmPond: number = 0;
    totalDimensionsOfFarmPond: number = 0;
    lat: any;
    lng: any;
    farmerPreviousGrant: any;
    photoFarmerWithOfficer: any;
    photoAffidavit: any;
    photoAffidavitDateTime: any;

    photoKhasaraCertificate: any;
    photoFarmerWithOfficerDateTime: any;
    photoKhasaraCertificateDateTime: any;
    photoFarmerApprovalCertificate: any;
    photoFarmerApprovalCertificateDateTime: any;

    // new code

    mainDetailsSubmitFlag = true;
    uploadBillFlag = false;
    uploadPhotoFlag = false;
    farmerAgreeFlag = true;
    dealerList: any = [];
    listOfbhp: any = [];
    listOfImplementCategory: any = [];
    listOfDistrict: any = [];
    selectredDealer: any;
    selectedRate: any;
    photoImplemenWIthFarmer: any;
    rcValid: any = "";
    fileTransfer: FileTransferObject;
    photoRCrenew: any;
    photoRcRnewalReceipt: any;
    selectedBHP: any = 0;
    selectedImplementCategory: any = 0;
    ImgFarmerWithOfficerNoCase: any;
    selectredDistrict: any;



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
        this.getPreVerificationData = JSON.parse(
            this.route.snapshot.paramMap.get("obj")
        );
        if (this.getPreVerificationData.FarmImplementType == "Tractor/Power Operated") {
            this.rcValid = "no";
        }
        this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
        })
            .catch((error) => {
                console.log("Error getting location", error);
            });

        this.khashraNumber = this.getPreVerificationData.KhasraNo;
        if (this.httpClient.isOffline) {
            this.VerificationChecklist();
            this.getBHP();
            this.getDistrict();

            if (this.getPreVerificationData.sendRequestDataOffline) {
                this.mainDetailsSubmitFlag = false;
                this.farmerChoiceFlag = false;
                this.uploadBillFlag = true;
                this.uploadPhotoFlag = true;
                this.farmerAgreeFlag = false;
                if (this.getPreVerificationData.billDetails) {

                    this.billArray = this.getPreVerificationData.billDetails;
                }
                if (this.getPreVerificationData.photoFphotoRcRnewalReceipt) {
                    this.photoRcRnewalReceipt = this.getPreVerificationData.photoFphotoRcRnewalReceipt;
                }
                if (this.getPreVerificationData.photoImplemenWIthFarmer) {
                    this.photoImplemenWIthFarmer = this.getPreVerificationData.photoImplemenWIthFarmer;
                }
                if (this.getPreVerificationData.photoRCrenew) {
                    this.photoRCrenew = this.getPreVerificationData.photoRCrenew;
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

        }
        else {
            if (parseInt(this.getPreVerificationData.PostVerificationId) > 0) {
                this.mainDetailsSubmitFlag = false;
                this.farmerChoiceFlag = false;
                this.uploadBillFlag = true;
                this.uploadPhotoFlag = true;
                this.farmerAgreeFlag = false;
                this.postverificationID = this.getPreVerificationData.PostVerificationId;
                this.photoRcRnewalReceipt = this.getPreVerificationData.RC_ReceiptPhoto;
                this.photoRCrenew = this.getPreVerificationData.RC_RenewalPhoto;
                this.photoImplemenWIthFarmer = this.getPreVerificationData.ImgFarmerWithOfficer;
                this.rcValid = this.getPreVerificationData.isRCvalid;
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
            } else {
                // this.;
                this.VerificationChecklist();
                this.getBHP();
                this.getDistrict();
            }
        }
    }

    getDistrict() {
        if (this.httpClient.isOffline) {
            this.listOfDistrict = this.getPreVerificationData.listOfDistrict;
        }
        else {
            var self = this;
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "GetMasterData",
                    srvmethodnm: "getmasterdataforMobilebytable",
                    srvparam: JSON.stringify({
                        tablename: "District",
                        filterfirst: "",
                    }),
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    if (res[0].status == 0) {
                        self.listOfDistrict = res[0].data;
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
                            srvnm: "GetMasterData",
                            srvmethodnm: "getmasterdataforMobilebytable",
                            srvparam: JSON.stringify({
                                tablename: "District",
                                filterfirst: "",
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();                }
            );
        }
    }

    getImplementedCategory() {
        if (this.httpClient.isOffline) {
            this.listOfImplementCategory = this.getPreVerificationData.listOfImplementCategory.filter(cate => (cate.DealerId == this.selectedBHP && cate.ImplementId == this.getPreVerificationData.FarmImplementsMachineryId));
        }
        else {
            var self = this;
            this.listOfImplementCategory = [];
            this.selectedImplementCategory = 0;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetImplementCategoryIdByBHP",
                    srvparam: JSON.stringify({
                        BHPId: this.selectedBHP,
                        ImplementId: this.getPreVerificationData.FarmImplementsMachineryId,
                    }),
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.listOfImplementCategory = res[0].data;
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
                            srvnm: "GetMasterData",
                            srvmethodnm: "getmasterdataforMobilebytable",
                            srvparam: JSON.stringify({
                                tablename: "District",
                                filterfirst: "",
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();                  }
            );
        }
    }

    getBHP() {
        if (this.httpClient.isOffline) {
            this.listOfbhp = this.getPreVerificationData.listOfbhp;
        }
        else {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetFarmImplementsBHP",
                    srvparam: JSON.stringify({
                        AgriLovValuesCode: "Tractor BHP",
                        ImplementId: this.getPreVerificationData.FarmImplementsMachineryId,
                    }),
                },
            };

            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.listOfbhp = res[0].data;
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
                            srvmethodnm: "GetFarmImplementsBHP",
                            srvparam: JSON.stringify({
                                AgriLovValuesCode: "Tractor BHP",
                                ImplementId: self.getPreVerificationData.FarmImplementsMachineryId,
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();                 }
            );
        }
    }

    getRates() {
        if (this.httpClient.isOffline) {
            var temp = this.getPreVerificationData.listOfRates.filter(rate => (rate.DealerId == this.selectredDealer && rate.FarmImplementsMachineryId == this.getPreVerificationData.FarmImplementsMachineryId));
            console.log("temp", temp);
            if (temp.length) {
                this.selectedRate = temp[0].ApprovedRate;
            }
        }
        else {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetFarmImplementsRateByDealer",
                    srvparam: JSON.stringify({
                        dealerid: this.selectredDealer,
                        FarmImplementsMachineryId: this.getPreVerificationData
                            .FarmImplementsMachineryId,
                        AgriLovValuesCode: "0",
                    }),
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.selectedRate = res[0].data[0].ApprovedRate;
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
                            srvmethodnm: "GetFarmImplementsRateByDealer",
                            srvparam: JSON.stringify({
                                dealerid: self.selectredDealer,
                                FarmImplementsMachineryId: self.getPreVerificationData
                                    .FarmImplementsMachineryId,
                                AgriLovValuesCode: "0",
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();                  }
            );
        }

    }

    getDealers() {
        this.dealerList = [];
        this.selectredDealer = null;
        if (this.httpClient.isOffline) {
            this.dealerList = this.getPreVerificationData.dealerList.filter(district => district.DistrictId == this.selectredDistrict);
            console.log("this.dealerList",this.dealerList);
            console.log("this.this.selectredDistrict",this.selectredDistrict);

        }
        else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetFarmImplementsDealers",
                    srvparam: JSON.stringify({
                        userid: this.httpClient.userData.userid,
                        districtid: this.selectredDistrict,
                    }),
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    if (res[0].status == 0) {
                        self.dealerList = res[0].data;
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
                            srvmethodnm: "GetFarmImplementsDealers",
                            srvparam: JSON.stringify({
                                userid: self.httpClient.userData.userid,
                                districtid: self.selectredDistrict,
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();                  }
            );
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
                self.httpClient.showToastError();              }
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

    ionViewDidLoad() {
        console.log("ionViewDidLoad PostActionDetailPage");
    }

    VerificationChecklist() {
        if (this.httpClient.isOffline) {
            this.preVerificationChecklistData = this.getPreVerificationData.preVerificationChecklistData;
        }
        else {
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
                                self.getPreVerificationData.SubsidySchemeId +
                                "', 'StepName':'Post verification','ApplicationId':'" +
                                self.getPreVerificationData.ApplicationId +
                                "'}",
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();                  }
            );
        }

    }

    async addBill() {
        // this.httpClient.selectedId = this.postverificationID;
        const modal = await this.modalController.create({
            component: BillModelFarmImplementPage,
            cssClass: "my-custom-class",
            backdropDismiss: false,
            componentProps: {
                asDate: this.getPreVerificationData.ASDate,
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
                                PostVerificationBillsId: self.billArray[index]
                                    .PostVerificationBillsId,
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();                }
            );
        }
    }

    sanitizeImage(billPhoto) {
        return this.sanitizer.bypassSecurityTrustUrl(billPhoto);
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
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?",
                        [this.getPreVerificationData.ApplicationId]).then((res) => {
                            var temp = JSON.parse(res.rows.item(0).applicationData);
                            if (param == 3) {
                                temp.photoImplemenWIthFarmer = imageData;
                                temp.optionsOfphotoImplemenWIthFarmer = options;
                            } else if (param == 2) {
                                //  this.photoRCrenew =imageData;
                                temp.photoRCrenew = imageData;
                                temp.optionsOfphotoRCrenew = options;
                            } else if (param == 1) {
                                //photoRcRnewalReceipt
                                temp.photoFphotoRcRnewalReceipt = imageData;
                                temp.optionsOfphotoRcRnewalReceipt = options;

                            }
                            console.log("temp", temp);

                            console.log("temp", temp);
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                                .then(() => {
                                    if (param == 3) {
                                        this.photoImplemenWIthFarmer = imageData;
                                    } else if (param == 2) {
                                        this.photoRCrenew = imageData;
                                    } else if (param == 1) {
                                        this.photoRcRnewalReceipt = imageData;
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
                    console.log("options",options);
                    
                    this.httpClient.showLoading();
                    this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then(
                        (data) => {
                            this.httpClient.dismissLoading();
                            // success
                            var temp = JSON.parse(data.response);
                            console.log("temp[0].data", temp[0].data);
                            if (temp[0].data[0].URL) {
                                if (param == 3) {
                                    this.photoImplemenWIthFarmer = temp[0].data;
                                } else if (param == 2) {
                                    this.photoRCrenew = temp[0].data;
                                } else if (param == 1) {
                                    this.photoRcRnewalReceipt = temp[0].data;
                                }
                            } else {
                                this.httpClient.showToastError();
                            }

                            // else if (param == 4) {
                            //   this.ImgFarmerWithOfficerNoCase = temp[0].data;
                            // } else if (param == 5) {
                            //   this.photoFarmerApprovalCertificate = temp[0].data;
                            // }

                            //
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
                this.httpClient.dismissLoading();
                console.log("err", err);
            }
        );
    }

    takePhotoNoCase(param, columnName) {
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
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?",
                        [this.getPreVerificationData.ApplicationId]).then((res) => {
                            var temp = JSON.parse(res.rows.item(0).applicationData);

                            if (param == 4) {
                                temp.photoFarmerWithOfficerNoCase = imageData;
                                temp.optionsOfPhotoFarmerWithOfficerNoCase = options;
                                // this.noCaseDateOfImgFarmer = new Date();
                            } else if (param == 5) {
                                temp.photoFarmerApprovalCertificate = imageData;
                                temp.optionsOfphotoFarmerApprovalCertificate = options;
                                // this.noCaseDateOfImgLetter = new Date();
                            }
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                                .then(() => {
                                    if (param == 4) {
                                        this.ImgFarmerWithOfficerNoCase = imageData;
                                    } else if (param == 5) {
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
                    
                    console.log("options",options);
                    this.httpClient.showLoading();
                    this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then(
                        (data) => {
                            this.httpClient.dismissLoading();
                            // success
                            var temp = JSON.parse(data.response);
                            console.log("temp[0].data", temp[0].data);
                            if (temp[0].data) {
                                if (param == 4) {
                                    this.ImgFarmerWithOfficerNoCase = temp[0].data;
                                } else if (param == 5) {
                                    this.photoFarmerApprovalCertificate = temp[0].data;
                                }
                            } else {
                                this.httpClient.showToastError();
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

    uploadImages(requestDataOfPhoto, param) {
        if (this.httpClient.isOffline == true) {
            if (param == 1) {
                var query = this.dbService.storage
                    .executeSql(
                        `
            UPDATE postVerificationOfflineOfFarmpond
            SET photoOne = '${JSON.stringify(requestDataOfPhoto)}'
            WHERE applicationNo = '${this.getPreVerificationData.ApplicationNo}'
          `,
                        []
                    )
                    .then(() => {
                    })
                    .catch((e) => {
                        alert("error " + JSON.stringify(e));
                    });

                console.log("query", query);
            }
            if (param == 2) {
                var query = this.dbService.storage
                    .executeSql(
                        `
            UPDATE postVerificationOfflineOfFarmpond
            SET photoTwo = '${JSON.stringify(requestDataOfPhoto)}'
            WHERE applicationNo = '${this.getPreVerificationData.ApplicationNo}'
          `,
                        []
                    )
                    .then(() => {
                    })
                    .catch((e) => {
                        alert("error " + JSON.stringify(e));
                    });

                console.log("query", query);
            }
            if (param == 3) {
                var query = this.dbService.storage
                    .executeSql(
                        `
            UPDATE postVerificationOfflineOfFarmpond
            SET photoThree = '${JSON.stringify(requestDataOfPhoto)}'
            WHERE applicationNo = '${this.getPreVerificationData.ApplicationNo}'
          `,
                        []
                    )
                    .then(() => {
                    })
                    .catch((e) => {
                        alert("error " + JSON.stringify(e));
                    });

                console.log("query", query);
            }
        } else {
            var self = this;
            self.httpClient.showLoading();
            console.log("sendRequestData", requestDataOfPhoto);
            this.httpClient.post(requestDataOfPhoto).subscribe(
                function (res: any) {
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        // self.successAlertPop();
                    } else {
                        self.httpClient.showToast(res[0].data);
                        if (param == 1) {
                            self.photoFarmerWithOfficer = null;
                            self.photoFarmerWithOfficerDateTime = null;
                        } else if (param == 2) {
                            self.photoKhasaraCertificate = null;
                            self.photoKhasaraCertificateDateTime = null;
                        } else if (param == 3) {
                            self.photoAffidavit = null;
                            self.photoAffidavitDateTime = null;
                        }
                    }
                },
                (error) => {
                    self.httpClient.dismissLoading();
                    self.httpClient.showToastError();
                }
            );
        }
    }

    finalSubmission() {
        if (this.billArray.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल अपलोड करें ");
            } else {
                this.httpClient.showToast("Please upload bills");
            }
        } else if (
            this.photoImplemenWIthFarmer == null ||
            this.photoImplemenWIthFarmer == ""
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया कृषि उपकरण व अंकित वर्ष के साथ किसान व अधिकारी का फोटो लें "
                );
            } else {
                this.httpClient.showToast(
                    "Please take  Picture of Implement with farmer and  along with embossed year"
                );
            }
        } else if (
            this.getPreVerificationData.FarmImplementType ==
            "Tractor/Power Operated" &&
            (this.photoRcRnewalReceipt == null || this.photoRcRnewalReceipt == "") &&
            this.rcValid == "no"
        ) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please take photo of Registration certificate renewal receipt"
                );
            } else {
                this.httpClient.showToast(
                    "ट्रैक्टर के पंजीकरण प्रमाण पत्र नवीनीकरण रसीद का फोटो लें "
                );
            }
        } else if (
            this.getPreVerificationData.FarmImplementType ==
            "Tractor/Power Operated" &&
            (this.photoRCrenew == null || this.photoRCrenew == "") &&
            this.rcValid == "no"
        ) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please take photo of Renewed registration certificate"
                );
            } else {
                this.httpClient.showToast("नवीनीकृत पंजीकरण प्रमाण पत्र का फोटो लें ");
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
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.offlineFinalSubmission = offlineFinalSubmission;
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
                            .then(() => {
                                self.successAlertFinalSubmission();

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
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    userid: self.httpClient.userData.userid,
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    roleid: self.httpClient.userData.roleid,
                                }),
                            }
                        };
                        console.log('errorRequestData new', errorRequestData);
                        self.httpClient.getErrorMobileLogs(errorRequestData);
                        self.httpClient.showToastError();                     }
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
        if (this.httpClient.latitude == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें");
            } else {
                this.httpClient.showToast("Please enable the location for this application then submit");
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
        } else if (
            this.preVerificationChecklistData.length != this.createdChecklist.length
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया सभी चेकलिस्ट को पूर्ण करे");
            } else {
                this.httpClient.showToast("Please complete all checklists");
            }
        } else if (this.selectredDistrict == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("डीलर के जिले का चयन करें ");
            } else {
                this.httpClient.showToast("Please Select District of dealer");
            }
        } else if (this.selectredDealer == null || this.selectredDealer == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया डीलर चुनें");
            } else {
                this.httpClient.showToast("Please Select the dealer");
            }
        } else if (
            this.getPreVerificationData.FarmImplementType ==
            "Tractor/Power Operated" &&
            this.selectedBHP == 0
        ) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Please Select BHP");
            } else {
                this.httpClient.showToast("कृपया  बी एच पी का चयन करें");
            }
        } else if (
            this.getPreVerificationData.FarmImplementType ==
            "Tractor/Power Operated" &&
            this.listOfImplementCategory.length != 0 &&
            this.selectedImplementCategory == 0
        ) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Please Select Implement Category");
            } else {
                this.httpClient.showToast("कृपया यंत्र श्रेणी का चयन करें");
            }
        } else if (this.selectedRate == null || this.selectedRate == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया कृषि यंत्र की उचित अनुमोदित दर दर्ज करे "
                );
            } else {
                this.httpClient.showToast(
                    "Please enter the approved appropriate rate of farm implement"
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
                    srvnm: "PostVerification",
                    srvmethodnm: "AddFarmImplementPostVerification",
                    srvparam: JSON.stringify({
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        userid: self.httpClient.userData.userid,
                        BISNo: "",
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        latitude: this.lat,
                        longitude: this.lng,
                        roleid: self.httpClient.userData.roleid,
                        dealerid: self.selectredDealer,
                        rate: this.selectedRate,
                        isRCvalid: this.rcValid,
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        mobilToVerify: "1",
                        IsFarmerAcceptance: "Yes",
                        BHPId: this.selectedBHP,
                        DealerDistrictid: this.selectredDistrict,
                        ImplementCategoryId: this.selectedImplementCategory,
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
                        srvmethodnm: "AddFarmImplementPostVerification",
                        srvparam: JSON.stringify({
                            ApplicationId: this.getPreVerificationData.ApplicationId,
                            userid: self.httpClient.userData.userid,
                            BISNo: "",
                            SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                            latitude: this.lat,
                            longitude: this.lng,
                            roleid: self.httpClient.userData.roleid,
                            dealerid: self.selectredDealer,
                            rate: this.selectedRate,
                            isRCvalid: this.rcValid,
                            AppVersion: "V." + this.httpClient.currentAppVersion,
                            IsOnline_Offline: tempOfflineFlag,
                            mobilToVerify: "1",
                            IsFarmerAcceptance: "Yes",
                            BHPId: this.selectedBHP,
                            DealerDistrictid: this.selectredDistrict,
                            ImplementCategoryId: this.selectedImplementCategory,
                            ChecklistDetailList: this.createdChecklist,
                        }),
                    },
                };
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.sendRequestDataOffline = sendRequestDataOffline;
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                                userid: self.httpClient.userData.userid,
                                srvnm: "PostVerification",
                                srvmethodnm: "AddFarmImplementPostVerification",
                                srvparam: JSON.stringify({
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    userid: self.httpClient.userData.userid,
                                    BISNo: "",
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    roleid: self.httpClient.userData.roleid,
                                    dealerid: self.selectredDealer,
                                    rate: self.selectedRate,
                                    isRCvalid: self.rcValid,
                                    AppVersion: "V." + self.httpClient.currentAppVersion,
                                    IsOnline_Offline: tempOfflineFlag,
                                    mobilToVerify: "1",
                                    IsFarmerAcceptance: "Yes",
                                    BHPId: self.selectedBHP,
                                    DealerDistrictid: self.selectredDistrict,
                                    ImplementCategoryId: self.selectedImplementCategory,
                                    ChecklistDetailList: self.createdChecklist,
                                }),
                            }
                        };
                        console.log('errorRequestData new', errorRequestData);
                        self.httpClient.getErrorMobileLogs(errorRequestData);
                        self.httpClient.showToastError();                        }
                );
            }
        }
    }

    uploadBillDetails(enteredBillDetails) {
        var self = this;
        var imageUrl: any;
        if (this.httpClient.isOffline) {
            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?",
                [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    if (!temp.billDetails) {
                        temp.billDetails = [];
                    }
                    console.log("temp", temp);
                    temp.billDetails.push(enteredBillDetails);
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                    self.httpClient.showToastError();                  }
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
                            this.mainDetailsSubmitFlag = false;
                            this.farmerChoiceFlag = false;
                            this.uploadBillFlag = true;
                            this.uploadPhotoFlag = true;
                            this.farmerAgreeFlag = false;
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
                            this.mainDetailsSubmitFlag = false;
                            this.farmerChoiceFlag = false;
                            this.uploadBillFlag = true;
                            this.uploadPhotoFlag = true;
                            this.farmerAgreeFlag = false;
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
        } else if (this.ImgFarmerWithOfficerNoCase == null) {
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
                    srvmethodnm: "AddFarmImplementPostVerification",
                    srvparam: JSON.stringify({
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        userid: self.httpClient.userData.userid,
                        BISNo: "",
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        latitude: this.lat,
                        longitude: this.lng,
                        roleid: self.httpClient.userData.roleid,
                        dealerid: "0",
                        rate: "0",
                        isRCvalid: "false",
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        mobilToVerify: "1",
                        IsFarmerAcceptance: "No",
                        ChecklistDetailList: [],
                        ImgFarmerWithOfficer: this.ImgFarmerWithOfficerNoCase,
                        NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                    }),
                },
            };
            console.log("sendRequestData", sendRequestData);
            if (this.httpClient.isOffline == true) {
                var noDataOffline = {
                    ApplicationId: this.getPreVerificationData.ApplicationId,
                    userid: self.httpClient.userData.userid,
                    BISNo: "",
                    SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                    latitude: this.lat,
                    longitude: this.lng,
                    roleid: self.httpClient.userData.roleid,
                    dealerid: "0",
                    rate: "0",
                    isRCvalid: "false",
                    AppVersion: "V." + this.httpClient.currentAppVersion,
                    IsOnline_Offline: tempOfflineFlag,
                    mobilToVerify: "1",
                    IsFarmerAcceptance: "No",
                    ChecklistDetailList: [],
                    ImgFarmerWithOfficer: this.ImgFarmerWithOfficerNoCase,
                    NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                }
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);

                        temp.finalSubmission = noDataOffline;

                        console.log("temp", temp);
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                    
                    console.log("options",options);
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
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
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
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);

                temp.jamabandiArray.splice(i, 1)
                console.log("temp", temp);
                let data = [JSON.stringify(temp)];
                this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                
                console.log("options",options);
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
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }
            }
            else {

                var self = this;
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    console.log("temp", temp);
                    temp.NakshaTrace = { nakshaTraceImage: imageData, nakshaTraceOptions: options }
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmImplement SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data).then(() => {
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
