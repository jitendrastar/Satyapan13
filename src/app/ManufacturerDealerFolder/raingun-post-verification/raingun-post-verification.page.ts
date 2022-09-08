import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
    AlertController,
    ModalController,
    NavController,
} from "@ionic/angular";
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

@Component({
    selector: "app-raingun-post-verification",
    templateUrl: "./raingun-post-verification.page.html",
    styleUrls: ["./raingun-post-verification.page.scss"],
})
export class RaingunPostVerificationPage {
    remarks: any = "";

    data: any;
    hortiCouplerSize: any;
    GetHortiCouplerSizelistData: any = [];
    hortiHectareModelRange: any;
    getGetHortiHectareModelRangelistData: any = [];
    getCouplerSizeHectareModelAmount: any;


    getHorticultureManufactureData: any = [];
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
    billandPhotoFlag = false;
    fileTransfer: any;
    remarkFlag = false;
    selectedRemark: any;

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
        private storage: Storage,
        public httpClient: CommonService
    ) {
        this.fileTransfer = this.transfer.create();
        this.data = JSON.parse(this.route.snapshot.paramMap.get("data"));
        console.log("coming Data", this.data);
        console.log("coming HectareModel", this.data.HectareModel);
        console.log("coming pipesize", this.data.PipeSize);

        this.brandData = JSON.parse(this.route.snapshot.paramMap.get("brandData"));
        console.log("coming brandData", this.brandData);
        this.getVerificationChecklistData(this.data.ApplicationId);
        this.getHorticultureManufactureListData();
        // this.getHorticultureCouplerComponentList();
        // this.getHorticultureCouplerComponentList(
        //   this.data.HectareModel,
        //   this.data.PipeId
        // );
        if (parseInt(this.data.PostVerificationId) > 0) {
            this.basicDataSubmitFlag = false;
            this.billandPhotoFlag = true;
            this.postVerificationId = this.data.PostVerificationId;
            if (this.data.ImgFarmerWithOfficer != "") {
                this.imgSprinklerWithFarmeDateTime = new Date();
            }
            if (this.data.ImgSourceOfIrrigation != "") {
                this.imgSourceOfIrrigationDateTime = new Date();
            }

            this.getBills();
        }
        this.getHorticultureCouplerComponentList();
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
                self.httpClient.dismissLoading();
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
        console.log("ionViewWillEnter AaoVerificationPage");
        this.getLoc();
    }

    getVerificationChecklistData(hortiSubsidyApplicationId) {
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

    getHorticultureManufactureListData() {
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
                var errorRequestData = {
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "PostVerification",
                        srvmethodnm: "GetHorticultureManufactureList",
                        srvparam: "{}",
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getHorticultureManufactureDealerList(manufacturerId, protoTypeId) {
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

    // checkedClose(i, isSelectedClose) {
    //   console.log(i);
    //   console.log(isSelectedClose);
    //   for (var j = 0; j < this.getVerificationCheckData.length; i++) {
    //     if(this.getVerificationCheckData[i].isSelectedClose==isSelectedClose){
    //       this.getVerificationCheckData[i].isSelectedClose=true;
    //     }
    //   }
    // }
    //
    // checkedCheck(i, isSelectedCheck) {
    //   console.log(i);
    //   console.log(isSelectedCheck);
    // }

    getMenuPrototype(ev) {
        // console.log(ev);
        for (let i = 0; i < this.getHorticultureManufactureData.length; i++) {
            if (
                this.getHorticultureManufactureData[i].Agri_HortiManufacturerId == ev
            ) {
                var manufacturerId = this.getHorticultureManufactureData[i]
                    .Agri_HortiManufacturerId;
                var protoTypeId = this.getHorticultureManufactureData[i].ProductType;
                console.log(manufacturerId);
                console.log(protoTypeId);
                this.brandValue = this.getHorticultureManufactureData[i].Brand;
                this.getHorticultureManufactureDealerList(manufacturerId, '1');
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
        // var test = this.getHorticultureCouplerComponentListData.filter(
        //     (x) => x.BatchNo == ""
        // );
        // var test2 = this.getHorticultureCouplerComponentListData.filter(
        //     (x) => x.CML_NoID == ""
        // );
        // var test3 = this.getHorticultureCouplerComponentListData.filter(
        //     (x) => x.ISI_MarkID == "0"
        // );
        // var test4 = this.getHorticultureCouplerComponentListData.filter(
        //     (x) => x.InstalledQty == "0"
        // );
        // var test4 = this.getHorticultureCouplerComponentListData.filter(
        //     (x) => x.EstimatedQty == "0"
        // );

        console.log(
            "getHorticultureCouplerComponentListData",
            this.getHorticultureCouplerComponentListData
        );
        var self = this;
        if (this.manufacturerValue == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया निर्माता का चयन करें");
            } else {
                this.httpClient.showToast("Please select the manufacturer");
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
        } else if (
            this.getVerificationCheckData.length != self.ChecklistDetailList.length
        ) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया चेकलिस्ट को पूरा करें");
            } else {
                this.httpClient.showToast("Please complete the checklist");
            }
        }
        //  else if (
        //     test.length > 0 ||
        //     test2.length > 0 ||
        //     test3.length > 0 ||
        //     test4.length > 0
        // ) {
        //     if (this.httpClient.currentLanguage == "hindi") {
        //         this.httpClient.showToast("कृपया घटक तालिका को पूरा करें");
        //     } else {
        //         this.httpClient.showToast("Please complete the component table");
        //     }
        // } 
        else {
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "AddSprinklerPostVerification",
                    srvparam: JSON.stringify({
                        IsFarmerAcceptance: "Yes",
                        ApplicationId: this.data.ApplicationId,
                        SubsidySchemeId: self.data.SubsidySchemeId,
                        mobilToVerify: "",
                        latitude: self.latitude,
                        longitude: self.longitude,
                        ChecklistDetailList: self.ChecklistDetailList,
                        SprinklerComponentinfo:
                            self.getHorticultureCouplerComponentListData,
                        UserId: self.httpClient.userData.userid,
                        RoleId: self.httpClient.userData.roleid,
                        AppVersion: self.httpClient.currentAppVersion,
                        Step: "1",
                        IsOnline_Offline: "1",
                        BrandId: this.manufacturerValue,
                        dealerid: this.dealerValue,
                        manufactureid: this.manufacturerValue,

                        HectareModelId: self.hortiHectareModelRange,
                        CouplerSizeId: self.hortiCouplerSize,
                    }),
                },
            };
            console.log("AddSprinklerPostVerification - ", sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function (res: any) {
                    console.log(" AddSprinklerPostVerification res", res);
                    self.httpClient.dismissLoading();
                    if (res[0].status == 0) {
                        
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
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: "PostVerification",
                            srvmethodnm: "AddSprinklerPostVerification",
                            srvparam: JSON.stringify({
                                IsFarmerAcceptance: "Yes",
                                ApplicationId: self.data.ApplicationId,
                                SubsidySchemeId: self.data.SubsidySchemeId,
                                mobilToVerify: "",
                                latitude: self.latitude,
                                longitude: self.longitude,
                                ChecklistDetailList: self.ChecklistDetailList,
                                SprinklerComponentinfo:
                                    self.getHorticultureCouplerComponentListData,
                                UserId: self.httpClient.userData.userid,
                                RoleId: self.httpClient.userData.roleid,
                                AppVersion: self.httpClient.currentAppVersion,
                                Step: "1",
                                IsOnline_Offline: "1",
                                BrandId: self.manufacturerValue,
                                dealerid: self.dealerValue,
                                manufactureid: self.manufacturerValue,
                                HectareModelId: self.hortiHectareModelRange,
                                CouplerSizeId: self.hortiCouplerSize,
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

    getHorticultureCouplerComponentList() {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "rajkisan@123",
                srvnm: "PostVerification",
                srvmethodnm: "GeHorticultureCouplerComponentList",
                srvparam: JSON.stringify({
                    HectareModel: this.data.HectareModel,
                    PipeSize: this.data.PipeId,
                    SubsidySchemeId: this.data.SubsidySchemeId,
                }),
            },
        };
        console.log("GeHorticultureCouplerComponentList - ", sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                if (res[0].status == 0) {
                    console.log(" GeHorticultureCouplerComponentList res", res);
                    self.getHorticultureCouplerComponentListData = res[0].data;
                } else {
                    self.httpClient.showToast(res[0].message);
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
                        srvmethodnm: "GeHorticultureCouplerComponentList",
                        srvparam: JSON.stringify({
                            HectareModel: self.data.HectareModel,
                            PipeSize: self.data.PipeId,
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

    selectImage(param, columnName) {
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

                this.fileTransfer
                    .upload(imageData, this.httpClient.imageUploadUrl, options)
                    .then(
                        (data) => {
                            this.httpClient.dismissLoading();
                            // success
                            var temp = JSON.parse(data.response);
                            console.log("temp[0].data", temp[0].data);
                            if (param == 2) {
                                this.imgSourceOfIrrigationDateTime = temp[0].data;
                            } else if (param == 1) {
                                this.imgSprinklerWithFarmeDateTime = temp[0].data;
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

    uploadBillDetails(enteredBillDetails) {
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
                        })
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    

    submitFinalData() {
        var self = this;
        if (this.billArray.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया बिल अपलोड करें ");
            } else {
                this.httpClient.showToast("Please upload bills");
            }
        } else if (this.imgSprinklerWithFarmeDateTime == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया किसान के साथ स्प्रिंकलर की तस्वीर लें "
                );
            } else {
                this.httpClient.showToast(
                    "Please take  Picture of sprinkler with farmer"
                );
            }
        } else if (this.imgSourceOfIrrigationDateTime == null) {
            if (this.httpClient.currentLanguage == "english") {
                this.httpClient.showToast(
                    "Please take  Picture of source of irrigation"
                );
            } else {
                this.httpClient.showToast("सिंचाई के स्रोत की तस्वीर लें ");
            }
        } else {
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
                            })
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
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

    validateInstalledQty(index) {
        if (
            this.getHorticultureCouplerComponentListData[index].InstalledQty != "0"
        ) {
            if (
                parseInt(
                    this.getHorticultureCouplerComponentListData[index].InstalledQty
                ) <
                parseInt(
                    this.getHorticultureCouplerComponentListData[index].StandardQuantity
                )
            ) {
                this.remarkFlag = true;
            }
        }
    }

    getCouplerSizeHectareModelAmountData(HectareModelId, CouplerSizeId) {
        console.log('HectareModelId,CouplerSizeId', HectareModelId, CouplerSizeId);
        if (HectareModelId != undefined && CouplerSizeId != undefined) {

            var self = this;
            self.httpClient.showLoadingImage();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'GetCouplerSizeHectareModelAmount',
                    srvparam: JSON.stringify({
                        HectareModelId: HectareModelId,
                        CouplerSizeId: CouplerSizeId,
                        SubsidySchemeId: self.data.SubsidySchemeId,
                    }),

                },
            };
            console.log('GetCouplerSizeHectareModelAmount - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(function(res: any) {
                    console.log(' GetCouplerSizeHectareModelAmount res', res);
                    self.httpClient.dismissLoadingImage();

                    if (res[0].status == 0) {
                        self.getCouplerSizeHectareModelAmount = res[0].data[0].Amount;
                        console.log(self.getCouplerSizeHectareModelAmount, parseInt(self.getCouplerSizeHectareModelAmount));
                        if (parseInt(self.getCouplerSizeHectareModelAmount) <= 0) {
                            if(self.httpClient.currentLanguage=='english')
                            {
                                self.showPrompt('Coupler Amount Should not be 0');
                            }else{
                                self.showPrompt('कपलर राशि 0 नहीं होनी चाहिए');

                            }
                        }
                    } else {
                        self.showPrompt(res[0].message);
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
                            srvnm: 'PostVerification',
                            srvmethodnm: 'GetHortiHectareModelRangelist',
                            srvparam: '{}',
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
