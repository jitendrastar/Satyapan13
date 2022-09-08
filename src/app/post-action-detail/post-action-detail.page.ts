import { Component, NgZone, OnInit, ɵConsole } from "@angular/core";
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    NavController,
    ModalController,
    Platform
} from "@ionic/angular";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { ActivatedRoute } from "@angular/router";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { CommonService } from "../services/common.service";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Geolocation, GeolocationOptions } from "@ionic-native/geolocation/ngx";
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

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
    selector: "app-post-action-detail",
    templateUrl: "./post-action-detail.page.html",
    styleUrls: ["./post-action-detail.page.scss"],
})
export class PostActionDetailPage {
    // By Aniruddha
    jamabandiArray: any = [];
    nakshaTrace: any;
    segmentSelected = "work";
    farmerChoice: any = "yes";
    selectedUploadBills: any;
    dimensionsClose = false;
    photoUploadClose = true;
    postverificationID: any;
    farmerChoiceFlag = true;
    checkListClose = false;
    isSixMonthOld: any = 'no';

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
    mainDetailsSubmitFlag = false;
    selectedBisNo: any = 0;
    fileTransfer: any;
    listOfBIS: any = [];
    selectedThickness: any = 0;
    listOfSheetThickness: any = [];
    inRadius = false;
    options: GeolocationOptions = { maximumAge: 10, timeout: 20000, enableHighAccuracy: true };
    imgJamabandi: any;
    isRWSLIP: any;
    constructor(private photoViewer: PhotoViewer, private locationAccuracy: LocationAccuracy, private platform: Platform, private transfer: FileTransfer, private transferObject: FileTransferObject, private file: File, public dbService: DatabaseServiceService, private fileOpener: FileOpener, private downloader: Downloader, private sanitizer: DomSanitizer, public modalController: ModalController, public zone: NgZone, public navCtrl: NavController, public actionSheetController: ActionSheetController, public storage: Storage, public route: ActivatedRoute, public loadCtrl: LoadingController, public geolocation: Geolocation, public document: DocumentViewer, private camera: Camera, public httpClient: CommonService, public alertController: AlertController) {
        this.fileTransfer = this.transfer.create();
        this.getPreVerificationData = JSON.parse(this.route.snapshot.paramMap.get("obj"));
        this.imgJamabandi = this.getPreVerificationData.ImgJamabandi.split(",");
        // var distance = this.getDistanceFromLatLonInKm();
        // this.httpClient.dismissLoading();
        // if (distance > parseFloat(this.getPreVerificationData.RadiusMeter)) {
        //     this.showDistanceAlert();
        // }
        // else 

        this.inRadius = true;
        this.khashraNumber = this.getPreVerificationData.KhasraNo;

        if (this.httpClient.isOffline == true) {
            if (this.getPreVerificationData.sendRequestDataOffline) {
                this.farmerChoiceFlag = false;
                this.mainDetailsSubmitFlag = true;
                if (this.getPreVerificationData.jamabandiArray) {
                    this.isSixMonthOld = 'yes';
                    for (var d = 0; d < this.getPreVerificationData.jamabandiArray.length; d++) {
                        this.jamabandiArray.push({ status: 0, data: (<any>window).Ionic.WebView.convertFileSrc(this.getPreVerificationData.jamabandiArray[d].jamabandiImageDataap) });

                    }
                }

                if (this.getPreVerificationData.NakshaTrace != "") {
                    this.isSixMonthOld = 'yes';
                    this.nakshaTrace = this.getPreVerificationData.NakshaTrace;
                }
                if (this.getPreVerificationData.billDetails) {
                    this.billArray = this.getPreVerificationData.billDetails;
                }
                if (this.getPreVerificationData.photophotophotoFarmerWithOfficer) {
                    this.photoFarmerWithOfficer = this.getPreVerificationData.photophotophotoFarmerWithOfficer;
                }

                if (this.getPreVerificationData.photophotoKhasaraCertificate) {
                    this.photoKhasaraCertificate = this.getPreVerificationData.photophotoKhasaraCertificate;
                }

                if (this.getPreVerificationData.photoAffidavit) {
                    this.photoAffidavit = this.getPreVerificationData.photoAffidavit;
                }

            }

        } else {
            if (parseInt(this.getPreVerificationData.PostVerificationId) > 0) {
                this.mainDetailsSubmitFlag = true;
                this.farmerChoiceFlag = false;
                this.postverificationID = this.getPreVerificationData.PostVerificationId;
                if (this.getPreVerificationData.ImgFarmerWithOfficer != "" && this.getPreVerificationData.ImgFarmerWithOfficer != null) {
                    this.photoFarmerWithOfficer = this.getPreVerificationData.ImgFarmerWithOfficer;
                }
               
                if (this.getPreVerificationData.ImgPatwariApprovedCerti != "" && this.getPreVerificationData.ImgPatwariApprovedCerti != null) {
                    this.photoKhasaraCertificate = this.getPreVerificationData.ImgPatwariApprovedCerti;
                }
                if (this.getPreVerificationData.SecurityCertificate != "" && this.getPreVerificationData.SecurityCertificate != null) {
                    this.photoAffidavit = this.getPreVerificationData.SecurityCertificate;
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
        this.platform.ready().then(() => {
            this.locationAccuracy.canRequest().then((canRequest: boolean) => {

                // this.httpClient.showLoading();
                if (canRequest) {
                    // the accuracy option will be ignored by iOS
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
                        console.log('Request successful');
                        this.geolocation.getCurrentPosition(this.options).then((resp) => {
                            this.lat = resp.coords.latitude;
                            this.lng = resp.coords.longitude;
                            console.log('this.lat', this.lat);
                            console.log('this.lng', this.lng);

                            // }


                        }).catch((error) => {

                            this.httpClient.dismissLoading();
                            console.log('Error getting location', error);
                            // alert('Location is disable or permission is not allowed please allow or trun the location and try again!!');
                            // this.navCtrl.back();
                        });
                    },
                        (error) => {
                            this.httpClient.dismissLoading();
                            alert('Location is disable or permission is not allowed please allow or trun the location and try again!!');
                            this.navCtrl.back();
                        }
                        // error => 
                    )
                }

            });

        });


    }
    async showDistanceAlert() {
        if (this.httpClient.currentLanguage == "english") {
            const alert = await this.alertController.create({
                header: "Alert",
                subHeader: "You are not in radius " + this.getPreVerificationData.RadiusMeter + " meters from preverification of this place so you cannot perform this verification .",
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
                subHeader: "आप इस स्थान के पूर्व सत्यापन से" + this.getPreVerificationData.RadiusMeter + "मीटर के दायरे में नहीं हैं इसलिए आप यह सत्यापन नहीं कर सकते।",
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
    getDistanceFromLatLonInKm() {
        var lat1 = this.lat;
        var lon1 = this.lng;
        // var lat2 = parseFloat(this.getPreVerificationData.latitude);
        // var lon2 = parseFloat(this.getPreVerificationData.longitude);

        var lat2 = parseFloat(this.getPreVerificationData.latitude);
        var lon2 = parseFloat(this.getPreVerificationData.longitude);
        console.log('lat1', lat1);
        console.log('lon1', lon1);
        console.log('lat2', lat2);
        console.log('lon2', lon2);

        var R = 6371000; // Radius of the earth in m
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in m
        console.log("d", d);
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
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

    calculateTotalDimensionsOfFarmPond() {
        this.totalDimensionsOfFarmPond =
            this.lengthOfFarmPond * this.widthOfFarmPond * this.depthOfFarmPond;
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
            this.httpClient.dismissLoading();
            this.preVerificationChecklistData = this.getPreVerificationData.checklistData;
            console.log("this.getPreVerificationData.checklistData", this.getPreVerificationData.checklistData);
            console.log("this.preVerificationChecklistData", this.preVerificationChecklistData);
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

                    self.httpClient.dismissLoading();
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
            console.log(" this.billArray[index]", this.billArray[index]);
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

    takePhotoDirectUpload(param) {
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
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?",
                        [this.getPreVerificationData.ApplicationId]).then((res) => {
                            var temp = JSON.parse(res.rows.item(0).applicationData);
                            if (param == 5) {
                                temp.photoFarmerWithOfficerNoCase = imageData;
                                temp.optionsOfPhotoFarmerWithOfficerNoCase = options;
                            } else if (param == 4) {
                                temp.photoFarmerApprovalCertificate = imageData;
                                temp.optionsOfphotoFarmerApprovalCertificate = options;
                            }
                            console.log("temp", temp);

                            console.log("temp", temp);
                            let data = [JSON.stringify(temp)];
                            this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                    this.fileTransfer
                        .upload(imageData, this.httpClient.imageUploadUrl, options)
                        .then(
                            (data) => {
                                this.httpClient.dismissLoading();
                                // success
                                var temp = JSON.parse(data.response);
                                console.log("temp[0].data", temp[0].data);
                                if (temp[0].data) {
                                    if (param == 4) {
                                        this.photoFarmerApprovalCertificate = temp[0].data;
                                    } else if (param == 5) {
                                        this.photoFarmerWithOfficer = temp[0].data;
                                    }
                                } else {
                                    this.httpClient.showToastError();
                                    this.httpClient.dismissLoading();
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
                console.log("options", options.params);
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?",
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
                            this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                            }),
                        (err) => {
                            this.httpClient.dismissLoading();
                            console.log("err", err);
                        }
                    (err) => {
                        // Handle error
                    }
                }
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
        }

        else if (this.isSixMonthOld == 'yes' && this.jamabandiArray.length == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया जमाबंदी फोटो लें");
            } else {
                this.httpClient.showToast("Please take photo of Jamabandi");
            }
        }
        else if (this.isSixMonthOld == 'yes' && this.nakshaTrace == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया नक्शा ट्रेस फोटो लें "
                );
            } else {
                this.httpClient.showToast("Please take photo of Map Trace");
            }
        }
        else if (this.photoFarmerWithOfficer == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया कृषक व कार्मिक के साथ खेत तलाई फोटो लें "
                );
            } else {
                this.httpClient.showToast(
                    "Please take photo of Farmer and Officer With Farm Pond"
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
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.offlineFinalSubmission = offlineFinalSubmission;
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
        console.log("isRWSLIP", this.isRWSLIP=this.isRWSLIP?this.isRWSLIP:"");
        // console.log("BIS", this.selectedBisNo);
        // console.log("Thickness", this.selectedThickness);
        if (this.httpClient.latitude == null && this.httpClient.latitude == undefined && this.httpClient.latitude == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please enable the location for this application then submit"
                );
            }
        } else if (this.httpClient.longitude == null && this.httpClient.longitude == undefined && this.httpClient.longitude == "") {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया इस एप्लिकेशन के लिए लोकेशन  सक्षम करें फिर सबमिट करें"
                );
            } else {
                this.httpClient.showToast(
                    "Please enable the location for this application then submit"
                );
            }
        } else if (this.khashraNumber == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("निर्मित खेत तलाई का खसरा नंबर लिखें");
            } else {
                this.httpClient.showToast("Write the khasara number of made farm pond");
            }
        }
        else if (!this.isRWSLIP && this.getPreVerificationData.ISRWSLIP==1) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया खसरा नंबर RWSLIP योजना में है या नहीं का चयन करें !");
            } else {
                this.httpClient.showToast("Please select whether Khasra number is present in RWSLIP scheme !");
            }
        }
        else if (this.preVerificationChecklistData.length != this.createdChecklist.length) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया सभी चेकलिस्ट को पूर्ण करे");
            } else {
                this.httpClient.showToast("Please complete all checklists");
            }
        } else if (this.selectedUploadBills == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया खेत तलाई का प्रकार चुने");
            } else {
                this.httpClient.showToast("Please select Type of farm pond");
            }
        } else if (this.selectedUploadBills == "p" && this.selectedThickness == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया शीट की मोटाई का चयन करें।");
            } else {
                this.httpClient.showToast("Please select BIS no. or Sheet Thickness");
            }
        } else if (this.selectedUploadBills == "p" && this.selectedBisNo == 0) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया BIS नंबर का चयन करें।");
            } else {
                this.httpClient.showToast("Please select BIS no. or Sheet Thickness");
            }
        } else if (this.lengthOfFarmPond == 0 || this.lengthOfFarmPond == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया खेत तलाई की लंबाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the length of farm pond");
            }
        } else if (this.widthOfFarmPond == 0 || this.widthOfFarmPond == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया खेत तलाई की चौड़ाई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the width of farm pond");
            }
        } else if (this.depthOfFarmPond == 0 || this.depthOfFarmPond == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast("कृपया खेत तलाई की गहराई दर्ज करें");
            } else {
                this.httpClient.showToast("Please enter the depth of farm pond");
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
                    srvmethodnm: "AddPostVerificationDetail",
                    srvparam: JSON.stringify({
                        IsFarmerAcceptance: "Yes",
                        NotAcceptanceDocPath: "",
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        mobilToVerify: this.getPreVerificationData.mobilToVerify,
                        ConstructionType: this.selectedUploadBills,
                        FarmPondLength: this.lengthOfFarmPond,
                        FarmPondWidth: this.widthOfFarmPond,
                        FarmPondHeight: this.depthOfFarmPond,
                        FarmPondSize: this.totalDimensionsOfFarmPond,
                        PostVerificationKhasraNo: this.khashraNumber,
                        latitude: this.lat,
                        longitude: this.lng,
                        BISID: this.selectedBisNo,
                        ThickNessId: this.selectedThickness,
                        ChecklistDetailList: this.createdChecklist,
                        UserId: self.httpClient.userData.userid,
                        Step: "1",
                        RoleId: self.httpClient.userData.roleid,
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        NotAcceptanceDocPathDateTime: "",
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        isRWSLIP: self.isRWSLIP?self.isRWSLIP:"",
                    }),
                },
            };
            console.log("sendRequestData", sendRequestData);
            if (this.httpClient.isOffline == true) {
                var offlineYesSubmit = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "rajkisan@123",
                        srvnm: "PostVerification",
                        srvmethodnm: "AddPostVerificationDetail",
                        srvparam: JSON.stringify({
                            IsFarmerAcceptance: "Yes",
                            NotAcceptanceDocPath: "",
                            ApplicationId: this.getPreVerificationData.ApplicationId,
                            ConstructionType: this.selectedUploadBills,
                            FarmPondLength: this.lengthOfFarmPond,
                            FarmPondWidth: this.widthOfFarmPond,
                            FarmPondHeight: this.depthOfFarmPond,
                            FarmPondSize: this.totalDimensionsOfFarmPond,
                            PostVerificationKhasraNo: this.khashraNumber,
                            latitude: this.lat,
                            longitude: this.lng,
                            BISID: this.selectedBisNo,
                            ThickNessId: this.selectedThickness,
                            ChecklistDetailList: this.createdChecklist,
                            UserId: self.httpClient.userData.userid,
                            Step: "1",
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                            NotAcceptanceDocPathDateTime: "",
                            AppVersion: "V." + this.httpClient.currentAppVersion,
                            IsOnline_Offline: tempOfflineFlag,
                            isRWSLIP: self.isRWSLIP?self.isRWSLIP:"",

                        }),
                    },
                };
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.sendRequestDataOffline = offlineYesSubmit;
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
                                srvmethodnm: "AddPostVerificationDetail",
                                srvparam: JSON.stringify({
                                    IsFarmerAcceptance: "Yes",
                                    NotAcceptanceDocPath: "",
                                    ApplicationId: self.getPreVerificationData.ApplicationId,
                                    mobilToVerify: self.getPreVerificationData.mobilToVerify,
                                    ConstructionType: self.selectedUploadBills,
                                    FarmPondLength: self.lengthOfFarmPond,
                                    FarmPondWidth: self.widthOfFarmPond,
                                    FarmPondHeight: self.depthOfFarmPond,
                                    FarmPondSize: self.totalDimensionsOfFarmPond,
                                    PostVerificationKhasraNo: self.khashraNumber,
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    BISID: self.selectedBisNo,
                                    ThickNessId: self.selectedThickness,
                                    ChecklistDetailList: self.createdChecklist,
                                    UserId: self.httpClient.userData.userid,
                                    Step: "1",
                                    RoleId: self.httpClient.userData.roleid,
                                    SubsidySchemeId: self.getPreVerificationData.SubsidySchemeId,
                                    NotAcceptanceDocPathDateTime: "",
                                    AppVersion: "V." + self.httpClient.currentAppVersion,
                                    IsOnline_Offline: tempOfflineFlag,
                                    isRWSLIP: self.isRWSLIP?self.isRWSLIP:"",

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
            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);
                if (!temp.billDetails) {
                    temp.billDetails = [];
                }
                console.log("temp", temp);
                temp.billDetails.push(enteredBillDetails);
                console.log("temp", temp);
                let data = [JSON.stringify(temp)];
                this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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

    getExtensionJama(item) {
        window.open(item);
    }

    submitNoForm() {
        if (this.httpClient.latitude == null && this.httpClient.latitude == undefined && this.httpClient.latitude == "") {
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
        } else if (this.photoFarmerWithOfficer == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया कृषक व कार्मिक के साथ खेत तलाई फोटो लेंवे"
                );
            } else {
                this.httpClient.showToast(
                    "Please Upload the photo of Farmer and Officer With Farm Pond"
                );
            }
        } else if (this.photoFarmerApprovalCertificate == null) {
            if (this.httpClient.currentLanguage == "hindi") {
                this.httpClient.showToast(
                    "कृपया पटवारी द्वारा जारी खेत तलाई के खसरा का प्रमाण पत्र फोटो लेंवे"
                );
            } else {
                this.httpClient.showToast(
                    "Please Upload the photo of Khasara certificate of farm pond issued by patwari"
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
                    srvmethodnm: "AddPostVerificationDetail",
                    srvparam: JSON.stringify({
                        IsFarmerAcceptance: "No",
                        NotAcceptanceDocPathDateTime: this
                            .photoFarmerApprovalCertificateDateTime,
                        ImgFarmerWithOfficerDateTime: this.photoFarmerWithOfficerDateTime,
                        ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                        NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                        ApplicationId: this.getPreVerificationData.ApplicationId,
                        ConstructionType: "",
                        FarmPondLength: "0",
                        FarmPondWidth: "0",
                        FarmPondHeight: "0",
                        FarmPondSize: 0,
                        PostVerificationKhasraNo: "0",
                        ImgPatwariApprovedCerti: "",
                        SecurityCertificate: "",
                        latitude: this.lat,
                        longitude: this.lng,
                        UserId: self.httpClient.userData.userid,
                        Step: "1",
                        RoleId: self.httpClient.userData.roleid,
                        SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                        ImgPatwariApprovedCertiDateTime: "",
                        SecurityCertificateDateTime: "",
                        AppVersion: "V." + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        mobilToVerify: this.getPreVerificationData.mobilToVerify,
                    }),
                },
            };
            console.log("sendRequestData", sendRequestData);
            if (this.httpClient.isOffline == true) {
                var noDataOffline = {
                    IsFarmerAcceptance: "No",
                    NotAcceptanceDocPathDateTime: this
                        .photoFarmerApprovalCertificateDateTime,
                    ImgFarmerWithOfficerDateTime: this.photoFarmerWithOfficerDateTime,
                    ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                    NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                    ApplicationId: this.getPreVerificationData.ApplicationId,
                    ConstructionType: "",
                    FarmPondLength: "0",
                    FarmPondWidth: "0",
                    FarmPondHeight: "0",
                    FarmPondSize: 0,
                    PostVerificationKhasraNo: "0",
                    ImgPatwariApprovedCerti: "",
                    SecurityCertificate: "",
                    latitude: this.lat,
                    longitude: this.lng,
                    UserId: self.httpClient.userData.userid,
                    Step: "1",
                    RoleId: self.httpClient.userData.roleid,
                    SubsidySchemeId: this.getPreVerificationData.SubsidySchemeId,
                    ImgPatwariApprovedCertiDateTime: "",
                    SecurityCertificateDateTime: "",
                    AppVersion: "V." + this.httpClient.currentAppVersion,
                    IsOnline_Offline: tempOfflineFlag,
                    mobilToVerify: this.getPreVerificationData.mobilToVerify,
                }
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?",
                    [this.getPreVerificationData.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        temp.finalSubmission = noDataOffline;
                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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

                // self.successAlertFinalSubmission();
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

    BillSelection(selectedUploadBills) {
        console.log("selectedUploadBills--RS --", selectedUploadBills);
        if (selectedUploadBills == "p") {
            this.getBisList();
            this.getSheetThickness();
        } else {
            this.selectedThickness = 0;
            this.selectedBisNo = 0;
        }
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
                this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    console.log("temp", temp);
                    temp.NakshaTrace = { nakshaTraceImage: imageData, nakshaTraceOptions: options }
                    console.log("temp", temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data).then(() => {
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
                    this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
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
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
    viewPhoto(data, i) {
        if (!this.httpClient.isOffline) {
            this.photoViewer.show(data);
        }
        else {

        }

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
            this.dbService.storage.executeSql("SELECT * FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?", [this.getPreVerificationData.ApplicationId]).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);

                temp.jamabandiArray.splice(i, 1)
                console.log("temp", temp);
                let data = [JSON.stringify(temp)];
                this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfFarmpond SET applicationData = ? WHERE ApplicationId = ${this.getPreVerificationData.ApplicationId}`, data)
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
    // getExtensionJama(item){

    // }
    isRWSLIPOnChange(isRWSLIP) {
        if (isRWSLIP == 'Yes') {
            this.showAlert()
        }
    }

    async showAlert() {
        if (this.httpClient.currentLanguage == "hindi") {
            const toast = await this.alertController.create({
                header: "पुष्टीकरण !",
                message: "क्या आप सुनिश्चित हैं कि यह खसरा नंबर RWSLIP योजना में है?",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "हाँ",
                        handler: () => {
                        },
                    }, {
                        text: "नहीं",
                        handler: () => {
                            this.isRWSLIP = 'No';

                        },
                    },
                ],
            });
            toast.present();
        } else {
            const toast = await this.alertController.create({
                header: "Confirmation !",
                message: "Are you sure this khasra number exist in RWSLIP scheme?",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "Yes",
                        handler: () => {
                        },
                    }, {
                        text: "No",
                        handler: () => {
                            this.isRWSLIP = 'No';
                        },
                    },
                ],
            });
            toast.present();
        }
    }
}
