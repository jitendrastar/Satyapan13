import { HttpClient } from "@angular/common/http";
import {Component, NgZone, OnInit} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    ModalController,
    NavController,
} from '@ionic/angular';
import { ActivatedRoute, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { Storage } from "@ionic/storage";
import { CommonService } from "../../services/common.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { BillModelPage } from "../../bill-model/bill-model.page";
import { HortiApplicationBillModelPage } from "../horti-application-bill-model/horti-application-bill-model.page";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

import { File } from "@ionic-native/file/ngx";
import { DatabaseServiceService } from '../../services/database-service.service';

@Component({
    selector: "app-micro-sprinkler-post-verification",
    templateUrl: "./micro-sprinkler-post-verification.page.html",
    styleUrls: ["./micro-sprinkler-post-verification.page.scss"],
})
export class MicroSprinklerPostVerificationPage {
    remarks: any = "";

    data: any;
    CompomnentTable: any;
    getHorticultureManufactureData: any = [];
    listOfISIMarks: any = [];
    getHorticultureManufactureDealerListData: any = [];
    getVerificationCheckData: any = [];
    mainDetailsFlag = false;
    checkListClose = false;
    hactarePSClose = false;
    uploadPhotosClose = false;
    uploadBillsClose = false;
    submitBtn = false;
    manufacturerValue: any;
    dealerValue: any;
    brandData: any = [];
    getHorticultureCouplerComponentListData: any = [];
    brandValue: any;
    imgSourceOfIrrigation: any;
    imgSourceOfIrrigationDateTime: any;
    imgSprinklerWithFarmer: any;
    imgSprinklerWithFarmeDateTime: any;
    sourceOfIrrigationLatitude: any;
    sourceOfIrrigationLongitude: any;
    sprinklerWithFarmerLatitude: any;
    sprinklerWithFarmerLongitude: any;
    ImgTriPartyAgreement: any;
    billArray: any = [];
    getAddSprinklerPostVerificationData: any = [];
    ChecklistDetailList: any = [];
    totalAmountOfBill: any;
    latitude: any;
    longitude: any;

    postVerificationId: any;

    toggleCheckList() {
        this.checkListClose = !this.checkListClose;
    }

    toggleHectarePS() {
        this.hactarePSClose = !this.hactarePSClose;
    }

    togglePhotos() {
        this.uploadPhotosClose = !this.uploadPhotosClose;
    }

    toggleBill() {
        this.uploadBillsClose = !this.uploadBillsClose;
    }

    basicDataSubmitFlag = true;
    khasaraFlag = true;
    billandPhotoFlag = false;
    fileTransfer: any;

    toggleKhasara() {
        console.log("test");
        this.khasaraFlag = !this.khasaraFlag;
    }

    selectedKhasaraNumber: any;
    selectedAccountOf: any;
    imgOfConsentLetter: any;
    selectedShareProvided = -1;
    ImgFarmerWithOfficer: any;
    ImgFarmerWithOfficer2: any;
    ImgDripBrandName1: any;
    ImgDripBrandName2: any;
    ImgWarrantyCard: any;


    capacitySizeData: any = [];
    unitCost: any;
    optionalItemName: any = [
        {
            optionalItemId: '1',
            optionalItemName: 'Sand filter with back wash assembly (IS 14606)',

        }, {
            optionalItemId: '2',
            optionalItemName: 'Hydrocyclone filter (IS 14743)',

        }, {
            optionalItemId: '3',
            optionalItemName: 'Fertilizer Tank with assembl',

        },
    ];
    getPVOptionalItemListData: any = [];
    selectedPipe: any;
    selectedPipeName: any;

    optionalItemNameValue: any;
    capacitySizeDataValue: any;
    optionalArray: any = [];
    unitCostValue: any;
    arr = [];
    haValue: any;

    multiUserArray: any=[];
    subsidyList: any=[
        {
            id:'2',
            name:'Raingun'
        }, {
            id:'3',
            name:'Sprinkler'
        }, {
            id:'10',
            name:'Micro Sprinkler'
        }, {
            id:'11',
            name:'Drip Irrigation'
        }, {
            id:'16',
            name:'Mini Sprinkler'
        },
    ];

    toggleMultiuserClose = false;

    toggleMultiuser() {
        this.toggleMultiuserClose = !this.toggleMultiuserClose;
    }



    LandAreaArr = [];
    landArea: any;
    amt: any;
    docUrl: any;
    subsidyId: any;


    showLoader: boolean = false;
    availSubsidyFlag: boolean = false;
    p_bar_value: number = 0;
    uploadPercent: any = 0;
    year: any;
    oneYearFromNow: any;
    oldDocImgUrl: any ;
    checked: any ;
    prevAvailedSubsidyArray: any = [];
    checkArray: any = [];


    IsFarmerAcceptance: any='Yes';
    isFarmerAcceptanceRemark: any='';
    photoFarmerApprovalCertificate: any;
    photoFarmerApprovalCertificateDateTime: any;
    noCaseDateOfImgFarmer: any;
    noCaseDateOfImgLetter: any;
    lat: any;
    lng: any;
    photoFarmerWithOfficer: any;
    photoFarmerWithOfficerDateTime: any;



    constructor(
        private transfer: FileTransfer,
        private file: File,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public router: Router,
        public alertCtrl: AlertController,
        private callNumber: CallNumber,
        public camera: Camera,
        public geolocation: Geolocation,
        public modalController: ModalController,
        private route: ActivatedRoute,
        private actionSheetController: ActionSheetController,
        private storage: Storage, private ngZone: NgZone,
        public httpClient: CommonService,
        public dbService: DatabaseServiceService

    ) {

        this.fileTransfer = this.transfer.create();
        this.data = JSON.parse(this.route.snapshot.paramMap.get("data"));


        if(this.data.MultiApplicant) {


            var multiString = this.data.MultiApplicant;
            console.log('multiString', multiString);

            var arraylist = multiString.split(', ');
            console.log(arraylist);
            for (let i = 0; i < arraylist.length; i++) {
                var temp = arraylist[i].split(' / ');
                this.multiUserArray.push({
                    applicantName: temp[0],
                    fatherName: temp[1]
                });

            }
            console.log(temp, 'temp');
            console.log('multiUserArray', this.multiUserArray);
        }
        this.oneYearFromNow=new Date().getFullYear() -7;
        console.log('oneYearFromNow',this.oneYearFromNow );

        for (let i = 0.20; i < parseFloat("4.99") + 0.01; i = i + 0.01) {
            this.LandAreaArr.push({
                value: i.toFixed(2)
            });
        }
        console.log('arr ', this.LandAreaArr    );



        this.selectedKhasaraNumber = this.data.KhasraNo;
        console.log("coming Data", this.data);
        console.log("coming HectareModel", this.data.HectareModel);
        console.log("coming pipesize", this.data.PipeSize);
        if (!this.httpClient.isOffline) {
            this.brandData = JSON.parse(this.route.snapshot.paramMap.get("brandData"));
            if (parseInt(this.data.PostVerificationId) > 0) {
                this.basicDataSubmitFlag = false;
                this.billandPhotoFlag = true;
                this.postVerificationId = this.data.PostVerificationId;
                if (this.data.ImgDripBrandName1 != "") {
                    this.ImgDripBrandName1 = this.data.ImgDripBrandName1;
                }
                if (this.data.ImgDripBrandName2 != "") {
                    this.ImgDripBrandName2 = this.data.ImgDripBrandName2;
                }
                if (this.data.ImgWarrantyCard != "") {
                    this.ImgWarrantyCard = this.data.ImgWarrantyCard;
                }
                if (this.data.ImgFarmerWithOfficer != "") {
                    this.ImgFarmerWithOfficer = this.data.ImgFarmerWithOfficer;
                }
                if (this.data.ImgFarmerWithOfficer2 != "") {
                    this.ImgFarmerWithOfficer2 = this.data.ImgFarmerWithOfficer2;
                }
                if (this.data.ImgTriPartyAgreement != "") {
                    this.ImgTriPartyAgreement = this.data.ImgTriPartyAgreement;
                }
                this.getBills();
            }

        }
        else {
            if (this.data.basicDataSubmission) {
                this.basicDataSubmitFlag = false;
                this.billandPhotoFlag = true;
                if (this.data.ImgFarmerWithOfficer) {
                    this.ImgFarmerWithOfficer = this.data.ImgFarmerWithOfficer;
                }
                if (this.data.ImgFarmerWithOfficer2) {
                    this.ImgFarmerWithOfficer2 = this.data.ImgFarmerWithOfficer2;
                }
                if (this.data.ImgDripBrandName1) {
                    this.ImgDripBrandName1 = this.data.ImgDripBrandName1;
                }
                if (this.data.ImgDripBrandName2) {
                    this.ImgDripBrandName2 = this.data.ImgDripBrandName2;
                }
                if (this.data.ImgWarrantyCard) {
                    this.ImgWarrantyCard = this.data.ImgWarrantyCard;
                }
                if (this.data.ImgTriPartyAgreement) {
                    this.ImgTriPartyAgreement = this.data.ImgTriPartyAgreement;
                }

                if (this.data.billDetails) {
                    this.billArray = this.data.billDetails;
                }
                //
            }
        }
        // parseFloat(this.data.HectareModel)+0.01
        for (let i = 0.19; i <= parseFloat(this.data.HectareModel) + 0.01; i = i + 0.01) {
            this.arr.push({
                value: i.toFixed(2)
            });
        }
        console.log('arr ', this.arr);
        console.log("coming brandData", this.brandData);
        this.getVerificationChecklistData(this.data.ApplicationId);
        this.getHorticultureManufactureListData();
        // this.getHorticultureCouplerComponentList();
        this.getISILIST();
    }

    getISILIST() {
        if (this.httpClient.isOffline) {
            this.listOfISIMarks = this.data.listOfISIMarks;
        }
        else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetISIMarkList",
                    srvparam: "{'SubsidySchemeId':'10'}",
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log("res", res);
                    // self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        self.listOfISIMarks = res[0].data;
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
                            srvmethodnm: "GetISIMarkList",
                            srvparam: "{'SubsidySchemeId':'10'}",
                        }
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
                    ApplicationId: this.data.ApplicationId,
                    SubsidySchemeId: this.data.SubsidySchemeId,
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
                            ApplicationId: self.data.ApplicationId,
                            SubsidySchemeId: self.data.SubsidySchemeId,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    ionViewDidLoad() {
        console.log("ionViewDidLoad AaoVerificationPage");
    }

    ionViewWillEnter() {
        this.getLoc();
    }

    getVerificationChecklistData(hortiSubsidyApplicationId) {
        if (this.httpClient.isOffline) {
            this.getVerificationCheckData = this.data.getVerificationCheckData;
        }
        else {
            var self = this;
            self.httpClient.showLoadingImage();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "VerificationChecklist",
                    srvparam: JSON.stringify({
                        schemeid: this.data.SubsidySchemeId,
                        StepName: "Post Verification",
                        ApplicationId: this.data.ApplicationId,
                    }),
                },
            };
            console.log("VerificationChecklistt - ", sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log(" VerificationChecklist res", res);
                    self.httpClient.dismissLoadingImage();

                    if (res[0].status == 0) {
                        self.getVerificationCheckData = res[0].data;
                        for (var i = 0; i < self.getVerificationCheckData.length; i++) {
                            self.getVerificationCheckData[i].isSelectedClose = false;
                            self.getVerificationCheckData[i].isSelectedCheck = false;
                        }
                    } else {
                        self.showPrompt(res[0].data);
                    }
                },
                (error) => {
                    // self.httpClient.dismissLoading();
                    // self.httpClient.showToast(self.httpClient.errorMessage);
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "VerificationChecklist",
                            srvparam: JSON.stringify({
                                schemeid: self.data.SubsidySchemeId,
                                StepName: "Post Verification",
                                ApplicationId: self.data.ApplicationId,
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

    getHorticultureManufactureListData() {
        if (this.httpClient.isOffline) {
            this.getHorticultureManufactureData = this.data.getHorticultureManufactureData;
        }
        else {
            var self = this;
            self.httpClient.showLoadingImage();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetHorticultureManufactureList",
                    srvparam: "{}",
                },
            };
            console.log("HorticultureManufactureList - ", sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log(" HorticultureManufactureList res", res);
                    self.httpClient.dismissLoadingImage();

                    if (res[0].status == 0) {
                        self.getHorticultureManufactureData = res[0].data;
                    } else {
                        self.showPrompt(res[0].data);
                    }
                },
                (error) => {
                    // self.httpClient.dismissLoading();
                    // self.httpClient.showToast(self.httpClient.errorMessage);
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "GetHorticultureManufactureList",
                            srvparam: "{}"
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }

    getHorticultureManufactureDealerList(manufacturerId, protoTypeId) {
        if (this.httpClient.isOffline) {
            console.log("manufacturerId", manufacturerId);
            console.log("this.data.getHorticultureManufactureDealerListData", this.data.getHorticultureManufactureDealerListData);
            this.getHorticultureManufactureDealerListData = this.data.getHorticultureManufactureDealerListData.filter((x) => x.Agri_HortiManufacturerId == manufacturerId)
            // console.log("this.getHorticultureManufactureDealerListData", this.getHorticultureManufactureDealerListData);
            console.log('RS getHorticultureManufactureDealerList ev3', this.getHorticultureManufactureDealerListData);


        }
        else {
            var self = this;
            self.httpClient.showLoadingImage();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetHorticultureManufactureDealerList",
                    srvparam:
                        "{'HorticultureManufactureId':'" +
                        manufacturerId +
                        "','ProductTypeId':'" +
                        protoTypeId +
                        "'}",
                },
            };
            console.log("GetHorticultureManufactureDealerList - ", sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log(" GetHorticultureManufactureDealerList res", res);
                    self.httpClient.dismissLoadingImage();

                    if (res[0].status == 0) {
                        self.getHorticultureManufactureDealerListData = res[0].data;
                    } else {
                        self.showPrompt(res[0].data);
                        self.getHorticultureManufactureDealerListData = '';
                        self.dealerValue = "";
                    }
                },
                (error) => {
                    // self.httpClient.dismissLoading();
                    // self.httpClient.showToast(self.httpClient.errorMessage);
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "GetHorticultureManufactureDealerList",
                            srvparam:
                                "{'HorticultureManufactureId':'" +
                                manufacturerId +
                                "','ProductTypeId':'" +
                                protoTypeId +
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
                            // this.navCtrl.pop();
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
                            // this.navCtrl.pop();
                        },
                    },
                ],
            });
            await alert.present();
        }
    }

    getMenuPrototype(ev) {
        // console.log(ev);
        for (let i = 0; i < this.getHorticultureManufactureData.length; i++) {
            if (
                this.getHorticultureManufactureData[i].Agri_HortiManufacturerId == ev
            ) {
                var manufacturerId = this.getHorticultureManufactureData[i]
                    .Agri_HortiManufacturerId;
                var protoTypeId = this.getHorticultureManufactureData[i].ProductType;

                this.brandValue = this.getHorticultureManufactureData[i].Brand;
                console.log(manufacturerId);
                console.log(protoTypeId);
                this.getHorticultureManufactureDealerList(manufacturerId, '2');
            }
        }
    }

    getLoc() {
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                console.log(
                    " getting  location",
                    resp.coords.latitude + "-----" + resp.coords.longitude
                );
                this.latitude = resp.coords.latitude;
                this.longitude = resp.coords.longitude;
            })
            .catch((error) => {
                this.showPrompt("Error getting Source Of Irrigation location");
            });
    }

    getAddSprinklerPostVerification() {
        var test = this.prevAvailedSubsidyArray.filter((x) => x.SubsidyId == "" );
        var test2 = this.prevAvailedSubsidyArray.filter((x) => x.Year == "" );
        var test3 = this.prevAvailedSubsidyArray.filter((x) => x.LandArea == "" );
        var test4 = this.prevAvailedSubsidyArray.filter((x) => x.Amount == "" );
        var test5 = this.prevAvailedSubsidyArray.filter((x) => x.ProofDoc == "" );


        console.log('PrevAvailedSubsidyArray',this.prevAvailedSubsidyArray);
        var checkArray=[];
        checkArray = this.prevAvailedSubsidyArray.filter((x) => x.IsDeductSubsidy == true)
        console.log(checkArray);

        var self = this;
        if (this.manufacturerValue == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया निर्माता का चयन करें");
            } else {
                this.httpClient.showToast("Please select the manufacturer");
            }
        } else if (this.haValue == null || this.haValue == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया हेक्टेयर का चयन करें");
            } else {
                this.httpClient.showToast("Please select the Hectare Model");
            }
        } else if (this.dealerValue == null || this.dealerValue == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया विक्रेता का चयन करें");
            } else {
                this.httpClient.showToast("Please select the dealer");
            }
        } else if (this.brandValue == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया ब्रांड का चयन करें");
            } else {
                this.httpClient.showToast("Please select the brand");
            }
        } else if (this.selectedAccountOf == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया सब्सिडी किसके खाते में जाएगी का चयन करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please select in whose account will the subsidy transfer"
                );
            }
        } else if (
            this.selectedAccountOf == "1" &&
            this.selectedShareProvided == -1
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया किसान शेयर उपलब्ध कराया गया है का चयन करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please select whether farmer is share is provided"
                );
            }
        } else if (
            this.selectedAccountOf == "1" &&
            this.imgOfConsentLetter == null
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया सहमति पत्र अपलोड करें");
            } else {
                this.httpClient.showToast("Please upload the consent letter");
            }
        } else if (
            this.getVerificationCheckData.length != self.ChecklistDetailList.length
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया चेकलिस्ट को पूरा करें");
            } else {
                this.httpClient.showToast("Please complete the checklist");
            }
        }

        else if (
            test.length > 0 ||
            test2.length > 0 ||
            test3.length > 0 ||
            test4.length > 0 ||
            test5.length > 0
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया पहले प्राप्त सब्सिडी विवरण को पूरा करें");
            } else {
                this.httpClient.showToast("Please Complete Previous Availed Subsidy Detail");
            }

        }
        else {

            if (this.httpClient.isOffline) {
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?",
                    [this.data.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.basicDataSubmission = {
                            IsFarmerAcceptance: "Yes",
                            ApplicationId: this.data.ApplicationId,
                            latitude: this.httpClient.latitude,
                            longitude: this.httpClient.longitude,
                            ChecklistDetailList: self.ChecklistDetailList,
                            SprinklerComponentinfo: [],
                            UserId: self.httpClient.userData.userid,
                            Step: "1",
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: self.data.SubsidySchemeId,
                            AppVersion: self.httpClient.currentAppVersion,
                            IsOnline_Offline: "1",
                            mobilToVerify: "1",
                            KhasraNo: this.selectedKhasaraNumber,
                            ImgConsentLetter: this.imgOfConsentLetter,
                            ImgConsentLetterDateTime: new Date(),
                            BrandId: this.manufacturerValue,
                            dealerid: this.dealerValue,
                            manufactureid: this.manufacturerValue,
                            SubsidyOnAccount: this.selectedAccountOf,
                            IsfarmerShare: this.selectedShareProvided,
                            HectareModel: this.haValue,
                            optionalArray: this.optionalArray,
                            PrevAvailedSubsidyArray: this.prevAvailedSubsidyArray,

                        };
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                            .then(() => {
                                self.basicDataSubmitFlag = false;
                                self.billandPhotoFlag = true;
                                self.httpClient.showToast("Basic data is save now upload the required photos and bills");


                            })
                            .catch((e) => {
                                console.log("error " + JSON.stringify(e));
                            });

                    })
                    .catch((e) => {
                        alert("error " + JSON.stringify(e));
                    });
            }
            else {
                self.httpClient.showLoading();
                var sendRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "AddDripIrrigationPostVerification",
                        srvparam: JSON.stringify({
                            IsFarmerAcceptance: "Yes",
                            ApplicationId: this.data.ApplicationId,
                            latitude: this.httpClient.latitude,
                            longitude: this.httpClient.longitude,
                            ChecklistDetailList: self.ChecklistDetailList,
                            SprinklerComponentinfo: [],
                            UserId: self.httpClient.userData.userid,
                            Step: "1",
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: self.data.SubsidySchemeId,
                            AppVersion: self.httpClient.currentAppVersion,
                            IsOnline_Offline: "1",
                            mobilToVerify: "1",
                            KhasraNo: this.selectedKhasaraNumber,
                            ImgConsentLetter: this.imgOfConsentLetter,
                            ImgConsentLetterDateTime: new Date(),
                            BrandId: this.manufacturerValue,
                            dealerid: this.dealerValue,
                            manufactureid: this.manufacturerValue,
                            SubsidyOnAccount: this.selectedAccountOf,
                            IsfarmerShare: this.selectedShareProvided,
                            HectareModel: this.haValue,
                            optionalArray: this.optionalArray,
                            PrevAvailedSubsidyArray: this.prevAvailedSubsidyArray,

                        }),
                    },
                };
                console.log("AddSprinklerPostVerification - ", sendRequestData);
                this.httpClient.post(sendRequestData).subscribe(
                    function (res: any) {
                        console.log(" AddSprinklerPostVerification res", res);
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            self.getAddSprinklerPostVerificationData = res[0].data;
                            self.httpClient.showToast(res[0].message);

                            self.postVerificationId = res[0].data[0].PostVerificationId;
                            self.basicDataSubmitFlag = false;
                            self.billandPhotoFlag = true;
                        } else {
                            self.httpClient.showToast(res[0].message);
                        }
                    },
                    (error) => {
                        // self.httpClient.dismissLoading();
                        // self.httpClient.showToast(self.httpClient.errorMessage);
                        var errorRequestData = {
                            'obj': {
                                'usrnm': 'rajkisan',
                                'psw': 'rajkisan@123',
                                srvresponce: error,
                                userid: self.httpClient.userData.userid,
                                srvnm: "PostVerification",
                                srvmethodnm: "AddDripIrrigationPostVerification",
                                srvparam: JSON.stringify({
                                    IsFarmerAcceptance: "Yes",
                                    ApplicationId: self.data.ApplicationId,
                                    latitude: self.httpClient.latitude,
                                    longitude: self.httpClient.longitude,
                                    ChecklistDetailList: self.ChecklistDetailList,
                                    SprinklerComponentinfo: [],
                                    UserId: self.httpClient.userData.userid,
                                    Step: "1",
                                    RoleId: self.httpClient.userData.roleid,
                                    SubsidySchemeId: self.data.SubsidySchemeId,
                                    AppVersion: self.httpClient.currentAppVersion,
                                    IsOnline_Offline: "1",
                                    mobilToVerify: "1",
                                    KhasraNo: self.selectedKhasaraNumber,
                                    ImgConsentLetter: self.imgOfConsentLetter,
                                    ImgConsentLetterDateTime: new Date(),
                                    BrandId: self.manufacturerValue,
                                    dealerid: self.dealerValue,
                                    manufactureid: self.manufacturerValue,
                                    SubsidyOnAccount: self.selectedAccountOf,
                                    IsfarmerShare: self.selectedShareProvided,
                                    HectareModel: self.haValue,
                                    optionalArray: self.optionalArray,
                                    PrevAvailedSubsidyArray: this.prevAvailedSubsidyArray,

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
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?", [this.data.ApplicationId]).then((res) => {
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
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler
                  SET applicationData = '${JSON.stringify(data)}'
                  WHERE ApplicationId = '${this.data.ApplicationId}'
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

    submitNoForm() {
        console.log('isFarmerAcceptanceRemark',this.isFarmerAcceptanceRemark);
        console.log('photoFarmerApprovalCertificate',this.photoFarmerApprovalCertificate);
        console.log('noCaseDateOfImgLetter',this.noCaseDateOfImgLetter);
        console.log('photoFarmerWithOfficer',this.photoFarmerWithOfficer);
        console.log('noCaseDateOfImgFarmer',this.noCaseDateOfImgFarmer);
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
                this.httpClient.showToast("कृपया असहमति पत्र का फोटो अपलोड करें");
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
                    srvmethodnm: "AddDripIrrigationPostVerification",
                    srvparam: JSON.stringify({
                        ApplicationId: this.data.ApplicationId,
                        userid: self.httpClient.userData.userid,
                        WaterStorageType: "0",
                        SubsidySchemeId: this.data.SubsidySchemeId,
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
                        Remarks: this.isFarmerAcceptanceRemark,
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
                    ApplicationId: this.data.ApplicationId,
                    userid: self.httpClient.userData.userid,
                    WaterStorageType: "0",
                    SubsidySchemeId: this.data.SubsidySchemeId,
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
                    Remarks: this.isFarmerAcceptanceRemark,

                    // MicroIrrPlantOnWaterStorage: "0",
                    IrrigationTypeId: "0",
                    MicroIrrigationId: "0",
                    NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                    NotAcceptanceDocPathDateTime: this.noCaseDateOfImgLetter,
                    ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                    ImgFarmerWithOfficerDateTime: this.noCaseDateOfImgFarmer,
                };
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?", [this.data.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    temp.finalSubmission = noDataOffline;

                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
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
                                srvmethodnm: "AddDripIrrigationPostVerification",
                                srvparam: JSON.stringify({
                                    ApplicationId: self.data.ApplicationId,
                                    userid: self.httpClient.userData.userid,
                                    WaterStorageType: "0",
                                    SubsidySchemeId: self.data.SubsidySchemeId,
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
                                    Remarks: this.isFarmerAcceptanceRemark,
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



    // getHorticultureCouplerComponentList() {

    //     if (this.httpClient.isOffline) {
    //         this.getHorticultureCouplerComponentListData = this.data.getHorticultureCouplerComponentListData;
    //     }
    //     else {
    //     var self = this;
    //     var sendRequestData = {
    //         obj: {
    //             usrnm: "rajkisan",
    //             psw: "rajkisan@123",
    //             srvnm: "PostVerification",
    //             srvmethodnm: "GeHorticultureCouplerComponentList",
    //             srvparam: JSON.stringify({
    //                 HectareModel: this.data.HectareModel,
    //                 SpaceTypeId: this.data.SpaceTypeId,
    //                 SubsidySchemeId: this.data.SubsidySchemeId,
    //             }),
    //         },
    //     };
    //     console.log("GeHorticultureCouplerComponentList - ", sendRequestData);
    //     this.httpClient.post(sendRequestData).subscribe(
    //         function (res: any) {
    //             if (res[0].status == 0) {
    //                 console.log(" GeHorticultureCouplerComponentList res", res);
    //                 self.getHorticultureCouplerComponentListData = res[0].data;
    //             } else {
    //                 self.httpClient.showToast(res[0].message);
    //             }
    //         },
    //         (error) => {
    //             // self.httpClient.dismissLoading();
    //             // self.httpClient.showToast(self.httpClient.errorMessage);
    //             var errorRequestData = {
    //                 'obj': {
    //                     'usrnm': 'rajkisan',
    //                     'psw': 'rajkisan@123',
    //                     srvresponce: error,
    //                     userid: self.httpClient.userData.userid,
    //                     srvnm: "PostVerification",
    //                     srvmethodnm: "GeHorticultureCouplerComponentList",
    //                     srvparam: JSON.stringify({
    //                         HectareModel: self.data.HectareModel,
    //                         SpaceTypeId: self.data.SpaceTypeId,
    //                         SubsidySchemeId: self.data.SubsidySchemeId,
    //                     }),
    //                 }
    //             };
    //             console.log('errorRequestData new', errorRequestData);
    //             self.httpClient.getErrorMobileLogs(errorRequestData);
    //             self.httpClient.showToastError();
    //         }
    //     );
    // }
    // }

    takePhotoDirect() {
        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {
                // imageData is either a base64 encoded string or a file URI
                // If it's base64 (DATA_URL):
                // this.billDetails.BillImg = imageData;

                // Upload Bill Details
                this.httpClient.showLoading();
                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        AppName: "PVapp",
                        IsDirectUpload: "True",
                    },
                };
                console.log("options.params", options.params);
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?",
                        [this.data.ApplicationId]).then((res) => {
                            var temp = JSON.parse(res.rows.item(0).applicationData);
                            temp.imgOfConsentLetter = imageData;
                            temp.optionsOfimgOfConsentLetter = options;
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                                .then(() => {
                                    this.imgOfConsentLetter = imageData;
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
                                console.log("data", data);
                                this.httpClient.dismissLoading();
                                // success
                                var temp = JSON.parse(data.response);
                                this.imgOfConsentLetter = temp[0].data;
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

        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {
                this.httpClient.showLoading();
                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        id: this.postVerificationId,
                        AppName: "PVapp",
                        tableName: "FP_PostVerification",
                        columnName: columnName,
                        uniqueidcolumnname: "FP_PostVerificationId",
                        IsDirectUpload: "False",
                    },
                };
                console.log(options.params);
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?",
                        [this.data.ApplicationId]).then((res) => {
                            var temp = JSON.parse(res.rows.item(0).applicationData);
                            if (param == 0) {
                                temp.ImgFarmerWithOfficer = imageData;
                                temp.optionOfImgFarmerWithOfficer = options;
                            } else if (param == 1) {
                                temp.ImgFarmerWithOfficer2 = imageData;
                                temp.optionOfImgFarmerWithOfficer2 = options;
                            } else if (param == 2) {
                                temp.ImgDripBrandName1 = imageData;
                                temp.optionOfImgDripBrandName1 = options;
                            } else if (param == 3) {
                                temp.ImgDripBrandName2 = imageData;
                                temp.optionOfImgDripBrandName2 = options;
                            } else if (param == 4) {
                                temp.ImgWarrantyCard = imageData;
                                temp.optionOfImgWarrantyCard = options;
                            }
                            // else if (param == 5) {
                            //     temp.ImgTriPartyAgreement = imageData;
                            //     temp.optionOfImgTriPartyAgreement = options;
                            // }
                            else if (param == 6) {
                                temp.CompomnentTable = imageData;
                                temp.OptionOfCompomnentTable = options;
                            }
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                                .then(() => {
                                    if (param == 0) {
                                        this.ImgFarmerWithOfficer = imageData;
                                    } else if (param == 1) {
                                        this.ImgFarmerWithOfficer2 = imageData;
                                    } else if (param == 2) {
                                        this.ImgDripBrandName1 = imageData;
                                    } else if (param == 3) {
                                        this.ImgDripBrandName2 = imageData;
                                    } else if (param == 4) {
                                        this.ImgWarrantyCard = imageData;
                                    }
                                    // else if (param == 5) {
                                    //     this.ImgTriPartyAgreement = imageData;
                                    // }
                                    else if (param == 6) {
                                        this.CompomnentTable = imageData;
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
                                    if (param == 0) {
                                        this.ImgFarmerWithOfficer = temp[0].data;
                                    } else if (param == 1) {
                                        this.ImgFarmerWithOfficer2 = temp[0].data;
                                    } else if (param == 2) {
                                        this.ImgDripBrandName1 = temp[0].data;
                                    } else if (param == 3) {
                                        this.ImgDripBrandName2 = temp[0].data;
                                    } else if (param == 4) {
                                        this.ImgWarrantyCard = temp[0].data;
                                    }
                                    // else if (param == 5) {
                                    //     this.ImgTriPartyAgreement = temp[0].data;
                                    // }
                                    else if (param == 6) {
                                        this.CompomnentTable = temp[0].data;
                                    }
                                    //
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

        // self.camera.getPicture(cameraOptions).then(
        //   (imageData) => {
        //     console.log("test3");

        //     if (varName == "ImgSprinklerWithFarmer") {
        //       this.getLocForSprinklerWithFarmer();
        //       this.imgSprinklerWithFarmer = imageData;

        //       this.upLoadImages("1");
        //       // this.getLoc(varName);
        //     } else if (varName == "ImgSourceOfIrrigation") {
        //       console.log("varname--", varName);
        //       this.getLocForSourceOfIrrigation();
        //       // this.getLoc();
        //       this.imgSourceOfIrrigation = imageData;

        //       this.upLoadImages("2");

        //       // this.getLoc('sourceOfIrrigation');
        //     }
        //   },
        //   (err) => {
        //     // Handle error
        //   }
        // );
    }

    getLocForSprinklerWithFarmer() {
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                console.log(
                    " getting Sprinkler With Fatrmer location",
                    resp.coords.latitude + "-----" + resp.coords.longitude
                );
                this.sprinklerWithFarmerLatitude = resp.coords.latitude;
                this.sprinklerWithFarmerLongitude = resp.coords.longitude;
            })
            .catch((error) => {
                this.showPrompt("Error getting Source Of Irrigation location");
            });
    }

    getLocForSourceOfIrrigation() {
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                console.log(
                    " getting Source Of Irrigation location",
                    resp.coords.latitude + "-----" + resp.coords.longitude
                );
                this.sourceOfIrrigationLatitude = resp.coords.latitude;
                this.sourceOfIrrigationLongitude = resp.coords.longitude;
                console.log(
                    "sourceOfIrrigationLatitude " + this.sourceOfIrrigationLatitude
                );
                console.log(
                    "sourceOfIrrigationLongitude " + this.sourceOfIrrigationLongitude
                );
            })
            .catch((error) => {
                this.showPrompt("Error getting Source Of Irrigation location");
            });
    }

    // upLoadImages(flag) {
    //   var self = this;

    //   self.httpClient.showLoading();
    //   var sendRequestData = {
    //     obj: {
    //       usrnm: "rajkisan",
    //       psw: "rajkisan@123",
    //       srvnm: "PostVerification",
    //       srvmethodnm: "AddPostVerificationPhotos",
    //       srvparam: JSON.stringify({
    //         ApplicationId: this.data.ApplicationId,
    //         PostVerificationId: this.postVerificationId,
    //         userid: self.httpClient.userData.userid,
    //         SubsidySchemeId: this.data.SubsidyId,
    //         ImgFarmerWithOfficer: this.imgSprinklerWithFarmer,
    //         ImgSourceOfIrrigation: this.imgSourceOfIrrigation,
    //         ImgFarmerWithOfficerDateTime: this.imgSprinklerWithFarmeDateTime,
    //         ImgSourceOfIrriDateTime: this.imgSourceOfIrrigationDateTime,
    //         Flag: flag,
    //       }),
    //     },
    //   };

    //   console.log("sendRequestData", sendRequestData);
    //   this.httpClient.post(sendRequestData).subscribe(
    //     function (res: any) {
    //       self.httpClient.dismissLoading();
    //       if (res[0].status == 0) {
    //         console.log(res);
    //         self.httpClient.showToast(res[0].message);
    //         if (flag == "2") {
    //           var date2 = new Date();
    //           self.imgSourceOfIrrigationDateTime =
    //             date2.getFullYear() +
    //             "-" +
    //             (date2.getMonth() + 1) +
    //             "-" +
    //             date2.getDate() +
    //             " " +
    //             date2.getHours() +
    //             ":" +
    //             date2.getMinutes() +
    //             ":" +
    //             date2.getSeconds();
    //           console.log(
    //             "this.imgSourceOfIrrigationDateTime",
    //             self.imgSourceOfIrrigationDateTime
    //           );
    //           self.uploadPhotosClose = true;
    //         } else {
    //           var date = new Date();
    //           self.imgSprinklerWithFarmeDateTime =
    //             date.getFullYear() +
    //             "-" +
    //             (date.getMonth() + 1) +
    //             "-" +
    //             date.getDate() +
    //             " " +
    //             date.getHours() +
    //             ":" +
    //             date.getMinutes() +
    //             ":" +
    //             date.getSeconds();
    //           console.log(
    //             "this.imgFarmerAndOfficerDateTime",
    //             self.imgSprinklerWithFarmeDateTime
    //           );
    //         }
    //       } else {
    //         self.httpClient.showToast(res[0].message);
    //       }
    //     },
    //     (error) => {
    //       self.httpClient.dismissLoading();
    //       self.httpClient.showToastError();
    //     }
    //   );
    // }

    checkedCheck(i, isSelectedCheck) {
        for (var j = 0; j < this.ChecklistDetailList.length; j++) {
            if (
                this.ChecklistDetailList[j].ChecklistId ==
                this.getVerificationCheckData[i].Id
            ) {
                this.ChecklistDetailList.splice(j, 1);
            }
            this.getVerificationCheckData[i].isSelectedClose = false;
        }
        if (isSelectedCheck == false) {
            this.ChecklistDetailList.push({
                ChecklistId: this.getVerificationCheckData[i].Id,
                IsChecked: !isSelectedCheck,
                Remarks: "",
            });
            console.log(this.ChecklistDetailList);
        } else if (isSelectedCheck == true) {
            for (var l = 0; l < this.ChecklistDetailList.length; l++) {
                if (
                    this.ChecklistDetailList[l].ChecklistId ==
                    this.getVerificationCheckData[i].Id
                ) {
                    this.ChecklistDetailList.splice(l, 1);
                }
            }
            console.log(this.ChecklistDetailList);
        }

        this.getVerificationCheckData[i].isSelectedCheck = !this
            .getVerificationCheckData[i].isSelectedCheck;
        this.checkAvailSubsidy(i);

    }

    async checkedClose(i, isSelectedClose) {
        for (var j = 0; j < this.ChecklistDetailList.length; j++) {
            if (
                this.ChecklistDetailList[j].ChecklistId ==
                this.getVerificationCheckData[i].Id
            ) {
                this.ChecklistDetailList.splice(j, 1);
            }
            this.getVerificationCheckData[i].isSelectedCheck = false;
        }
        console.log("isSelectedClose", isSelectedClose);
        if (isSelectedClose == false) {
            const prompt = await this.alertCtrl.create({
                header: "Remarks",
                backdropDismiss: false,
                inputs: [
                    {
                        placeholder: "remarks",
                    },
                ],
                buttons: [
                    {
                        text: "Cancel",
                        handler: (data) => {
                            console.log("Cancel clicked");
                            this.getVerificationCheckData[i].isSelectedClose = false;
                            this.checkAvailSubsidy(i);

                        },
                    },
                    {
                        text: "Save",
                        handler: (data) => {
                            this.remarks = data[0];
                            console.log("Saved clicked", this.remarks);
                            console.log(this.ChecklistDetailList);
                            this.ChecklistDetailList.push({
                                ChecklistId: this.getVerificationCheckData[i].Id,
                                IsChecked: isSelectedClose,
                                Remarks: this.remarks,
                            });
                            this.checkAvailSubsidy(i);

                            console.log(this.ChecklistDetailList);
                        },
                    },
                ],
            });
            await prompt.present();
        } else if (isSelectedClose == true) {
            for (var k = 0; k < this.ChecklistDetailList.length; k++) {
                if (
                    this.ChecklistDetailList[k].ChecklistId ==
                    this.getVerificationCheckData[i].Id
                ) {
                    this.ChecklistDetailList.splice(k, 1);
                }
            }
            console.log(this.ChecklistDetailList);
        }

        this.getVerificationCheckData[i].isSelectedClose = !this
            .getVerificationCheckData[i].isSelectedClose;
    }

    checkAvailSubsidy(i){
        var temp=[];
        // temp=this.ChecklistDetailList.filter((x)=> x.ChecklistId == "54" || "86");
        temp=this.ChecklistDetailList.filter((x)=> x.ChecklistId == "54");
        if(temp.length>0){

            if(temp[0].IsChecked==true){
                // this.availSubsidyFlag=true;
                this.prevAvailedSubsidyArray=[];
                this.prevAvailedSubsidyArray.push({
                    ApplicationId: this.data.ApplicationId,
                    SubsidyId:"",
                    Year: "",
                    LandArea: "",
                    Amount: "",
                    ProofDoc: "",
                    IsDeductSubsidy:false,

                });
                console.log('prevAvailedSubsidyArray', this.prevAvailedSubsidyArray);
            }
            else {
                // this.availSubsidyFlag = false;
                this.prevAvailedSubsidyArray=[];

            }
        }
        else{
            // this.availSubsidyFlag = false;
            this.prevAvailedSubsidyArray=[];

        }
        console.log("this.ChecklistDetailList rv",this.ChecklistDetailList , i);

    }



    async addBill() {
        const modal = await this.modalController.create({
            component: HortiApplicationBillModelPage,
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
            this.totalAmountOfBill =
                this.totalAmountOfBill + parseInt(this.billArray[i].BillAmount);
        }
    }

    deleteBill(index) {
        if (this.httpClient.isOffline) {
            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?",
                [this.data.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    console.log("temp", temp);
                    temp.billDetails.splice(index, 1);
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                        .then(() => {
                            this.billArray.splice(index, 1);
                            this.calculateTheTotalBillAmount();
                        })
                        .catch((e) => {

                            console.log("error " + JSON.stringify(e));
                        });

                })
                .catch((e) => {
                    alert("error " + JSON.stringify(e));
                });
        }
        else {
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
                    self.httpClient.showToastError();
                }
            );
        }
    }

    uploadBillDetails(enteredBillDetails) {
        if (this.httpClient.isOffline) {
            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?",
                [this.data.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    if (!temp.billDetails) {
                        temp.billDetails = [];
                    }
                    console.log("temp", temp);
                    temp.billDetails.push(enteredBillDetails);
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                        .then(() => {
                            this.billArray.push({
                                BillNo: enteredBillDetails.BillNo,
                                BillAmount: enteredBillDetails.BillAmount,
                                BillImg: enteredBillDetails.BillImg,
                                displayImage: enteredBillDetails.displayImage
                            });
                            this.calculateTheTotalBillAmount();
                        })
                        .catch((e) => {

                            console.log("error " + JSON.stringify(e));
                        });

                })
                .catch((e) => {
                    alert("error " + JSON.stringify(e));
                });
        } else {
            var self = this;
            self.httpClient.showLoading();
            console.log("enteredBillDetails", enteredBillDetails);
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "AddPostVerificationBillOneByOne",
                    srvparam: JSON.stringify({
                        ApplicationId: this.data.ApplicationId,
                        PostVerificationId: this.postVerificationId,
                        userid: self.httpClient.userData.userid,
                        SubsidySchemeId: this.data.SubsidySchemeId,
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
                            AddStatus: res[0].data[0].AddStatus,
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
                                ApplicationId: self.data.ApplicationId,
                                PostVerificationId: self.postVerificationId,
                                userid: self.httpClient.userData.userid,
                                SubsidySchemeId: self.data.SubsidySchemeId,
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

    // upLoadBill() {
    //   var self = this;
    //   self.httpClient.showLoading();
    //   var sendRequestData = {
    //     obj: {
    //       usrnm: "rajkisan",
    //       psw: "rajkisan@123",
    //       srvnm: "PostVerification",
    //       srvmethodnm: "AddPostVerificationBill",
    //       srvparam: JSON.stringify({
    //         ApplicationId: this.data.HortiSubsidyApplicationId,
    //         PostVerificationId: this.postVerificationId,
    //         UserId: self.httpClient.userData.userid,
    //         RoleId: self.httpClient.userData.roleid,
    //         SubsidySchemeId: this.data.SubsidyId,
    //         BillDetailList: self.billArray,
    //       }),
    //     },
    //   };

    //   console.log("sendRequestData", sendRequestData);
    //   this.httpClient.post(sendRequestData).subscribe(
    //     function (res: any) {
    //       self.httpClient.dismissLoading();
    //       if (res[0].status == 0) {
    //         console.log(res);
    //         self.httpClient.showToast(res[0].message);
    //         self.uploadBillsClose = true;
    //         self.submitBtn = true;
    //         // self.billArray.push({
    //         //     BillNo: enteredBillDetails.BillNo,
    //         //     BillAmount: enteredBillDetails.BillAmount,
    //         //     BillImg: enteredBillDetails.BillImg,
    //         //     displayImage: enteredBillDetails.displayImage,
    //         //     AddStatus: res[0].data[0].AddStatus,
    //         // });
    //         // self.calculateTheTotalBillAmount();
    //       } else {
    //         self.httpClient.showToast(res[0].message);
    //       }
    //     },
    //     (error) => {
    //       self.httpClient.dismissLoading();
    //       self.httpClient.showToastError();
    //     }
    //   );
    // }

    submitFinalData() {
        var self = this;
        if (this.billArray.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल अपलोड करें ");
            } else {
                this.httpClient.showToast("Please upload bills");
            }
        } else if (this.ImgFarmerWithOfficer == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "अधिकारी और ड्रिप के साथ किसान की पहली तस्वीर।"
                );
            } else {
                this.httpClient.showToast(
                    "First picture of farmer with officer and drip."
                );
            }
        } else if (this.ImgFarmerWithOfficer2 == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Second picture of farmer with officer and drip."
                );
            } else {
                this.httpClient.showToast(
                    "अधिकारी और ड्रिप के साथ किसान की दूसरी तस्वीर।"
                );
            }
        } else if (this.ImgDripBrandName1 == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "First picture of drip with name of Brand Name/CML Number/ISI Mark/Batch No."
                );
            } else {
                this.httpClient.showToast(
                    "ब्रांड नाम / सीएमएल नंबर / आईएसआई मार्क / बैच नंबर के नाम के साथ ड्रिप की पहली तस्वीर।"
                );
            }
        } else if (this.ImgDripBrandName2 == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Second picture of drip with name of Brand Name/CML Number/ISI Mark/Batch No."
                );
            } else {
                this.httpClient.showToast(
                    "ब्रांड नाम / सीएमएल नंबर / आईएसआई मार्क / बैच नंबर के नाम के साथ ड्रिप की दूसरी तस्वीर।"
                );
            }
        } else if (this.ImgWarrantyCard == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast("Picture of warranty card");
            } else {
                this.httpClient.showToast("वारंटी कार्ड की तस्वीर।");
            }
        } else if (this.ImgTriPartyAgreement == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please upload Picture of Tri Party Agreement"
                );
            } else {
                this.httpClient.showToast("तीन पार्टी समझौता की तस्वीर अपलोड करें।");
            }
        }
        else if (this.CompomnentTable == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please upload Picture of Component Table"
                );
            } else {
                this.httpClient.showToast("घटक तालिक की तस्वीर अपलोड करें।");
            }
        }
        else {

            if (this.httpClient.isOffline) {
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?",
                    [this.data.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.finalSubmission = {
                            obj: {
                                usrnm: "rajkisan",
                                psw: "rajkisan@123",
                                srvnm: "PostVerification",
                                srvmethodnm: "FinalSubmissionPostVerification",
                                srvparam: JSON.stringify({
                                    ApplicationId: this.data.ApplicationId,
                                    UserId: self.httpClient.userData.userid,
                                    RoleId: self.httpClient.userData.roleid,
                                    SubsidySchemeId: this.data.SubsidySchemeId,
                                }),
                            },
                        };
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
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
            }
            else {
                self.httpClient.showLoading();
                var sendRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "FinalSubmissionPostVerification",
                        srvparam: JSON.stringify({
                            ApplicationId: this.data.ApplicationId,
                            UserId: self.httpClient.userData.userid,
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: this.data.SubsidySchemeId,
                        }),
                    },
                };

                console.log("sendRequestData", sendRequestData);
                this.httpClient.post(sendRequestData).subscribe(
                    function (res: any) {
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            console.log(res);
                            // self.httpClient.showToast(res[0].message);
                            self.successAlertFinalSubmission();
                            // self.billArray.push({
                            //     BillNo: enteredBillDetails.BillNo,
                            //     BillAmount: enteredBillDetails.BillAmount,
                            //     BillImg: enteredBillDetails.BillImg,
                            //     displayImage: enteredBillDetails.displayImage,
                            //     AddStatus: res[0].data[0].AddStatus,
                            // });
                            // self.calculateTheTotalBillAmount();
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
                                    ApplicationId: self.data.ApplicationId,
                                    UserId: self.httpClient.userData.userid,
                                    RoleId: self.httpClient.userData.roleid,
                                    SubsidySchemeId: self.data.SubsidySchemeId,
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
            const alert = await this.alertCtrl.create({
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
            const alert = await this.alertCtrl.create({
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



    getGetPVOptionalItemList() {
        if (this.httpClient.isOffline) {
            this.getPVOptionalItemListData = this.data.getPVOptionalItemListData;
        } else {
            var self = this;
            // self.httpClient.showLoading();
            var sendRequestData = {
                'obj': {
                    'usrnm': 'rajkisan',
                    'psw': 'rajkisan@123',
                    'srvnm': 'PostVerification',
                    'srvmethodnm': 'GetPVOptionalItemList',
                    'srvparam': '{}'
                }
            };
            console.log('GetPVOptionalItemList - ', sendRequestData);

            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log(' GetPVOptionalItemList res', res);
                    self.httpClient.dismissLoading();

                    if (res[0].status == 0) {
                        self.getPVOptionalItemListData = res[0].data;
                        console.log('getPVOptionalItemListData ---RS----', self.getPVOptionalItemListData);
                    } else {
                        self.showPrompt(res[0].data);
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
                            'srvnm': 'PostVerification',
                            'srvmethodnm': 'GetPVOptionalItemList',
                            'srvparam': '{}'
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
    }
    getCapacitySizeData(optionalItemNameValue) {
        console.log('optionalItemNameValue', optionalItemNameValue);
        this.capacitySizeDataValue = '';
        this.unitCost = '';
        var capacitySizeData = this.getPVOptionalItemListData.filter((x) => x.OptionalItemGroupId == optionalItemNameValue);
        console.log('capacitySizeData - ', capacitySizeData);
        this.capacitySizeData = capacitySizeData;
        // for(let i=0;i<capacitySizeData.length;i++) {
        //     this.capacitySizeData.push({
        //         HortiOptionalItemId: capacitySizeData[i].HortiOptionalItemId,
        //         CapacitySize:capacitySizeData[i].CapacitySize,
        //     });
        // }
    }

    getUnitCostValueData(HortiOptionalItemId) {

        console.log('capacitySizeDataValue', HortiOptionalItemId);
        var unitCostData = this.capacitySizeData.filter((x) => x.HortiOptionalItemId == HortiOptionalItemId);
        console.log('unitCostData - ', unitCostData);
        this.unitCost = unitCostData[0].UnitCost;


    }

    getOptionalArray() {
        var optionalItemNameValue;
        var capacitySizeDataValue;
        for (let i = 0; i < this.optionalItemName.length; i++) {
            if (this.optionalItemNameValue == this.optionalItemName[i].optionalItemId) {
                optionalItemNameValue = this.optionalItemName[i].optionalItemName
            }
        }

        for (let j = 0; j < this.capacitySizeData.length; j++) {
            if (this.capacitySizeDataValue == this.capacitySizeData[j].HortiOptionalItemId) {
                capacitySizeDataValue = this.capacitySizeData[j].CapacitySize
            }
        }

        this.optionalArray.push({
            optionalItemNameValue: optionalItemNameValue,
            HortiOptionalItemId: this.capacitySizeDataValue,
            capacitySizeDataValue: capacitySizeDataValue,
            unitCost: this.unitCost,
        });
        console.log('optionalArray', this.optionalArray);
    }

    deleteOptional(index) {
        this.optionalArray.splice(index, 1);
        console.log('this.optionalArray in deleteOptional', this.optionalArray);
    }


    test(ev,i) {
        console.log(ev.detail.value);
        this.prevAvailedSubsidyArray[i].Year = new Date(ev.detail.value).getFullYear().toString();
        console.log(this.prevAvailedSubsidyArray[i].Year);


    }
    getLand(i) {
        console.log('landArea', this.prevAvailedSubsidyArray[i].LandArea);
    }
    uploadDoc(i) {

        this.camera.getPicture(this.httpClient.options).then((imageData) => {

                let options: FileUploadOptions = {
                    fileKey: 'files',
                    params: {
                        AppName: 'capitalinvestment',
                        IsDirectUpload: 'True',
                    },
                };

                if (this.httpClient.isOffline) {
                    console.log('Image Offlibe Check',imageData);
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?",
                        [this.data.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.prevAvailedSubsidyArray = [];
                        this.prevAvailedSubsidyArray[i].ProofDoc = imageData;
                        temp.prevAvailedSubsidyArray = this.prevAvailedSubsidyArray ;
                        temp.OptionsOfProofDoc = options;

                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                            .then((res) => {
                                this.prevAvailedSubsidyArray[i].ProofDoc = imageData;

                                console.log('getRapidxImagesMasterData Index- Lat Long Check',);
                            })
                            .catch((e) => {
                                console.log("error " + JSON.stringify(e));
                            });

                    })
                        .catch((e) => {
                            alert('Error '+e);
                        });
                } else {
                    this.showProgressBar();

                    this.fileTransfer.onProgress((data) => {
                        this.ngZone.run(() => {
                            console.log('data.loaded - ', data.loaded);
                            console.log('data.total - ', data.total);

                            this.uploadPercent = Math.round(((data.loaded / data.total) * 100));
                            console.log('uploadPercent - ', this.uploadPercent);
                            this.setPercentBar(this.uploadPercent);
                        });
                    });

                    this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then((data) => {
                        this.httpClient.dismissLoading();


                        // success
                        var temp = JSON.parse(data.response);
                        console.log('temp[0].data', temp[0].data);
                        this.prevAvailedSubsidyArray[i].ProofDoc = temp[0].data;
                        console.log('oldDocImgUrl prevAvailedSubsidyArray[i].ProofDoc', this.prevAvailedSubsidyArray[i].ProofDoc);


                    }, (err) => {
                        // error

                        this.httpClient.dismissLoading();
                        console.log('err', err);
                    });
                }
            },
            (err) => {
                // Handle error
                console.log('log 3', err);
            }
        );

    }

    setPercentBar(i) {
        setTimeout(() => {
            let apc = (i / 100);
            console.log('apc- ', apc);
            this.p_bar_value = i;
            if (this.p_bar_value > 99) {
                this.hideProgressBar();
                this.p_bar_value = 0;
                this.uploadPercent = 0;
            }
        }, 100 * i);
    }

    showProgressBar() {
        this.showLoader = true;
    }

    hideProgressBar() {
        this.showLoader = false;
    }

    addRow() {
        console.log('prevAvailedSubsidyArray Before', this.prevAvailedSubsidyArray);

        this.prevAvailedSubsidyArray.push({
            ApplicationId: this.data.ApplicationId,
            SubsidyId:"",
            Year: "",
            LandArea: "",
            Amount: "",
            ProofDoc: "",
            IsDeductSubsidy:false,

        });
        console.log('prevAvailedSubsidyArray after', this.prevAvailedSubsidyArray);
    }

    deleteRow(index) {
        this.prevAvailedSubsidyArray.splice(index, 1);

    }
    pickImage(sourceType,param, columnName) {
        const options: CameraOptions = {
            quality: 20,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            saveToPhotoAlbum: false,
            targetWidth: 1500,
            targetHeight: 2000,
            sourceType:sourceType
        }
        console.log(options);

        this.camera.getPicture(options).then((imageData) => {// this.httpClient.showLoading();

                let optionsCam: FileUploadOptions = {
                    fileKey: 'files',
                    params: {
                        id: this.postVerificationId,
                        AppName: 'PVapp',
                        tableName: 'FP_PostVerification',
                        columnName: columnName,
                        uniqueidcolumnname: 'FP_PostVerificationId',
                        IsDirectUpload: 'False',
                    },
                };
                console.log(optionsCam.params);

                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?',
                        [this.data.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);

                        temp.ImgTriPartyAgreement = imageData;
                        temp.optionOfImgTriPartyAgreement = optionsCam;

                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfMicroSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                            .then(() => {
                                this.ImgTriPartyAgreement = imageData;
                            })
                            .catch((e) => {
                                console.log('error ' + JSON.stringify(e));
                            });

                    })
                        .catch((e) => {
                            alert('error ' + JSON.stringify(e));
                        });
                } else {
                    this.httpClient.showLoading();

                    this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, optionsCam).then((data) => {
                        this.httpClient.dismissLoading();
                        var temp = JSON.parse(data.response);
                        console.log('temp[0].data', temp[0].data);
                        if (temp[0].data[0].URL) {
                            this.ImgTriPartyAgreement = temp[0].data;
                        } else {
                            this.httpClient.showToastError();
                        }


                    }, (err) => {

                        this.httpClient.dismissLoading();
                        console.log('err', err);
                    });
                }
            },
            (err) => {
                console.log('log 3', err);
            }
        );
    }

    async selectImage(param, columnName) {
        if(this.httpClient.currentLanguage=='hindi')
        {
            const actionSheet = await this.actionSheetController.create({
                header: "छवि स्रोत का चयन करें",
                buttons: [{
                    text: 'गैलरी का प्रयोग करें',
                    handler: () => {
                        this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY,param, columnName);
                    }
                },
                    {
                        text: 'कैमरा का प्रयोग करें',
                        handler: () => {
                            this.pickImage(this.camera.PictureSourceType.CAMERA,param, columnName);
                        }
                    },
                    {
                        text: 'रद्द करें',
                        role: 'cancel'
                    }
                ]
            });
            await actionSheet.present();
        }else{
            const actionSheet = await this.actionSheetController.create({
                header: "Select Image source",
                buttons: [{
                    text: 'Use Gallery',
                    handler: () => {
                        this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY,param, columnName);
                    }
                },
                    {
                        text: 'Use Camera',
                        handler: () => {
                            this.pickImage(this.camera.PictureSourceType.CAMERA,param, columnName);
                        }
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel'
                    }
                ]
            });
            await actionSheet.present();
        }
    }
}
