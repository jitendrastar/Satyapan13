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
 import { DomSanitizer } from "@angular/platform-browser";
import {
    Downloader,
    NotificationVisibility,
    DownloadRequest,
} from "@ionic-native/downloader/ngx";
import { PipelineBillModelPostVerifiactionPage } from "../pipeline-bill-model-post-verifiaction/pipeline-bill-model-post-verifiaction.page";
import { DatabaseServiceService } from "../services/database-service.service";
import { SelectBrandNamePage } from "./select-brand-name/select-brand-name.page";
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

import { File } from "@ionic-native/file/ngx";

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
 import {BillModelFarmImplementPage} from '../bill-model-farm-implement/bill-model-farm-implement.page';
@Component({
    selector: "app-pipeline-post-verification",
    templateUrl: "./pipeline-post-verification.page.html",
    styleUrls: ["./pipeline-post-verification.page.scss"],
})
export class PipelinePostVerificationPage implements OnInit {
    getPreVerificationData: any;
    lat: any;
    lng: any;
    segmentSelected = "work";
    farmerChoice: any = "yes";
    selectedUploadBills: any;
    checkListClose = true;
    dimensionsClose = true;
    photoUploadClose = true;
    createdBillDetails: any = [];
    //        this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया सी एम् एल नंबर का चयन करें' : 'Please select the CML number');

    okText = (this.httpClient.currentLanguage == 'hindi') ? 'ठीक है' : 'OK'
    cancelText = (this.httpClient.currentLanguage == 'hindi') ? 'रद्द करे' : "Dismiss"
    toggleCheckList() {
        this.checkListClose = !this.checkListClose;
    }

    toggleDimensions() {
        this.dimensionsClose = !this.dimensionsClose;
    }

    togglePhotoUpload() {
        this.photoUploadClose = !this.photoUploadClose;
    }

    khashraNumber: any;
    photoAffidavit: any;
    farmerGrantPrevious: any = "no";

    selectedPipelineTYpe: any;
    listOfPipeLineType: any = [];

    listOfBrandsName: any = [];
    selectedBrandName: any;

    listOfCMLdetails: any = [];
    selectedCMLdetails: any;
    selectedConstructionYearOfThePipe: any;

    listofISINumbers: any = [];
    selectedISINumber: any;
    selectedCMLNumber: any;
    manufacturingBatchNumber: any;
    totalLengthPipe: any;
    selectedDiameter: any;
    postverificationID: any;
    mainDetailsPostedFlag = false;

    farmerAndOfficerWithIrrigationSource: any;
    farmerAndOfficerWithIrrigationSourceDateTime: any;

    farmerAndOfficerAtTheEndPointOfPipeline: any;
    farmerAndOfficerAtTheEndPointOfPipelineDateTime: any;

    authorizedVendorCertificate: any;
    authorizedVendorCertificateDateTime: any;

    farmerAndOfficer: any;
    farmerAndOfficerDateTime: any;

    fFarmerLetterOfDissent: any;
    fFarmerLetterOfDissentDateTime: any;
    previousGrantYear: any;

    photoFarmerWithOfficerPreviousGranted: any;
    photoFarmerWithOfficerPreviousGrantedDateTime: any;

    PhotoOfAffidavitPreviousGranted: any;
    PhotoOfAffidavitPreviousGrantedDateTIme: any;
    hideForPhotos = true;
    billArray: any = [];
    totalAmountOfBill: number;
    photoOfNazriyaNaksha: any;
    photoOfNazriyaNakshaDateTime: any;

    fileTransfer: any;
    PipelinePVTransList = []
    PipelinePVTransListName = []
    isSixMonthOld: any = 'no';
    nakshaTrace: any;

    jamabandiArray: any = [];
    constructor(
        public androidPermissions: AndroidPermissions,
        private transfer: FileTransfer,
        private file: File,
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
        public dbService: DatabaseServiceService,
        public locationAccuracy: LocationAccuracy
    ) {
        this.fileTransfer = this.transfer.create();


        this.checkGPSPermission();
        this.getPreVerificationData = JSON.parse(
            this.route.snapshot.paramMap.get("obj")
        );
        console.log("this.getPreVerificationData", this.getPreVerificationData);

        this.khashraNumber = this.getPreVerificationData.KhasraNo;

        if (parseInt(this.getPreVerificationData.PostVerificationId) > 0) {
            this.mainDetailsPostedFlag = true;
            this.hideForPhotos = false;
            this.farmerChoice = "yes";

            this.postverificationID = this.getPreVerificationData.PostVerificationId;

            if (this.getPreVerificationData.ImgfarmerwithSourceIrri != "") {
                this.farmerAndOfficerWithIrrigationSource = this.getPreVerificationData.ImgfarmerwithSourceIrri;
            }
            if (this.getPreVerificationData.ImgFarmerWithOfficer != "") {
                this.farmerAndOfficerAtTheEndPointOfPipeline = this.getPreVerificationData.ImgFarmerWithOfficer;
            }
            if (this.getPreVerificationData.imgDelearCertificate != "") {
                this.authorizedVendorCertificate = this.getPreVerificationData.imgDelearCertificate;
            }

            if (this.getPreVerificationData.ImgNazariaNaksha != "") {
                this.photoOfNazriyaNaksha = this.getPreVerificationData.imgNazriyaNaksha;
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
        } else {
            this.getPipelineType();
            this.getBrandNames();
            this.getListOfISINumber();
        }
        if (this.httpClient.isOffline) {
            if (this.getPreVerificationData.farmerGrantPrevious == "yes") {
                this.farmerGrantPrevious = "yes"
                if (this.getPreVerificationData.PhotoOfAffidavitPreviousGranted) {
                    this.PhotoOfAffidavitPreviousGranted = this.getPreVerificationData.PhotoOfAffidavitPreviousGranted;
                }

                if (this.getPreVerificationData.PhotoOfAffidavitPreviousGranted) {
                    this.photoFarmerWithOfficerPreviousGranted = this.getPreVerificationData.photoFarmerWithOfficerPreviousGranted;
                }
            } else {
                if (this.getPreVerificationData.sendRequestData) {
                    this.mainDetailsPostedFlag = true;
                    this.hideForPhotos = false;
                    this.farmerChoice = "yes";
                }
                if (this.getPreVerificationData.billDetails) {
                    this.billArray = this.getPreVerificationData.billDetails;
                }
                if (this.getPreVerificationData.authorizedVendorCertificate) {
                    this.authorizedVendorCertificate = this.getPreVerificationData.authorizedVendorCertificate;
                }
                if (this.getPreVerificationData.farmerAndOfficerAtTheEndPointOfPipeline) {
                    this.farmerAndOfficerAtTheEndPointOfPipeline = this.getPreVerificationData.farmerAndOfficerAtTheEndPointOfPipeline;
                }
                if (this.getPreVerificationData.farmerAndOfficerWithIrrigationSource) {
                    this.farmerAndOfficerWithIrrigationSource = this.getPreVerificationData.farmerAndOfficerWithIrrigationSource;
                }
                if (this.getPreVerificationData.photoOfNazriyaNaksha) {
                    this.photoOfNazriyaNaksha = this.getPreVerificationData.photoOfNazriyaNaksha;
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


            // if (param == 1) {
            //     this.farmerAndOfficerWithIrrigationSource = imageData;
            // } else if (param == 2) {
            //     this.farmerAndOfficerAtTheEndPointOfPipeline = imageData;
            // } else if (param == 3) {
            //     this.authorizedVendorCertificate = imageData;
            // } else if (param == 8) {
            //     this.photoOfNazriyaNaksha = imageData;
            // }
        }
        // if (this.httpClient.isOffline == true) {
        //   this.dbService.storage
        //     .executeSql(
        //       "SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?",
        //       [this.getPreVerificationData.ApplicationId]
        //     )
        //     .then((res) => {
        //       console.log("res.rows.lengthaaaaaa", res.rows.length);
        //       if (res.rows.length > 0) {
        //         for (var i = 0; i < res.rows.length; i++) {
        //           console.log(
        //             "res.rows.item(i)",
        //             res.rows.item(i).applicationSubmissionData
        //           );
        //           console.log(
        //             "res.rows.item(i)photoSinchiStrotraWithKrishaq",
        //             res.rows.item(i).photoSinchiStrotraWithKrishaq
        //           );
        //           console.log(
        //             "res.rows.item(i)",
        //             res.rows.item(i).applicationSubmissionData
        //           );
        //           console.log(
        //             "res.rows.item(i)",
        //             res.rows.item(i).applicationSubmissionData
        //           );
        //           if (res.rows.item(i).applicationSubmissionData != null) {
        //             this.mainDetailsPostedFlag = true;
        //             this.hideForPhotos = false;
        //             this.farmerChoice = "yes";
        //             // this.postverificationID = this.getPreVerificationData.PostVerificationId;
        //             if (res.rows.item(i).photoSinchiStrotraWithKrishaq != null) {
        //               this.farmerAndOfficerWithIrrigationSource = res.rows.item(
        //                 i
        //               ).photoSinchiStrotraWithKrishaq;
        //             }
        //             if (res.rows.item(i).photoPipelineWithKrishakandKarmik != "") {
        //               this.farmerAndOfficerAtTheEndPointOfPipeline = res.rows.item(
        //                 i
        //               ).photoPipelineWithKrishakandKarmik;
        //             }
        //             if (res.rows.item(i).photoAdhikritViketaPramanPatra != null) {
        //               this.authorizedVendorCertificate = res.rows.item(
        //                 i
        //               ).photoAdhikritViketaPramanPatra;
        //             }
        //             if (res.rows.item(i).photoNajariyaNaksha != null) {
        //               this.photoOfNazriyaNaksha = res.rows.item(
        //                 i
        //               ).photoNajariyaNaksha;
        //             }
        //           }
        //         }
        //       }
        //     });
        // }
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


    getLoc() {

        this.geolocation.getCurrentPosition().then((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;

            console.log('lat  long detail', this.lat, this.lng);
            // this.httpClient.dismissLoading();
        })
            .catch((error) => {
                this.httpClient.dismissLoading();
                console.log('Error getting location', error);
                this.httpClient.showToast('Please Enable Location!!!');

            });
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
                    self.calculateTheTotalBillAmount();
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

    uploadBillDetails(enteredBillDetails) {
        var self = this;
        var imageUrl: any;
        if (this.httpClient.isOffline) {
            this.dbService.storage.executeSql(
                "SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?",
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
                  UPDATE postVpipelineIrrigationAllData
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
            this.totalAmountOfBill = this.totalAmountOfBill + parseFloat(this.billArray[i].BillAmount);
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

                    self.httpClient.dismissLoading();
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
                    self.httpClient.showToastError();
                }
            );
        }
    }

    getPipelineType() {
        if (this.httpClient.isOffline == true) {
            this.dbService.storage
                .executeSql("SELECT * FROM pVerificationPIPipelineType", [])
                .then((res) => {
                    if (res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {
                            this.listOfPipeLineType.push(res.rows.item(i));
                        }
                    }
                });
        } else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetPipelineType",
                    srvparam: "{}",
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    // self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.listOfPipeLineType = res[0].data;
                    } else {
                        self.httpClient.showToast(res[0].data);
                    }
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
                            srvmethodnm: "GetPipelineType",
                            srvparam: "{}",
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }

    getBrandNames() {
        if (this.httpClient.isOffline == true) {
            this.dbService.storage
                .executeSql("SELECT * FROM pVerificationPICompanyBrand", [])
                .then((res) => {
                    if (res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {
                            this.listOfBrandsName.push(res.rows.item(i));
                        }
                        // for (let j = 0; j < pipelineTypelist.length; j++) {
                        //   var tempObject = pipelineTypelist[j].applicationData;
                        //   this.listOfPipeLineType.push(tempObject);
                        // }
                    }
                });
        } else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetCompanyBrandlist",
                    srvparam: "{'CompanyBrandType':'Brand'}",
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.httpClient.dismissLoading();
                        self.listOfBrandsName = res[0].data;
                    } else {
                        self.httpClient.dismissLoading();
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
                            srvmethodnm: "GetCompanyBrandlist",
                            srvparam: "{'CompanyBrandType':'Brand'}",
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }

    changeYearValue() {
        this.previousGrantYear = "";
    }

    getCMLdetails() {
        if (this.httpClient.isOffline == true) {
            this.dbService.storage
                .executeSql(
                    "SELECT * FROM pVerificationPICMLdata WHERE CompanyBrandId = ?",
                    [this.selectedBrandName]
                )
                .then((res) => {
                    if (res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {
                            this.listOfCMLdetails.push(res.rows.item(i));
                        }
                    }
                });
        } else {
            if (this.selectedBrandName) {
                var self = this;
                self.httpClient.showLoading();
                var sendRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "GetCMLDetail",
                        srvparam: JSON.stringify({ CompanyBrandId: this.selectedBrandName }),
                    },
                };
                this.httpClient.post(sendRequestData).subscribe(
                    function (res: any) {
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            self.listOfCMLdetails = res[0].data;
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
                                srvmethodnm: "GetCMLDetail",
                                srvparam: JSON.stringify({ CompanyBrandId: this.selectedBrandName }),
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

    getListOfISINumber() {
        if (this.httpClient.isOffline == true) {
            this.dbService.storage
                .executeSql("SELECT * FROM pVerificationBISnumberdata", [])
                .then((res) => {
                    if (res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {
                            this.listofISINumbers.push(res.rows.item(i));
                        }
                    }
                });
        } else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetPipeBISNo",
                    srvparam: "{}",
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    // self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.listofISINumbers = res[0].data;
                    } else {
                        self.httpClient.showToast(res[0].data);
                    }
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
                            srvmethodnm: "GetPipeBISNo",
                            srvparam: "{}",
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }

    async addBillDetails() {
        const modal = await this.modalController.create({
            component: PipelineBillModelPostVerifiactionPage,
            backdropDismiss: false,
        });
        modal.onDidDismiss().then((data) => {
            if (data.data != null) {
                this.createdBillDetails.push(data.data.enteredBillDetails);
            }
        });
        return await modal.present();
    }

    submitYesSubsidyGrantedNoForm() {
        var tempOfflineFlag: any;
        if (this.httpClient.isOffline == true) {
            tempOfflineFlag = 1;
        } else {
            tempOfflineFlag = 0;
        }
        // if (!this.lat) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast(
        //             "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
        //         );
        //     } else {
        //         this.httpClient.showToast(
        //             "Please enable the location for this application then submit"
        //         );
        //     }
        // } els

        if (this.khashraNumber == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("पाइपलाइन के खेत का खसरा नंबर लिखें");
            } else {
                this.httpClient.showToast("Write the Pipeline field khasara number");
            }
        }
        else if (this.PipelinePVTransList.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया पाइपलाइन का विवरण जोड़ें");
            } else {
                this.httpClient.showToast("Please add pipe details");
            }
        }
        //  else if (this.selectedPipelineTYpe == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast("सिंचाई पाइप का प्रकार दर्ज करे");
        //     } else {
        //         this.httpClient.showToast("Select the Type of irrigation pipe");
        //     }
        // }
        //  else if (this.selectedDiameter == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast("पाइप का व्यास दर्ज करे ");
        //     } else {
        //         this.httpClient.showToast("Please select the pipe diameter");
        //     }
        // } 
        // else if (this.selectedBrandName == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast("ब्रांड का नाम दर्ज करे ");
        //     } else {
        //         this.httpClient.showToast("Please select the Brand name");
        //     }
        // }
        //  else if (this.selectedConstructionYearOfThePipe == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast("पाइप का निर्माण वर्ष दर्ज करे ");
        //     } else {
        //         this.httpClient.showToast(
        //             "Please select the Construction year of the pipe"
        //         );
        //     }
        // }
        //  else if (this.selectedISINumber == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast("आईएसआई नंबर दर्ज करे ");
        //     } else {
        //         this.httpClient.showToast("Please select the ISI number");
        //     }
        // }
        //  else if (this.selectedCMLNumber == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast("सी एम् एल नंबर दर्ज करे ");
        //     } else {
        //         this.httpClient.showToast("Please select the CML number");
        //     }
        // } 
        // else if (this.manufacturingBatchNumber == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast(" मैन्युफैक्चरिंग बैच संख्या दर्ज करे ");
        //     } else {
        //         this.httpClient.showToast(
        //             "Please select the Manufacturing batch number"
        //         );
        //     }
        // }
        // manufacturingBatchNumber
        // else if (this.totalLengthPipe == null) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast("पाइप की कुल लंबाई दर्ज करे ");
        //     } else {
        //         this.httpClient.showToast("Please enter the Total length of pipe");
        //     }
        // }
        else {
            if (this.httpClient.isOffline == true) {
                var sendRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "AddPostVerificationPipelineLatest",
                        srvparam: JSON.stringify({
                            'ApplicationId': this.getPreVerificationData.ApplicationId,
                            'AppVersion': "V." + this.httpClient.currentAppVersion,
                            'IsOnline_Offline': 0,
                            'IsFarmerAcceptance': 'Yes',
                            'IsSubsidyGranted': 'No',
                            'UserId': this.httpClient.userData.userid,
                            'latitude': this.lat,
                            'longitude': this.lng,
                            'Remarks': 'No Test',
                            'RoleId': this.httpClient.userData.roleid,
                            'SubsidySchemeId': this.getPreVerificationData.SubsidySchemeId,
                            'ImgFarmerWithOfficer': '',
                            'ImgFarmerWithOfficerDate': '',
                            'ImgNotAcceptanceDoc': '',
                            'ImgNotAcceptanceDocDate': '',
                            'ImgAffidevitSubsidyGranted': '',
                            'ImgAffidevitSubsidyGrantedDate': '',
                            'PostVerificationKhasraNo': this.khashraNumber,
                            'CompanyId': '0',
                            'ImgfarmerwithSourceIrri': '',
                            'TotalAmount': 0,
                            'PipelinePVTransList': this.PipelinePVTransList
                        })

                    },
                };
                console.log("first");
                this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    console.log("second");
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    console.log("third");
                    temp.sendRequestData = sendRequestData;
                    let data = temp;
                    this.dbService.storage.executeSql(
                        `
                  UPDATE postVpipelineIrrigationAllData
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `,
                        []
                    ).then(() => {
                        this.successAlert();

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
                var self = this;
                self.httpClient.showLoading();
                var sendRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "AddPostVerificationPipelineLatest",
                        srvparam: JSON.stringify({
                            'ApplicationId': this.getPreVerificationData.ApplicationId,
                            'AppVersion': "V." + this.httpClient.currentAppVersion,
                            'IsOnline_Offline': 0,
                            'IsFarmerAcceptance': 'Yes',
                            'IsSubsidyGranted': 'No',
                            'UserId': this.httpClient.userData.userid,
                            'latitude': this.lat,
                            'longitude': this.lng,
                            'Remarks': 'No Test',
                            'RoleId': this.httpClient.userData.roleid,
                            'SubsidySchemeId': this.getPreVerificationData.SubsidySchemeId,
                            'ImgFarmerWithOfficer': '',
                            'ImgFarmerWithOfficerDate': '',
                            'ImgNotAcceptanceDoc': '',
                            'ImgNotAcceptanceDocDate': '',
                            'ImgAffidevitSubsidyGranted': '',
                            'ImgAffidevitSubsidyGrantedDate': '',
                            'PostVerificationKhasraNo': this.khashraNumber,
                            'CompanyId': '0',
                            'ImgfarmerwithSourceIrri': '',
                            'TotalAmount': 0,
                            'PipelinePVTransList': this.PipelinePVTransList
                        })

                    },
                };
                this.httpClient.post(sendRequestData).subscribe(
                    function (res: any) {
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            self.postverificationID = res[0].data[0].PostVerificationId;
                            self.successAlert();
                        } else {
                            self.httpClient.showToast(res[0].data);
                        }
                    },
                    (error) => {
                        self.httpClient.dismissLoading();
                        var errorRequestData = {
                            obj: {
                                usrnm: "rajkisan",
                                psw: "rajkisan@123",
                                srvnm: "PostVerification",
                                srvmethodnm: "AddPostVerificationPipelineLatest",
                                srvparam: JSON.stringify({
                                    'ApplicationId': this.getPreVerificationData.ApplicationId,
                                    'AppVersion': "V." + this.httpClient.currentAppVersion,
                                    'IsOnline_Offline': 0,
                                    'IsFarmerAcceptance': 'Yes',
                                    'IsSubsidyGranted': 'No',
                                    'UserId': this.httpClient.userData.userid,
                                    'latitude': this.lat,
                                    'longitude': this.lng,
                                    'Remarks': 'No Test',
                                    'RoleId': this.httpClient.userData.roleid,
                                    'SubsidySchemeId': this.getPreVerificationData.SubsidySchemeId,
                                    'ImgFarmerWithOfficer': '',
                                    'ImgFarmerWithOfficerDate': '',
                                    'ImgNotAcceptanceDoc': '',
                                    'ImgNotAcceptanceDocDate': '',
                                    'ImgAffidevitSubsidyGranted': '',
                                    'ImgAffidevitSubsidyGrantedDate': '',
                                    'PostVerificationKhasraNo': this.khashraNumber,
                                    'CompanyId': '0',
                                    'ImgfarmerwithSourceIrri': '',
                                    'TotalAmount': 0,
                                    'PipelinePVTransList': this.PipelinePVTransList
                                })

                            },
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
                            this.mainDetailsPostedFlag = true;
                            this.hideForPhotos = false;
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
                            this.mainDetailsPostedFlag = true;
                            this.hideForPhotos = false;
                        },
                    },
                ],
            });

            await alert.present();
        }
    }

    ngOnInit() {
    }

    takePhotoDirect(param) {
        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                // this.billDetails.BillImg = imageData;

                // Upload Bill Details

                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        AppName: "PVapp",
                        IsDirectUpload: "True",
                    },
                };
                console.log("options.params", options.params);
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                        console.log("second");
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        console.log("third");
                        if (param == 6) {
                            temp.photoFarmerWithOfficerPreviousGranted = imageData;
                            temp.OptionOfphotoFarmerWithOfficerPreviousGranted = options;
                        } else if (param == 7) {
                            // PhotoOfAffidavitPreviousGranted
                            temp.PhotoOfAffidavitPreviousGranted = imageData;
                            temp.OptionOfPhotoOfAffidavitPreviousGranted = options;
                        } else if (param == 4) {
                            temp.farmerAndOfficer = imageData;
                            temp.OptionOffarmerAndOfficer = options;
                        } else if (param == 5) {
                            temp.fFarmerLetterOfDissent = imageData;
                            temp.OptionOffFarmerLetterOfDissent = options;
                        }
                        // temp.sendRequestData = sendRequestData;
                        let data = temp;
                        this.dbService.storage.executeSql(
                            `
                  UPDATE postVpipelineIrrigationAllData
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `,
                            []
                        ).then(() => {

                            if (param == 6) {
                                this.photoFarmerWithOfficerPreviousGranted = imageData;
                                this.photoFarmerWithOfficerPreviousGrantedDateTime = new Date();
                            } else if (param == 7) {
                                // PhotoOfAffidavitPreviousGranted
                                this.PhotoOfAffidavitPreviousGranted = imageData;
                                this.PhotoOfAffidavitPreviousGrantedDateTIme = new Date();
                            } else if (param == 4) {
                                this.farmerAndOfficer = imageData;
                                this.farmerAndOfficerDateTime = new Date();
                            } else if (param == 5) {
                                this.fFarmerLetterOfDissent = imageData;
                                this.farmerAndOfficerDateTime = new Date();
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
                    this.fileTransfer
                        .upload(imageData, this.httpClient.imageUploadUrl, options)
                        .then(
                            (data) => {
                                console.log("data", data);
                                this.httpClient.dismissLoading();
                                // success
                                var temp = JSON.parse(data.response);
                                if (param == 6) {
                                    this.photoFarmerWithOfficerPreviousGranted = temp[0].data;
                                    this.photoFarmerWithOfficerPreviousGrantedDateTime = new Date();
                                } else if (param == 7) {
                                    // PhotoOfAffidavitPreviousGranted
                                    this.PhotoOfAffidavitPreviousGranted = temp[0].data;
                                    this.PhotoOfAffidavitPreviousGrantedDateTIme = new Date();
                                } else if (param == 4) {
                                    this.farmerAndOfficer = temp[0].data;
                                    this.farmerAndOfficerDateTime = new Date();
                                } else if (param == 5) {
                                    this.fFarmerLetterOfDissent = temp[0].data;
                                    this.farmerAndOfficerDateTime = new Date();
                                }
                                // this.imgOfConsentLetter = ;
                            },
                            (err) => {
                                // error
                                this.httpClient.dismissLoading();
                                this.httpClient.showToastError();
                            }
                        );
                }
            },
            (err) => {
                // Handle error
            }
        );
    }

    takePhoto(param, columnName) {
        var self = this;
        const options: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
        };
        this.camera.getPicture(options).then(
            (imageData) => {

                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        id: this.postverificationID,
                        AppName: "PVapp",
                        tableName: "Pipeline_PostVerification",
                        columnName: columnName,
                        uniqueidcolumnname: "Pipeline_PostVerificationId",
                        IsDirectUpload: "False",
                    },
                };
                console.log(options.params);
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                        console.log("second");
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        console.log("third");
                        if (param == 1) {
                            temp.farmerAndOfficerWithIrrigationSource = imageData;
                            temp.optionOffarmerAndOfficerWithIrrigationSource = options;
                        } else if (param == 2) {
                            temp.farmerAndOfficerAtTheEndPointOfPipeline = imageData;
                            temp.optionOffarmerAndOfficerAtTheEndPointOfPipeline = options;
                        } else if (param == 3) {
                            temp.authorizedVendorCertificate = imageData;
                            temp.optionOfauthorizedVendorCertificate = options;
                        } else if (param == 8) {
                            temp.photoOfNazriyaNaksha = imageData;
                            temp.optionOfphotoOfNazriyaNaksha = options;
                        }
                        // temp.sendRequestData = sendRequestData;
                        let data = temp;
                        this.dbService.storage.executeSql(
                            `
                  UPDATE postVpipelineIrrigationAllData
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `,
                            []
                        ).then(() => {

                            if (param == 1) {
                                this.farmerAndOfficerWithIrrigationSource = imageData;
                            } else if (param == 2) {
                                this.farmerAndOfficerAtTheEndPointOfPipeline = imageData;
                            } else if (param == 3) {
                                this.authorizedVendorCertificate = imageData;
                            } else if (param == 8) {
                                this.photoOfNazriyaNaksha = imageData;
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
                        console.log("temp", temp);
                        console.log("temp[0].data", temp[0].data);
                        if (temp[0].data[0].URL) {
                            if (param == 1) {
                                this.farmerAndOfficerWithIrrigationSource = temp[0].data;
                            } else if (param == 2) {
                                this.farmerAndOfficerAtTheEndPointOfPipeline = temp[0].data;
                            } else if (param == 3) {
                                this.authorizedVendorCertificate = temp[0].data;
                            } else if (param == 8) {
                                this.photoOfNazriyaNaksha = temp[0].data;
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

    submitYesFormWithGranted() {
        var tempOfflineFlag;
        if (this.httpClient.isOffline == true) {
            tempOfflineFlag = 1;
        } else {
            tempOfflineFlag = 0;
        }
        if (this.isSixMonthOld == 'yes' && this.jamabandiArray.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया जमाबंदी फोटो लें");
            } else {
                this.httpClient.showToast("Please take photo of Jamabandi");
            }
        }
        else if (this.isSixMonthOld == 'yes' && this.nakshaTrace == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया नक्शा ट्रेस फोटो लें ");
            } else {
                this.httpClient.showToast("Please take photo of Map Trace");
            }
        }
        if (this.previousGrantYear == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया पहले लिए गए अनुदान का वर्ष दर्ज करे");
            } else {
                this.httpClient.showToast("Please enter Year of grant taken earlier");
            }
        } else if (this.photoFarmerWithOfficerPreviousGranted == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Please take photo of Farmer and officer");
            } else {
                this.httpClient.showToast("कृषक और कार्मिक फोटो लें ");
            }
        } else if (this.PhotoOfAffidavitPreviousGranted == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Please take photo of Photo of affidavit");
            } else {
                this.httpClient.showToast("शपथ पत्र का फोटो फोटो लें ");
            }
        } else {
            var self = this;
            if (this.httpClient.isOffline == true) {
                var sendRequestData: any;
                if (this.farmerGrantPrevious == 'yes') {
                    sendRequestData = {
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        IsFarmerAcceptance: "Yes",
                        IsSubsidyGranted: "Yes",
                        UserId: this.httpClient.userData.userid,
                        latitude: this.lat,
                        longitude: this.lng,
                        Remarks: "",
                        GrantedYear: new Date(this.previousGrantYear).getFullYear(),
                        RoleId: self.httpClient.userData.roleid,
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        ImgFarmerWithOfficer: this.photoFarmerWithOfficerPreviousGranted,
                        ImgFarmerWithOfficerDate: this
                            .photoFarmerWithOfficerPreviousGrantedDateTime,
                        ImgNotAcceptanceDoc: "",
                        ImgNotAcceptanceDocDate: "",
                        ImgAffidevitSubsidyGranted: this.PhotoOfAffidavitPreviousGranted,
                        ImgAffidevitSubsidyGrantedDate: this
                            .PhotoOfAffidavitPreviousGrantedDateTIme,
                        PipelineTypeId: "0",
                        PostVerificationKhasraNo: "",
                        Dimeter: "",
                        BrandId: "0",
                        CompanyId: "0",
                        ManufacturingYear: "",
                        ManufacturingBatchNo: "",
                        ISINo: "",
                        CMLNo: "",
                        PipelineLength: "0",
                        ImgfarmerwithSourceIrri: "",
                        TotalAmount: "0",
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                    }
                } else {
                    sendRequestData = {
                        obj: {
                            usrnm: "rajkisan",
                            psw: "rajkisan@123",
                            srvnm: "PostVerification",
                            srvmethodnm: "AddPostVerificationPipeline",
                            srvparam: JSON.stringify({
                                ApplicationId: this.getPreVerificationData.ApplicationId,
                                IsFarmerAcceptance: "Yes",
                                IsSubsidyGranted: "Yes",
                                UserId: this.httpClient.userData.userid,
                                latitude: this.lat,
                                longitude: this.lng,
                                Remarks: "",
                                GrantedYear: new Date(this.previousGrantYear).getFullYear(),
                                RoleId: self.httpClient.userData.roleid,
                                SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                                ImgFarmerWithOfficer: this.photoFarmerWithOfficerPreviousGranted,
                                ImgFarmerWithOfficerDate: this
                                    .photoFarmerWithOfficerPreviousGrantedDateTime,
                                ImgNotAcceptanceDoc: "",
                                ImgNotAcceptanceDocDate: "",
                                ImgAffidevitSubsidyGranted: this.PhotoOfAffidavitPreviousGranted,
                                ImgAffidevitSubsidyGrantedDate: this
                                    .PhotoOfAffidavitPreviousGrantedDateTIme,
                                PipelineTypeId: "0",
                                PostVerificationKhasraNo: "",
                                Dimeter: "",
                                BrandId: "0",
                                CompanyId: "0",
                                ManufacturingYear: "",
                                ManufacturingBatchNo: "",
                                ISINo: "",
                                CMLNo: "",
                                PipelineLength: "0",
                                ImgfarmerwithSourceIrri: "",
                                TotalAmount: "0",
                                AppVersion: "V." + this.httpClient.currentAppVersion,
                                IsOnline_Offline: tempOfflineFlag,
                            }),
                        },
                    };
                }

                this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    temp.sendRequestData = sendRequestData;
                    temp.farmerGrantPrevious = this.farmerGrantPrevious;
                    temp.finalSubmission = "previousGranted";
                    let data = temp;
                    this.dbService.storage.executeSql(
                        `
                  UPDATE postVpipelineIrrigationAllData
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `,
                        []
                    )
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
                var sendRequestDataTwo = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "AddPostVerificationPipeline",
                        srvparam: JSON.stringify({
                            ApplicationId: this.getPreVerificationData.ApplicationId,
                            IsFarmerAcceptance: "Yes",
                            IsSubsidyGranted: "Yes",
                            UserId: this.httpClient.userData.userid,
                            latitude: this.lat,
                            longitude: this.lng,
                            Remarks: "",
                            GrantedYear: new Date(this.previousGrantYear).getFullYear(),
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                            ImgFarmerWithOfficer: this.photoFarmerWithOfficerPreviousGranted,
                            ImgFarmerWithOfficerDate: this
                                .photoFarmerWithOfficerPreviousGrantedDateTime,
                            ImgNotAcceptanceDoc: "",
                            ImgNotAcceptanceDocDate: "",
                            ImgAffidevitSubsidyGranted: this.PhotoOfAffidavitPreviousGranted,
                            ImgAffidevitSubsidyGrantedDate: this
                                .PhotoOfAffidavitPreviousGrantedDateTIme,
                            PipelineTypeId: "0",
                            PostVerificationKhasraNo: "",
                            Dimeter: "",
                            BrandId: "0",
                            CompanyId: "0",
                            ManufacturingYear: "",
                            ManufacturingBatchNo: "",
                            ISINo: "",
                            CMLNo: "",
                            PipelineLength: "0",
                            ImgfarmerwithSourceIrri: "",
                            TotalAmount: "0",
                            AppVersion: "V." + this.httpClient.currentAppVersion,
                            IsOnline_Offline: tempOfflineFlag,
                        }),
                    },
                };
                console.log("sendRequestData", sendRequestData);
                this.httpClient.post(sendRequestDataTwo).subscribe(
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
                                srvmethodnm: "AddPostVerificationPipeline",
                                srvparam: JSON.stringify({
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    IsFarmerAcceptance: "Yes",
                                    IsSubsidyGranted: "Yes",
                                    UserId: self.httpClient.userData.userid,
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    Remarks: "",
                                    GrantedYear: new Date(self.previousGrantYear).getFullYear(),
                                    RoleId: self.httpClient.userData.roleid,
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    ImgFarmerWithOfficer: self.photoFarmerWithOfficerPreviousGranted,
                                    ImgFarmerWithOfficerDate: self
                                        .photoFarmerWithOfficerPreviousGrantedDateTime,
                                    ImgNotAcceptanceDoc: "",
                                    ImgNotAcceptanceDocDate: "",
                                    ImgAffidevitSubsidyGranted: self.PhotoOfAffidavitPreviousGranted,
                                    ImgAffidevitSubsidyGrantedDate: self
                                        .PhotoOfAffidavitPreviousGrantedDateTIme,
                                    PipelineTypeId: "0",
                                    PostVerificationKhasraNo: "",
                                    Dimeter: "",
                                    BrandId: "0",
                                    CompanyId: "0",
                                    ManufacturingYear: "",
                                    ManufacturingBatchNo: "",
                                    ISINo: "",
                                    CMLNo: "",
                                    PipelineLength: "0",
                                    ImgfarmerwithSourceIrri: "",
                                    TotalAmount: "0",
                                    AppVersion: "V." + self.httpClient.currentAppVersion,
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

    uploadImages(requestDataOfPhoto, param) {
        var self = this;
        self.httpClient.showLoading();
        console.log("sendRequestData", requestDataOfPhoto);
        this.httpClient.post(requestDataOfPhoto).subscribe(
            function (res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    // self.successAlertPop();
                } else {
                    if (param == 1) {
                        self.farmerAndOfficerWithIrrigationSource = null;
                        self.farmerAndOfficerWithIrrigationSourceDateTime = null;
                    } else if (param == 2) {
                        self.farmerAndOfficerAtTheEndPointOfPipeline = null;
                        self.farmerAndOfficerAtTheEndPointOfPipelineDateTime = null;
                    } else if (param == 3) {
                        self.authorizedVendorCertificate = null;
                        self.authorizedVendorCertificateDateTime = null;
                    } else if (param == 8) {
                        self.photoOfNazriyaNaksha = null;
                        self.photoOfNazriyaNakshaDateTime = null;
                    }
                    self.httpClient.showToast(res[0].data);
                }
            },
            (error) => {
                self.httpClient.dismissLoading();
                self.httpClient.showToastError();
            }
        );
    }

    finalSubmission() {
        console.log(
            "authorizedVendorCertificate",
            this.authorizedVendorCertificate
        );
        console.log(
            "farmerAndOfficerWithIrrigationSource",
            this.farmerAndOfficerWithIrrigationSource
        );
        console.log(
            "farmerAndOfficerAtTheEndPointOfPipeline",
            this.farmerAndOfficerAtTheEndPointOfPipeline
        );
        console.log("photoOfNazriyaNaksha", this.photoOfNazriyaNaksha);
        if (this.billArray.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल अपलोड करें ");
            } else {
                this.httpClient.showToast("Please upload the bill");
            }
        } else if (this.farmerAndOfficerWithIrrigationSource == undefined) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया सिंचाई के स्तोत्र के साथ कृषक व कार्मिक फोटो लें "
                );
            } else {
                this.httpClient.showToast(
                    "Please take photo of Farmer and officer with irrigation source"
                );
            }
        } else if (this.farmerAndOfficerAtTheEndPointOfPipeline == undefined) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please take photo of Farmer and officer at the end point of pipeline"
                );
            } else {
                this.httpClient.showToast(
                    "पाइपलाइन के अंतिम छोर पर कृषक और कार्मिक फोटो लें "
                );
            }
        } else if (this.authorizedVendorCertificate == undefined) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please take photo of Authorized vendor certificate"
                );
            } else {
                this.httpClient.showToast("अधिकृत विक्रेता प्रमाण पत्र फोटो लें ");
            }
        } else if (this.photoOfNazriyaNaksha == undefined) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Please take photo of Nazriya Naksha");
            } else {
                this.httpClient.showToast("कृपया नजरिया नक़्शे की फोटो लें");
            }
        } else {
            var self = this;
            if (this.httpClient.isOffline == true) {
                var sendRequestDataOne = {
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
                this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    temp.finalSubmission = sendRequestDataOne;
                    let data = temp;
                    this.dbService.storage.executeSql(
                        `
                  UPDATE postVpipelineIrrigationAllData
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `,
                        []
                    )
                        .then(() => {
                            self.successAlertFinalSubmission();
                            ;

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
                        srvmethodnm: "FinalSubmissionPostVerification",
                        srvparam: JSON.stringify({
                            ApplicationId: this.getPreVerificationData.ApplicationId,
                            userid: this.httpClient.userData.userid,
                            SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                            roleid: self.httpClient.userData.roleid,
                        }),
                    },
                };
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

    submitNoForm() {
        var tempOfflineFlag;
        if (this.httpClient.isOffline == true) {
            tempOfflineFlag = 1;
        } else {
            tempOfflineFlag = 0;
        }

        // if (!this.lat) {
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

        if (this.farmerAndOfficer == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया कृषक के साथ कार्मिक फोटो लें ");
            } else {
                this.httpClient.showToast("Please take photo of Farmer with Officer");
            }
        } else if (this.fFarmerLetterOfDissent == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please take photo of Farmers letter of dissent"
                );
            } else {
                this.httpClient.showToast("कृषक का असहमति पत्र फोटो लें ");
            }
        } else {
            var self = this;
            if (this.httpClient.isOffline == true) {
                var finalSubmissionOffline = {
                    ApplicationId: this.getPreVerificationData.ApplicationId,
                    IsFarmerAcceptance: "No",
                    IsSubsidyGranted: "No",
                    UserId: this.httpClient.userData.userid,
                    latitude: this.lat,
                    longitude: this.lng,
                    Remarks: "",
                    RoleId: self.httpClient.userData.roleid,
                    SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                    ImgFarmerWithOfficer: this.farmerAndOfficer,
                    ImgFarmerWithOfficerDate: this.farmerAndOfficerDateTime,
                    ImgNotAcceptanceDoc: this.fFarmerLetterOfDissent,
                    ImgNotAcceptanceDocDate: this.fFarmerLetterOfDissentDateTime,
                    ImgAffidevitSubsidyGranted: "",
                    ImgAffidevitSubsidyGrantedDate: "",
                    PipelineTypeId: "0",
                    PostVerificationKhasraNo: "",
                    Dimeter: "",
                    BrandId: "0",
                    CompanyId: "0",
                    ManufacturingYear: "",
                    ManufacturingBatchNo: "",
                    ISINo: "",
                    CMLNo: "",
                    PipelineLength: "0",
                    ImgfarmerwithSourceIrri: "",
                    TotalAmount: "0",
                    AppVersion: "V." + this.httpClient.currentAppVersion,
                    IsOnline_Offline: tempOfflineFlag,
                };
                this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    temp.finalSubmission = finalSubmissionOffline;
                    let data = temp;
                    this.dbService.storage.executeSql(
                        `
                  UPDATE postVpipelineIrrigationAllData
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.getPreVerificationData.ApplicationId}'
                `,
                        []
                    )
                        .then(() => {
                            self.successAlertFinalSubmission();
                            ;

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
                        srvmethodnm: "AddPostVerificationPipeline",
                        srvparam: JSON.stringify({
                            ApplicationId: this.getPreVerificationData.ApplicationId,
                            IsFarmerAcceptance: "No",
                            IsSubsidyGranted: "No",
                            UserId: this.httpClient.userData.userid,
                            latitude: this.lat,
                            longitude: this.lng,
                            Remarks: "",
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                            ImgFarmerWithOfficer: this.farmerAndOfficer,
                            ImgFarmerWithOfficerDate: this.farmerAndOfficerDateTime,
                            ImgNotAcceptanceDoc: this.fFarmerLetterOfDissent,
                            ImgNotAcceptanceDocDate: this.fFarmerLetterOfDissentDateTime,
                            ImgAffidevitSubsidyGranted: "",
                            ImgAffidevitSubsidyGrantedDate: "",
                            PipelineTypeId: "0",
                            PostVerificationKhasraNo: "",
                            Dimeter: "",
                            BrandId: "0",
                            CompanyId: "0",
                            ManufacturingYear: "",
                            ManufacturingBatchNo: "",
                            ISINo: "",
                            CMLNo: "",
                            PipelineLength: "0",
                            ImgfarmerwithSourceIrri: "",
                            TotalAmount: "0",
                            AppVersion: "V." + this.httpClient.currentAppVersion,
                            IsOnline_Offline: tempOfflineFlag,
                        }),
                    },
                };
                console.log("sendRequestData", sendRequestData);
                this.httpClient.post(sendRequestData).subscribe(
                    function (res: any) {
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            self.successAlertFinalSubmission();
                        } else {
                            self.farmerAndOfficerDateTime = null;
                            self.farmerAndOfficer = null;
                            self.fFarmerLetterOfDissent = null;
                            self.fFarmerLetterOfDissentDateTime = null;
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
                                srvmethodnm: "AddPostVerificationPipeline",
                                srvparam: JSON.stringify({
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    IsFarmerAcceptance: "No",
                                    IsSubsidyGranted: "No",
                                    UserId: self.httpClient.userData.userid,
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    Remarks: "",
                                    RoleId: self.httpClient.userData.roleid,
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    ImgFarmerWithOfficer: self.farmerAndOfficer,
                                    ImgFarmerWithOfficerDate: self.farmerAndOfficerDateTime,
                                    ImgNotAcceptanceDoc: self.fFarmerLetterOfDissent,
                                    ImgNotAcceptanceDocDate: self.fFarmerLetterOfDissentDateTime,
                                    ImgAffidevitSubsidyGranted: "",
                                    ImgAffidevitSubsidyGrantedDate: "",
                                    PipelineTypeId: "0",
                                    PostVerificationKhasraNo: "",
                                    Dimeter: "",
                                    BrandId: "0",
                                    CompanyId: "0",
                                    ManufacturingYear: "",
                                    ManufacturingBatchNo: "",
                                    ISINo: "",
                                    CMLNo: "",
                                    PipelineLength: "0",
                                    ImgfarmerwithSourceIrri: "",
                                    TotalAmount: "0",
                                    AppVersion: "V." + self.httpClient.currentAppVersion,
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

    test() {
        // this.previousGrantYear = new Date(this.previousGrantYear).getFullYear();
    }

    removeBillDetails() {
        this.createdBillDetails = [];
    }

    submitYesForm() {

    }

    getExtensionNazaria(url) {
    }
    selectedBrandDeatails: any;

    async selectBrandName() {
        const modal = await this.modalController.create({
            component: SelectBrandNamePage,
            componentProps: {
                listOfBrandsName: this.listOfBrandsName,
            },
        });
        modal.onDidDismiss().then((data) => {
            if (data.data != null) {
                console.log("data.data.selectedBrand", data.data.selectedBrand);
                this.selectedBrandName = data.data.selectedBrand.CompanyBrandId;
            }
        });
        return await modal.present();
    }
    addMore() {

        if (!this.selectedPipelineTYpe) {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया सिंचाई पाइप का प्रकार का चयन करें ' : 'Please select the Type of irrigation pipe');
        }
        else if (!this.selectedDiameter) {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया सिंचाई पाइप का व्यास  का चयन करें' : 'Please select the Pipe diameter');
        }
        else if (!this.selectedBrandName) {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया ब्रांड का नाम का चयन करें' : 'Please select the Brand name');
        }

        else if (!this.selectedConstructionYearOfThePipe) {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया सिंचाई पाइप का निर्माण वर्ष चयन करें' : 'Please select the construction year of the pipe');
        }
        // 
        else if (!this.selectedISINumber) {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया आईएसआई नंबर का चयन करें' : 'Please select the ISI number');
        }
        else if (!this.selectedCMLNumber) {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया सी एम् एल नंबर का चयन करें' : 'Please select the CML number');
        }

        else if (!this.manufacturingBatchNumber) {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया मैन्युफैक्चरिंग बैच संख्या  दर्ज करें' : 'Please enter manufacturing batch number');
        }



        else if (!this.totalLengthPipe) {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया मौके पर स्थापित पाइप लाइन की लम्बाई दर्ज करें' : 'Please enter Total length of pipe');
        }
        else {
            var tempPipeline = this.listOfPipeLineType.filter((x) => x.PipelineTypeId == this.selectedPipelineTYpe);
            var tempBrand = this.listOfBrandsName.filter((x) => x.CompanyBrandId == this.selectedBrandName);
            var tempIsi = this.listofISINumbers.filter((x) => x.Id == this.selectedISINumber);
            var tempCML = this.listOfCMLdetails.filter((x) => x.CMLMasterId == this.selectedCMLNumber);

            this.PipelinePVTransList.push(
                {
                    'PipelineTypeId': this.selectedPipelineTYpe,
                    'Dimeter': this.selectedDiameter,
                    'BrandId': this.selectedBrandName,
                    'ManufacturingYear': this.selectedConstructionYearOfThePipe,
                    'ManufacturingBatchNo': this.manufacturingBatchNumber,
                    'ISINo': this.selectedISINumber,
                    'CMLNo': this.selectedCMLNumber,
                    'PipelineLength': this.totalLengthPipe
                }
            );
            this.PipelinePVTransListName.push(
                {
                    'PipelineTypeId': this.selectedPipelineTYpe,
                    'PipelineTypeNameEn': tempPipeline[0].PipelineTypeEn,
                    'PipelineTypeNameHi': tempPipeline[0].PipelineTypeHi,
                    'Dimeter': this.selectedDiameter,
                    'BrandId': this.selectedBrandName,
                    'BrandNameEn': tempBrand[0].CompanyBrandNameEn,
                    'BrandNameHi': tempBrand[0].CompanyBrandNameHi,
                    'ManufacturingYear': this.selectedConstructionYearOfThePipe,
                    'ManufacturingBatchNo': this.manufacturingBatchNumber,
                    'ISINoNameEn': tempIsi[0].BISNoEn,
                    'ISINoNameHi': tempIsi[0].BISNoHi,
                    'ISINo': this.selectedISINumber,
                    'CMLNo': this.selectedCMLNumber,
                    'CMLNoName': tempCML[0].CMLNo,
                    'PipelineLength': this.totalLengthPipe
                }
            )


            this.selectedPipelineTYpe = "";
            this.selectedDiameter = "";
            this.selectedBrandName = "";
            this.selectedConstructionYearOfThePipe = "";
            this.manufacturingBatchNumber = "";
            this.selectedISINumber = "";
            this.selectedCMLNumber = "";
            this.totalLengthPipe = "";
        }
    }
    delete(i) {
        this.PipelinePVTransList.splice(i, 1);
        this.PipelinePVTransListName.splice(i, 1);
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
                    this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
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
                        this.dbService.storage.executeSql(`UPDATE postVpipelineIrrigationAllData SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
            this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);

                temp.jamabandiArray.splice(i, 1)
                console.log("temp", temp);
                let data = [JSON.stringify(temp)];
                this.dbService.storage.executeSql(`UPDATE postVpipelineIrrigationAllData SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                this.dbService.storage.executeSql("SELECT * FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    console.log("temp", temp);
                    temp.NakshaTrace = { nakshaTraceImage: imageData, nakshaTraceOptions: options }
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVpipelineIrrigationAllData SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data).then(() => {
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
