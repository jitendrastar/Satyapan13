import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {
    AlertController,
    NavController,
    Platform,
    ModalController,
} from '@ionic/angular';
import {CommonService} from '../../services/common.service';
import {Storage} from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {DatabaseServiceService} from '../../services/database-service.service';
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {UploadImagesPage} from '../upload-images/upload-images.page';
import {File} from '@ionic-native/file/ngx';

import {FileOpener} from '@ionic-native/file-opener/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {Downloader, DownloadRequest, NotificationVisibility} from '@ionic-native/downloader/ngx';

@Component({
    selector: 'app-application-verification',
    templateUrl: './application-verification.page.html',
    styleUrls: ['./application-verification.page.scss'],
})
export class ApplicationVerificationPage implements OnInit {
    ssp: any = [];
    straight: any = [];
    npk: any = [];
    revertListData: any = [];
    checkList: any = [];
    createdChecklist: any = [];
    createdVChecklist: any = [];
    createdChecklistSSP: any = [];
    createdChecklistStraight: any = [];
    createdChecklistNPK: any = [];
    upcomingData: any;
    siteMap: any;
    isRevertButton: any;
    docId: any;
    isInputBox: any;
    Heading: any;
    menufType: any;
    fileTransfer: FileTransferObject;
    preVerificationChecklistData: any = [];
    tempData: any = [];

    checkListClose = true;
    isSelectedCloseDoc: any = false;
    isSelectedCheckDoc: any = false;
    revertBtnFlag: any = false;
    docRemark: any;

    toggleCheckList() {
        this.checkListClose = !this.checkListClose;
    }

    constructor(
        private camera: Camera,
        private transfer: FileTransfer,
        public dbServices: DatabaseServiceService,
        public navCtrl: NavController,
        public router: Router,
        public route: ActivatedRoute,
        public alertCtrl: AlertController,
        public httpClient: CommonService,  private downloader: Downloader,

        public storage: Storage,
        public platform: Platform,
        public file: File,
        private fileOpener: FileOpener,
        public modalController: ModalController,
        public androidPermissions: AndroidPermissions,
        public geolocation: Geolocation,
        public locationAccuracy: LocationAccuracy    ) {
        this.fileTransfer = this.transfer.create();
        this.upcomingData = JSON.parse(this.route.snapshot.paramMap.get('data'));
        console.log('this.upcomingData applicatio verification page rs', this.upcomingData);
        // this.upcomingData.LicenseSubMasterId='3';
        // console.log("this.upcomingData LicenseSubMasterId", this.upcomingData.LicenseSubMasterId);
this.menufType='ssp';
        this.VerificationChecklist();
        this.checkGPSPermission();
    }

    ionViewWillEnter() {
        var self = this;
        this.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PreVerification',
                srvmethodnm: 'LicensePreVerificationData',
                srvparam: JSON.stringify({
                    ApplicationId: this.upcomingData.Applicationid,
                    AppType: this.upcomingData.ApplicationType,
                }),
            },
        };
        self.httpClient.post(sendRequestData).subscribe(
            function(temp) {
                var res: any = temp[0];
                console.log('res', res);
                self.httpClient.dismissLoading();
                if (res.status == 0) {
                    self.checkList = res.data;
                    self.siteMap = res.data[0].SiteMap;
                    self.isRevertButton = res.data[0].IsRevertButton;
                    self.docId = res.data[0].DocumentId;
                    for (var i = 0; i < self.checkList.length; i++) {
                        self.checkList[i].isSelectedClose = false;
                        self.checkList[i].isSelectedCheck = false;
                        self.checkList[i].IsRevert = false;
                        self.revertListData.push({
                            LicenseAddressId: self.checkList[i].LicenseAddressId,
                            AddressType: self.checkList[i].AddressType,
                            IsChecked: false,
                            Remarks: '',
                            PVFilePath: '',
                            PVFilePathInner: '',
                            Latitude: self.httpClient.latitude,
                            Longitude: self.httpClient.longitude,
                            IsRevert: self.checkList[i].IsRevert = false
                        });
                    }
                } else {
                    self.httpClient.showToast(res.message);
                }
            },
            (error) => {
                var errorRequestData = {
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: 'PreVerification',
                        srvmethodnm: 'LicensePreVerificationData',
                        srvparam: JSON.stringify({
                            ApplicationId: self.upcomingData.Applicationid,
                            AppType: this.upcomingData.ApplicationType,

                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();             }
        );
    }

    async checkedClose(index, currentFlag) {
        if (!currentFlag) {
            var headerTitleOfAlert;
            var placeholderOfAlert;
            var okButtonText;
            var cancelButtonText;
            if (this.httpClient.currentLanguage == 'english') {
                // headerTitleOfAlert = "Remark";
                headerTitleOfAlert = 'Enter Remark if the Information provided is Not correct';
                placeholderOfAlert = 'Enter Remark';
                okButtonText = 'Submit';
                cancelButtonText = 'Cancel';
            } else {
                // headerTitleOfAlert = "टिप्पणी";
                headerTitleOfAlert = 'प्रदत्त सूचना सही नहीं होने पर विवरण अंकित करें ।';
                placeholderOfAlert = 'टिप्पणी दर्ज करें';
                okButtonText = 'जमा करे';
                cancelButtonText = 'रद्द करे';
            }
            const alert = await this.alertCtrl.create({
                header: headerTitleOfAlert,
                inputs: [
                    {
                        name: 'remark',
                        type: 'text',
                        placeholder: placeholderOfAlert,
                    },
                ],
                buttons: [
                    {
                        text: cancelButtonText,
                        role: 'cancel',
                        handler: () => {
                            console.log('Confirm Cancel');
                        },
                    },
                    {
                        text: okButtonText,
                        handler: (data) => {
                            if (data.remark) {
                                for (var i = 0; i < this.createdChecklist.length; i++) {
                                    if (
                                        this.checkList[index].LicenseAddressId ==
                                        this.createdChecklist[i].LicenseAddressId
                                    ) {
                                        this.createdChecklist.splice(i, 1);
                                        this.checkList[index].isSelectedCheck = false;
                                    }
                                }

                                this.checkList[index].IsRevert = true;

                                this.createdChecklist.push({
                                    LicenseAddressId: this.checkList[index].LicenseAddressId,
                                    AddressType: this.checkList[index].AddressType,
                                    IsChecked: false,
                                    Remarks: data.remark,
                                    PVFilePath: '',
                                    PVFilePathInner: '',
                                    Latitude: this.httpClient.latitude,
                                    Longitude: this.httpClient.longitude,
                                    IsRevert: this.checkList[index].IsRevert,
                                });
                                this.checkList[index].isSelectedClose = true;
                                // this.revertListData.push({
                                //     LicenseAddressId: this.checkList[index].LicenseAddressId,
                                //     AddressType: this.checkList[index].AddressType,
                                //     IsChecked: false,
                                //     Remarks: data.remark,
                                //     PVFilePath: '',
                                //     PVFilePathInner: '',
                                //     Latitude: this.httpClient.latitude,
                                //     Longitude: this.httpClient.longitude,
                                //     IsRevert: this.checkList[index].IsRevert,
                                // });
                                console.log('this.createdChecklist', this.createdChecklist);
                                this.revertBtnDisableEnable();
                                console.log('revert Btn Enable');
                            } else {
                                this.httpClient.showToast('Please enter the remark');
                            }
                        },
                    },
                ],
            });

            await alert.present();
        } else {
            for (var i = 0; i < this.createdChecklist.length; i++) {
                if (
                    this.checkList[index].ApplicationId ==
                    this.createdChecklist[i].ApplicationId
                ) {
                    console.log('in check');
                    this.createdChecklist.splice(i, 1);
                    this.checkList[index].isSelectedClose = false;
                    console.log('this.createdChecklist', this.createdChecklist);

                }
                this.checkList[index].IsRevert = false;
                this.revertBtnDisableEnable();


            }
        }
        console.log('this.createdChecklist', this.createdChecklist);
    }

    revertBtnDisableEnable(){
        if(this.createdChecklist.length>0)
        {

            for (var i = 0; i < this.createdChecklist.length; i++) {
                var temp=[]
                temp = this.createdChecklist.filter((x) => x.IsRevert == true );

                if(temp.length > 0 && this.isRevertButton=='1')
                {
                    this.revertBtnFlag=true;
                }
            }
        }else{
            this.revertBtnFlag=false;

        }
    }

    async checkedCheck(index, currentFLag) {
        if (!currentFLag) {
            for (var i = 0; i < this.createdChecklist.length; i++) {
                if (
                    this.checkList[index].LicenseAddressId ==
                    this.createdChecklist[i].LicenseAddressId
                ) {
                    this.createdChecklist.splice(i, 1);
                    this.checkList[index].isSelectedClose = false;
                    this.checkList[index].IsRevert = false;

                    this.revertBtnDisableEnable();

                }
            }
            const modal = await this.modalController.create({
                component: UploadImagesPage,
                cssClass: 'my-UploadImages',
                backdropDismiss: false,
                componentProps: {
                    licenseId: this.checkList[i].LicenseAddressId,
                    AppType: this.upcomingData.ApplicationType,

                },
                //
            });
            modal.onDidDismiss().then((data) => {
                // this.httpClient.showLoading();
                this.geolocation.getCurrentPosition().then((resp) => {
                    this.httpClient.latitude = resp.coords.latitude;
                    this.httpClient.longitude = resp.coords.longitude;

                    if (data.data != null && this.httpClient.latitude!='') {
                        console.log('data.data', data.data);
                        this.httpClient.dismissLoading();

                        this.createdChecklist.push({
                            LicenseAddressId: this.checkList[index].LicenseAddressId,
                            AddressType: this.checkList[index].AddressType,
                            ApplicationId: this.checkList[index].ApplicationId,
                            IsChecked: true,
                            Remarks: '',
                            PVFilePath: data.data.outerPhoto,
                            PVFilePathInner: data.data.innerPhoto,
                            Latitude: this.httpClient.latitude,
                            Longitude: this.httpClient.longitude,
                            IsRevert: this.checkList[index].IsRevert,

                        });
                        this.revertBtnDisableEnable();

                        this.checkList[index].isSelectedCheck = true;
                    }else
                        {
                            // this.httpClient.showToast('Please Enable Location!!!');
                            this.httpClient.dismissLoading();

                        }
                })
                    .catch((error) => {
                        console.log('Error getting location', error);
                        this.httpClient.showToast('Please Enable Location!!!');
                        this.httpClient.dismissLoading();

                    });

            });
            return await modal.present();
            // const options: CameraOptions = {
        }
        else {
            for (var i = 0; i < this.createdChecklist.length; i++) {
                if (
                    this.checkList[index].LicenseAddressId ==
                    this.createdChecklist[i].LicenseAddressId
                ) {
                    this.createdChecklist.splice(i, 1);
                    this.checkList[index].isSelectedCheck = false;
                }
            }
        }
        console.log('this.createdChecklist', this.createdChecklist);
    }
    async showSubmitAlert() {
        if (this.httpClient.currentLanguage == "hindi") {
            const toast = await this.alertCtrl.create({
                header: "पुष्टीकरण!",
                message: "क्या आप भौतिक सत्यापन विभाग को अग्रेषित करना चाहते हैं ?",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "रद्द करें",
                        role: "cancel",
                        handler: () => {
                            console.log("Cancel submit");
                        },
                    }, {
                        text: "ठीक है",
                        handler: () => {
                            console.log("ok submit");
                            this.submit();

                        },
                    },
                ],
            });
            toast.present();
        } else {
            const toast = await this.alertCtrl.create({
                header: "Confirmation !",
                message: "Do you want to forward the Physical Verification to Department ?.",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel",
                        handler: () => {
                            console.log("Cancel submit");
                        },
                    }, {
                        text: "Ok",
                        handler: () => {
                            console.log("Ok submit");
                            this.submit();
                        },
                    },
                ],
            });
            toast.present();
        }
    }

    submit() {
        this.tempData = [];
        console.log('this.isSelectedCheckDoc',this.isSelectedCheckDoc);
        console.log('this.isSelectedCloseDoc',this.isSelectedCloseDoc);
        // if (this.isSelectedCloseDoc != true && this.isSelectedCheckDoc != true) {
        //     this.httpClient.showToast('Please Check Site Map / Blue Print Status.');
        // } else
            if (this.createdChecklist.length == 0) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast(
                    'सूची में से एक पते को सत्यापित करना आवयश्क है। '
                );
            } else {
                this.httpClient.showToast(
                    'It is necessary to verify an address from the list.'
                );
            }
        } else {
            var docIsChecked;
            if (this.isSelectedCloseDoc == true) {
                docIsChecked = false;
            } else {
                docIsChecked = true;
            }
            // this.geolocation.getCurrentPosition().then((resp) => {
            //     this.httpClient.latitude = resp.coords.latitude;
            //     this.httpClient.longitude = resp.coords.longitude;
                for (let i = 0; i < this.createdVChecklist.length; i++) {
                    this.tempData.push({
                        'ChecklistId': this.createdVChecklist[i].ChecklistId,
                        'IsChecked': this.createdVChecklist[i].IsChecked,
                        'Remarks': this.createdVChecklist[i].Remarks,
                        'InputValue': '',
                        IsInputBox: 0

                    });
                }
                for (let j = 0; j < this.preVerificationChecklistData.length; j++) {
                    if (this.preVerificationChecklistData[j].IsInputBox == 1) {
                        this.tempData.push({
                            'ChecklistId': this.preVerificationChecklistData[j].Id,
                            'IsChecked': 'false',
                            'Remarks': '',
                            'InputValue': this.preVerificationChecklistData[j].inputField,
                            IsInputBox: this.preVerificationChecklistData[j].IsInputBox
                        });
                    }

                }
                var test = this.tempData.filter((x) => x.InputValue == '' && x.IsInputBox == 0); // checklist
                var test2 = this.tempData.filter((x) => x.InputValue == '' && x.IsInputBox == 1); // input
                var test3 = this.preVerificationChecklistData.filter((x) => x.IsInputBox != 1);
                console.log('tempData', this.tempData);
                console.log('this.preVerificationChecklistData', this.preVerificationChecklistData);

                console.log('this.tempData', this.tempData);
                console.log('test', test);
                console.log('test2', test2);
                console.log('test3', test3);
                if (test2.length > 0) {
                    this.httpClient.showToast('Please Enter All Fields');

                } else
                if (test.length != test3.length) {
                    this.httpClient.showToast('Please Check All Fields');

                } else {

                         console.log('test', test.length);
                        console.log('this.tempData-> ', this.tempData);
                        var self = this;
                    self.httpClient.showLoading();

                    var sendRequestData = {
                            obj: {
                                usrnm: 'rajkisan',
                                psw: 'rajkisan@123',
                                srvnm: 'PreVerification',
                                srvmethodnm: 'AddLicensePVData',
                                srvparam: JSON.stringify({
                                    roleid: self.httpClient.userData.roleid,
                                    userid: self.httpClient.userData.userid,
                                    ApplicationId: this.checkList[0].ApplicationId,
                                    DocumentId: this.docId?this.docId:'0',
                                    DocRemark: this.docRemark,
                                    DocIsChecked: docIsChecked,
                                    LicenseAddressList: this.createdChecklist,
                                    ChecklistDetailList: this.tempData,
                                    AppType: this.upcomingData.ApplicationType,

                                }),
                            },
                        };
                        console.log('sendRequestData -> ', JSON.stringify(sendRequestData));

                        self.httpClient.post(sendRequestData).subscribe(
                            function(temp) {
                                var res: any = temp[0];
                                console.log('res', res);
                                self.httpClient.dismissLoading();
                                if (res.status == 0) {
                                    self.confirmPVLicenseFinal();
                                } else {
                                    self.httpClient.showToast(res.message);
                                }
                            },
                            (error) => {
                                var errorRequestData = {
                                    'obj': {
                                        'usrnm': 'rajkisan',
                                        'psw': 'rajkisan@123',
                                        srvresponce: error,
                                        userid: self.httpClient.userData.userid,
                                        srvnm: 'PreVerification',
                                        srvmethodnm: 'AddLicensePVData',
                                        srvparam: JSON.stringify({
                                            roleid: self.httpClient.userData.roleid,
                                            userid: self.httpClient.userData.userid,
                                            ApplicationId: self.checkList[0].ApplicationId,
                                            DocumentId: self.docId?self.docId:'0',
                                            DocRemark: self.docRemark,
                                            DocIsChecked: docIsChecked,
                                            LicenseAddressList: self.createdChecklist,
                                            ChecklistDetailList: self.tempData,
                                            AppType: this.upcomingData.ApplicationType,

                                        }),
                                    }
                                };
                                console.log('errorRequestData new', errorRequestData);
                                self.httpClient.getErrorMobileLogs(errorRequestData);
                                self.httpClient.showToastError();                              }
                        );

                }
            // }).catch((error) => {
            //     console.log('Error getting location', error);
            //     this.httpClient.showToast('Please Enable Location!!!');
            //
            // });








        }


    }
    submitManufacturer() {
        this.tempData = [];
        // if (this.isSelectedCloseDoc != true && this.isSelectedCheckDoc != true) {
        //     this.httpClient.showToast('Please Check Site Map / Blue Print Status.');
        // } else
            if (this.createdChecklist.length == 0) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast(
                    'सूची में से एक पते को सत्यापित करना आवयश्क है। '
                );
            } else {
                this.httpClient.showToast(
                    'It is necessary to verify an address from the list.'
                );
            }
        } else {
            var docIsChecked;
            if (this.isSelectedCloseDoc == true) {
                docIsChecked = false;
            } else {
                docIsChecked = true;
            }
            // this.geolocation.getCurrentPosition().then((resp) => {
            //     this.httpClient.latitude = resp.coords.latitude;
            //     this.httpClient.longitude = resp.coords.longitude;

                if(this.menufType=='ssp')
                {
                    for (let j = 0; j < this.ssp.length; j++) {
                        if (this.ssp[j].IsInputBox == 1) {
                            this.tempData.push({
                                'ChecklistId': this.ssp[j].Id,
                                'IsChecked': 'false',
                                'Remarks': '',
                                'InputValue': this.ssp[j].inputField,
                                IsInputBox: this.ssp[j].IsInputBox
                            });
                        }

                    }

                    for (let i = 0; i < this.createdChecklistSSP.length; i++) {
                        this.tempData.push({
                            'ChecklistId': this.createdChecklistSSP[i].ChecklistId,
                            'IsChecked': this.createdChecklistSSP[i].IsChecked,
                            'Remarks': this.createdChecklistSSP[i].Remarks,
                            'InputValue': '',
                            IsInputBox: 0

                        });
                    }
                }
                else if(this.menufType=='straight')

                {
                    for (let j = 0; j < this.straight.length; j++) {
                        if (this.straight[j].IsInputBox == 1) {
                            this.tempData.push({
                                'ChecklistId': this.straight[j].Id,
                                'IsChecked': 'false',
                                'Remarks': '',
                                'InputValue': this.straight[j].inputField,
                                IsInputBox: this.straight[j].IsInputBox
                            });
                        }

                    }
                    for (let i = 0; i < this.createdChecklistStraight.length; i++) {
                        this.tempData.push({
                            'ChecklistId': this.createdChecklistStraight[i].ChecklistId,
                            'IsChecked': this.createdChecklistStraight[i].IsChecked,
                            'Remarks': this.createdChecklistStraight[i].Remarks,
                            'InputValue': '',
                            IsInputBox: 0

                        });
                    }
                }
                else if(this.menufType=='npk')

                {
                    for (let j = 0; j < this.npk.length; j++) {
                        if (this.npk[j].IsInputBox == 1) {
                            this.tempData.push({
                                'ChecklistId': this.npk[j].Id,
                                'IsChecked': 'false',
                                'Remarks': '',
                                'InputValue': this.npk[j].inputField,
                                IsInputBox: this.npk[j].IsInputBox
                            });
                        }

                    }
                    for (let i = 0; i < this.createdChecklistNPK.length; i++) {
                        this.tempData.push({
                            'ChecklistId': this.createdChecklistNPK[i].ChecklistId,
                            'IsChecked': this.createdChecklistNPK[i].IsChecked,
                            'Remarks': this.createdChecklistNPK[i].Remarks,
                            'InputValue': '',
                            IsInputBox: 0

                        });
                    }
                }

                var test = this.tempData.filter((x) => x.InputValue == '' && x.IsInputBox == 0); // checklist
                var test2 = this.tempData.filter((x) => x.InputValue == '' && x.IsInputBox == 1); // input
            if(this.menufType=='ssp')
            {
                var test3 = this.ssp.filter((x) => x.IsInputBox != 1);
            }
            else if(this.menufType=='straight')
            {
                var test3 = this.straight.filter((x) => x.IsInputBox != 1);
            }
            else if(this.menufType=='npk')
            {
                var test3 = this.npk.filter((x) => x.IsInputBox != 1);
            }

                console.log('this.tempData', this.tempData);
                console.log('test', test);
                console.log('test2', test2);
                console.log('test3', test3);
                if (test2.length > 0) {
                    this.httpClient.showToast('Please Enter All Fields');

                } else
                if (test.length != test3.length) {
                    this.httpClient.showToast('Please Check All Fields');

                }
                else {
                         console.log('test', test.length);
                        console.log('this.tempData-> ', this.tempData);
                        var self = this;
                    self.httpClient.showLoading();

                    var sendRequestData = {
                            obj: {
                                usrnm: 'rajkisan',
                                psw: 'rajkisan@123',
                                srvnm: 'PreVerification',
                                srvmethodnm: 'AddLicensePVData',
                                srvparam: JSON.stringify({
                                    roleid: self.httpClient.userData.roleid,
                                    userid: self.httpClient.userData.userid,
                                    ApplicationId: this.checkList[0].ApplicationId,
                                    DocumentId: this.docId?this.docId:'0',
                                    DocRemark: this.docRemark,
                                    DocIsChecked: docIsChecked,
                                    LicenseAddressList: this.createdChecklist,
                                    ChecklistDetailList: this.tempData,
                                    AppType: this.upcomingData.ApplicationType,

                                }),
                            },
                        };
                        console.log('sendRequestData -> ', JSON.stringify(sendRequestData));

                        self.httpClient.post(sendRequestData).subscribe(
                            function(temp) {
                                var res: any = temp[0];
                                console.log('res', res);
                                self.httpClient.dismissLoading();
                                if (res.status == 0) {
                                    self.confirmPVLicenseFinal();
                                } else {
                                    self.httpClient.showToast(res.message);
                                }
                            },
                            (error) => {
                                var errorRequestData = {
                                    'obj': {
                                        'usrnm': 'rajkisan',
                                        'psw': 'rajkisan@123',
                                        srvresponce: error,
                                        userid: self.httpClient.userData.userid,
                                        srvnm: 'PreVerification',
                                        srvmethodnm: 'AddLicensePVData',
                                        srvparam: JSON.stringify({
                                            roleid: self.httpClient.userData.roleid,
                                            userid: self.httpClient.userData.userid,
                                            ApplicationId: self.checkList[0].ApplicationId,
                                            DocumentId: self.docId?self.docId:'0',
                                            DocRemark: self.docRemark,
                                            DocIsChecked: docIsChecked,
                                            LicenseAddressList: self.createdChecklist,
                                            ChecklistDetailList: self.tempData,
                                            AppType: this.upcomingData.ApplicationType,

                                        }),
                                    }
                                };
                                console.log('errorRequestData new', errorRequestData);
                                self.httpClient.getErrorMobileLogs(errorRequestData);
                                self.httpClient.showToastError();                              }
                        );

                }
                }
            // }).catch((error) => {
            //     console.log('Error getting location', error);
            //     this.httpClient.showToast('Please Enable Location!!!');
            //
            // });








        // }


    }

    // }
    async successAlertFinalSubmission() {
        if (this.httpClient.currentLanguage == 'english') {
            const alert = await this.alertCtrl.create({
                header: 'Alert',
                subHeader: 'Successfully Submitted.',
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'Okay',
                        handler: () => {
                            this.navCtrl.pop();
                        },
                    },
                ],
            });

            await alert.present();
        } else {
            const alert = await this.alertCtrl.create({
                header: 'Alert',
                subHeader: 'सफलतापूर्वक जमा किया गया | ',
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'ओके ',
                        handler: () => {
                            this.navCtrl.pop();
                        },
                    },
                ],
            });

            await alert.present();
        }
    }

    ngOnInit() {
    }

    VerificationChecklist() {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'i75Q7Q6nYgW3rgEitGndNA==',
                srvnm: 'PreVerification',
                srvmethodnm: 'GetChecklistLicense',
                srvparam: JSON.stringify({
                    ApplicationId: this.upcomingData.Applicationid,
                    AppType: this.upcomingData.ApplicationType,
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    self.preVerificationChecklistData = res[0].data;
                    // self.isInputBox = res[0].data[0].IsInputBox;
                    self.Heading = res[0].data[0].Heading;
                    console.log('Heading', self.Heading);


                    self.ssp = self.preVerificationChecklistData.filter((x) => x.TypeEquipment == 'SSP Plants');
                    for (var j = 0; j < self.ssp.length; j++) {
                        self.ssp[j].isSelectedClose = false;
                        self.ssp[j].isSelectedCheck = false;
                        self.ssp[j].inputField = '';
                    }
                    self.straight = self.preVerificationChecklistData.filter((x) => x.TypeEquipment == 'Micronutrient Fertilizer (Straight)');
                    self.npk = self.preVerificationChecklistData.filter((x) => x.TypeEquipment == 'Mixtures of  Micronutrient (Without NPK)');
                    console.log('ssp', self.ssp);
                    // console.log("sspInput",sspInput);
                    // console.log("sspCheckList",sspCheckList);
                    console.log('straight', self.straight);
                    console.log('npk', self.npk);

                    for (var i = 0; i < self.preVerificationChecklistData.length; i++) {
                        self.preVerificationChecklistData[i].isSelectedClose = false;
                        self.preVerificationChecklistData[i].isSelectedCheck = false;
                        self.preVerificationChecklistData[i].inputField = '';
                    }
                    console.log('preVerificationChecklistData', self.preVerificationChecklistData);

                } else {
                    // self.httpClient.showToast(res[0].data);
                    console.log('res checklist', res[0].data);

                }
                // self.httpClient.(res[0].message);
                // self.httpClient.dismissLoading();
            },
            (error) => {
                // self.httpClient.dismissLoading();
                self.httpClient.showToastError();
            }
        );
    }

    openPDF(item) {

        this.httpClient.showLoading();

        var fileName = item;
         var extension = fileName.split(".").pop();

         if(extension=== "jpg" || extension===  "png"|| extension===  "jpeg")
         {
             console.log(extension, extension === "jpg", "png");
             window.open(fileName, "_system");
             this.httpClient.dismissLoading();

         }else{

        var request: DownloadRequest = {
            uri: item,
            title: 'MyDownload',
            description: '',
            mimeType: '',
            visibleInDownloadsUi: true,
            notificationVisibility: NotificationVisibility.VisibleNotifyCompleted,
            destinationInExternalFilesDir: {
                dirType: 'Downloads',
                subPath: 'MyFile.pdf'
            }
        };
        console.log('test1');
        this.downloader.download(request)
            .then((location: string) => {
                console.log('location', location);
                this.httpClient.dismissLoading();
                this.fileOpener.open(location, 'application/pdf');
            })
            .catch((error: any) => {
                this.httpClient.dismissLoading();
                console.error(error);
            });

       /* var URL = encodeURI(item);
        console.log('item', URL);
        this.httpClient.showLoading();
        let filePath = this.file.dataDirectory + 'public/assets/';
        this.fileTransfer.download(URL, filePath).then((entry) => {
            console.log('download complete: ' + entry.toURL());
            this.httpClient.dismissLoading();
            let pdfURL = entry.toURL();
            this.fileOpener.open(pdfURL, 'application/pdf');
         }, (error) => {

            this.httpClient.dismissLoading();
            console.log('error ' + JSON.stringify(error));
         }); */
    }
    }


    async checkedVClose(index, currentFlag) {
        if (!currentFlag) {
            var headerTitleOfAlert;
            var placeholderOfAlert;
            var okButtonText;
            var cancelButtonText;
            if (this.httpClient.currentLanguage == 'english') {
                headerTitleOfAlert = 'Remark';
                placeholderOfAlert = 'Enter Remark';
                okButtonText = 'Submit';
                cancelButtonText = 'Cancel';
            } else {
                headerTitleOfAlert = 'टिप्पणी';
                placeholderOfAlert = 'टिप्पणी दर्ज करें';
                okButtonText = 'जमा करे';
                cancelButtonText = 'रद्द करे';
            }
            const alert = await this.alertCtrl.create({
                header: headerTitleOfAlert,
                inputs: [
                    {
                        name: 'remark',
                        type: 'text',
                        placeholder: placeholderOfAlert,
                    },
                ],
                buttons: [
                    {
                        text: cancelButtonText,
                        role: 'cancel',
                        handler: () => {
                            console.log('Confirm Cancel');
                        },
                    },
                    {
                        text: okButtonText,
                        handler: (data) => {
                            if (data.remark) {
                                console.log(
                                    'this.createdChecklist.length',
                                    this.createdVChecklist.length
                                );
                                for (var i = 0; i < this.createdVChecklist.length; i++) {
                                    if (
                                        this.preVerificationChecklistData[index].Id ==
                                        this.createdVChecklist[i].ChecklistId
                                    ) {
                                        this.createdVChecklist.splice(i, 1);
                                        this.preVerificationChecklistData[
                                            index
                                            ].isSelectedCheck = false;
                                    }
                                }
                                this.createdVChecklist.push({
                                    ChecklistId: this.preVerificationChecklistData[index].Id,
                                    IsChecked: false,
                                    Remarks: data.remark,
                                });
                                this.preVerificationChecklistData[index].isSelectedClose = true;
                                console.log('createdVChecklist', this.createdVChecklist);
                            } else {
                                this.httpClient.showToast('Please enter the remark');
                            }

                        },
                    },
                ],
            });

            await alert.present();
        } else {
            for (var i = 0; i < this.createdVChecklist.length; i++) {
                if (
                    this.preVerificationChecklistData[index].Id ==
                    this.createdVChecklist[i].ChecklistId
                ) {
                    console.log('in check');
                    this.createdVChecklist.splice(i, 1);
                    this.preVerificationChecklistData[index].isSelectedClose = false;
                    console.log('this.createdVChecklist', this.createdVChecklist);
                }
            }
        }
        console.log('this.createdVChecklist', this.createdVChecklist);
    }
    checkedVCheck(index, currentFLag) {
        if (!currentFLag) {
            for (var i = 0; i < this.createdVChecklist.length; i++) {
                if (
                    this.preVerificationChecklistData[index].Id ==
                    this.createdVChecklist[i].ChecklistId
                ) {
                    this.createdVChecklist.splice(i, 1);
                    this.preVerificationChecklistData[index].isSelectedClose = false;
                }
            }

            this.createdVChecklist.push({
                ChecklistId: this.preVerificationChecklistData[index].Id,
                IsChecked: true,
                Remarks: '',
            });
            this.preVerificationChecklistData[index].isSelectedCheck = true;
            console.log('this.createdVChecklist', this.createdVChecklist);
        } else {
            for (var i = 0; i < this.createdVChecklist.length; i++) {
                if (
                    this.preVerificationChecklistData[index].Id ==
                    this.createdVChecklist[i].ChecklistId
                ) {
                    console.log('in check');
                    this.createdVChecklist.splice(i, 1);
                    this.preVerificationChecklistData[index].isSelectedCheck = false;
                    console.log('this.createdVChecklist', this.createdVChecklist);
                }
            }
        }
    }

    async checkedCloseSSP(index, currentFlag) {
        if (!currentFlag) {
            var headerTitleOfAlert;
            var placeholderOfAlert;
            var okButtonText;
            var cancelButtonText;
            if (this.httpClient.currentLanguage == 'english') {
                headerTitleOfAlert = 'Remark';
                placeholderOfAlert = 'Enter Remark';
                okButtonText = 'Submit';
                cancelButtonText = 'Cancel';
            } else {
                headerTitleOfAlert = 'टिप्पणी';
                placeholderOfAlert = 'टिप्पणी दर्ज करें';
                okButtonText = 'जमा करे';
                cancelButtonText = 'रद्द करे';
            }
            const alert = await this.alertCtrl.create({
                header: headerTitleOfAlert,
                inputs: [
                    {
                        name: 'remark',
                        type: 'text',
                        placeholder: placeholderOfAlert,
                    },
                ],
                buttons: [
                    {
                        text: cancelButtonText,
                        role: 'cancel',
                        handler: () => {
                            console.log('Confirm Cancel');
                        },
                    },
                    {
                        text: okButtonText,
                        handler: (data) => {
                            if (data.remark) {
                                console.log(
                                    'this.createdChecklistSSP.length',
                                    this.createdChecklistSSP.length
                                );
                                for (var i = 0; i < this.createdChecklistSSP.length; i++) {
                                    if (
                                        this.ssp[index].Id ==
                                        this.createdChecklistSSP[i].ChecklistId
                                    ) {
                                        this.createdChecklistSSP.splice(i, 1);
                                        this.ssp[
                                            index
                                            ].isSelectedCheck = false;
                                    }
                                }
                                this.createdChecklistSSP.push({
                                    ChecklistId: this.ssp[index].Id,
                                    IsChecked: false,
                                    Remarks: data.remark,
                                });
                                this.ssp[index].isSelectedClose = true;
                                console.log('createdChecklistSSP', this.createdChecklistSSP);
                            } else {
                                this.httpClient.showToast('Please enter the remark');
                            }

                        },
                    },
                ],
            });

            await alert.present();
        } else {
            for (var i = 0; i < this.createdChecklistSSP.length; i++) {
                if (
                    this.ssp[index].Id ==
                    this.createdChecklistSSP[i].ChecklistId
                ) {
                    console.log('in check');
                    this.createdChecklistSSP.splice(i, 1);
                    this.createdChecklistSSP[index].isSelectedClose = false;
                    console.log('this.createdVChecklist', this.createdChecklistSSP);
                }
            }
        }
        console.log('this.createdChecklistSSP', this.createdChecklistSSP);
    }
    checkedVCheckSSP(index, currentFLag) {
        if (!currentFLag) {
            for (var i = 0; i < this.createdChecklistSSP.length; i++) {
                if (
                    this.ssp[index].Id ==
                    this.createdChecklistSSP[i].ChecklistId
                ) {
                    this.createdChecklistSSP.splice(i, 1);
                    this.ssp[index].isSelectedClose = false;
                }
            }

            this.createdChecklistSSP.push({
                ChecklistId: this.ssp[index].Id,
                IsChecked: true,
                Remarks: '',
            });
            this.ssp[index].isSelectedCheck = true;
            console.log('this.createdVChecklist', this.createdChecklistSSP);
        } else {
            for (var i = 0; i < this.createdChecklistSSP.length; i++) {
                if (
                    this.ssp[index].Id ==
                    this.createdChecklistSSP[i].ChecklistId
                ) {
                    console.log('in check');
                    this.createdChecklistSSP.splice(i, 1);
                    this.ssp[index].isSelectedCheck = false;
                    console.log('this.createdVChecklist', this.createdChecklistSSP);
                }
            }
        }
    }

    async checkedVCloseStraight(index, currentFlag) {
        if (!currentFlag) {
            var headerTitleOfAlert;
            var placeholderOfAlert;
            var okButtonText;
            var cancelButtonText;
            if (this.httpClient.currentLanguage == 'english') {
                headerTitleOfAlert = 'Remark';
                placeholderOfAlert = 'Enter Remark';
                okButtonText = 'Submit';
                cancelButtonText = 'Cancel';
            } else {
                headerTitleOfAlert = 'टिप्पणी';
                placeholderOfAlert = 'टिप्पणी दर्ज करें';
                okButtonText = 'जमा करे';
                cancelButtonText = 'रद्द करे';
            }
            const alert = await this.alertCtrl.create({
                header: headerTitleOfAlert,
                inputs: [
                    {
                        name: 'remark',
                        type: 'text',
                        placeholder: placeholderOfAlert,
                    },
                ],
                buttons: [
                    {
                        text: cancelButtonText,
                        role: 'cancel',
                        handler: () => {
                            console.log('Confirm Cancel');
                        },
                    },
                    {
                        text: okButtonText,
                        handler: (data) => {
                            if (data.remark) {
                                console.log(
                                    'this.createdChecklistStraight.length',
                                    this.createdChecklistStraight.length
                                );
                                for (var i = 0; i < this.createdChecklistStraight.length; i++) {
                                    if (
                                        this.straight[index].Id ==
                                        this.createdChecklistStraight[i].ChecklistId
                                    ) {
                                        this.createdChecklistStraight.splice(i, 1);
                                        this.straight[
                                            index
                                            ].isSelectedCheck = false;
                                    }
                                }
                                this.createdChecklistStraight.push({
                                    ChecklistId: this.straight[index].Id,
                                    IsChecked: false,
                                    Remarks: data.remark,
                                });
                                this.straight[index].isSelectedClose = true;
                                console.log('createdChecklistStraight', this.createdChecklistStraight);
                            } else {
                                this.httpClient.showToast('Please enter the remark');
                            }

                        },
                    },
                ],
            });

            await alert.present();
        } else {
            for (var i = 0; i < this.createdChecklistStraight.length; i++) {
                if (
                    this.straight[index].Id ==
                    this.createdChecklistStraight[i].ChecklistId
                ) {
                    console.log('in check');
                    this.createdChecklistStraight.splice(i, 1);
                    this.straight[index].isSelectedClose = false;
                    console.log('this.createdChecklistStraight', this.createdChecklistStraight);
                }
            }
        }
        console.log('this.createdChecklistStraight', this.createdChecklistStraight);
    }
    checkedVCheckStraight(index, currentFLag) {
        if (!currentFLag) {
            for (var i = 0; i < this.createdChecklistStraight.length; i++) {
                if (
                    this.straight[index].Id ==
                    this.createdChecklistStraight[i].ChecklistId
                ) {
                    this.createdChecklistStraight.splice(i, 1);
                    this.straight[index].isSelectedClose = false;
                }
            }

            this.createdChecklistStraight.push({
                ChecklistId: this.straight[index].Id,
                IsChecked: true,
                Remarks: '',
            });
            this.straight[index].isSelectedCheck = true;
            console.log('this.createdChecklistStraight', this.createdChecklistStraight);
        } else {
            for (var i = 0; i < this.createdChecklistStraight.length; i++) {
                if (
                    this.straight[index].Id ==
                    this.createdChecklistStraight[i].ChecklistId
                ) {
                    console.log('in check');
                    this.createdChecklistStraight.splice(i, 1);
                    this.straight[index].isSelectedCheck = false;
                    console.log('this.createdChecklistStraight', this.createdChecklistStraight);
                }
            }
        }
    }

    async checkedVCloseNPK(index, currentFlag) {
        if (!currentFlag) {
            var headerTitleOfAlert;
            var placeholderOfAlert;
            var okButtonText;
            var cancelButtonText;
            if (this.httpClient.currentLanguage == 'english') {
                headerTitleOfAlert = 'Remark';
                placeholderOfAlert = 'Enter Remark';
                okButtonText = 'Submit';
                cancelButtonText = 'Cancel';
            } else {
                headerTitleOfAlert = 'टिप्पणी';
                placeholderOfAlert = 'टिप्पणी दर्ज करें';
                okButtonText = 'जमा करे';
                cancelButtonText = 'रद्द करे';
            }
            const alert = await this.alertCtrl.create({
                header: headerTitleOfAlert,
                inputs: [
                    {
                        name: 'remark',
                        type: 'text',
                        placeholder: placeholderOfAlert,
                    },
                ],
                buttons: [
                    {
                        text: cancelButtonText,
                        role: 'cancel',
                        handler: () => {
                            console.log('Confirm Cancel');
                        },
                    },
                    {
                        text: okButtonText,
                        handler: (data) => {
                            if (data.remark) {
                                console.log(
                                    'this.createdChecklistNPK.length',
                                    this.createdChecklistNPK.length
                                );
                                for (var i = 0; i < this.createdChecklistNPK.length; i++) {
                                    if (
                                        this.npk[index].Id ==
                                        this.createdChecklistNPK[i].ChecklistId
                                    ) {
                                        this.createdChecklistNPK.splice(i, 1);
                                        this.npk[
                                            index
                                            ].isSelectedCheck = false;
                                    }
                                }
                                this.createdChecklistNPK.push({
                                    ChecklistId: this.npk[index].Id,
                                    IsChecked: false,
                                    Remarks: data.remark,
                                });
                                this.npk[index].isSelectedClose = true;
                                console.log('createdChecklistNPK', this.createdChecklistNPK);
                            } else {
                                this.httpClient.showToast('Please enter the remark');
                            }

                        },
                    },
                ],
            });

            await alert.present();
        } else {
            for (var i = 0; i < this.createdChecklistNPK.length; i++) {
                if (
                    this.npk[index].Id ==
                    this.createdChecklistNPK[i].ChecklistId
                ) {
                    console.log('in check');
                    this.createdChecklistNPK.splice(i, 1);
                    this.createdChecklistNPK[index].isSelectedClose = false;
                    console.log('this.createdChecklistNPK', this.createdChecklistNPK);
                }
            }
        }
        console.log('this.createdChecklistNPK', this.createdChecklistNPK);
    }
    checkedVCheckNPK(index, currentFLag) {
        if (!currentFLag) {
            for (var i = 0; i < this.createdChecklistNPK.length; i++) {
                if (
                    this.npk[index].Id ==
                    this.createdChecklistNPK[i].ChecklistId
                ) {
                    this.createdChecklistNPK.splice(i, 1);
                    this.npk[index].isSelectedClose = false;
                }
            }

            this.createdChecklistNPK.push({
                ChecklistId: this.npk[index].Id,
                IsChecked: true,
                Remarks: '',
            });
            this.npk[index].isSelectedCheck = true;
            console.log('this.createdChecklistNPK', this.createdChecklistNPK);
        } else {
            for (var i = 0; i < this.createdChecklistNPK.length; i++) {
                if (
                    this.npk[index].Id ==
                    this.createdChecklistNPK[i].ChecklistId
                ) {
                    console.log('in check');
                    this.createdChecklistNPK.splice(i, 1);
                    this.npk[index].isSelectedCheck = false;
                    console.log('this.createdChecklistNPK', this.createdChecklistNPK);
                }
            }
        }
    }


    async checkedCloseDoc(param) {
        if (param == 0) {
            if (this.isSelectedCheckDoc == true) {
                this.isSelectedCheckDoc = !this.isSelectedCheckDoc;

            } if (this.isSelectedCloseDoc == true) {
                this.isSelectedCloseDoc = !this.isSelectedCloseDoc;

            }else {
            console.log('this.isSelectedCloseDoc', this.isSelectedCloseDoc);
            console.log('this.isSelectedCheckDoc', this.isSelectedCheckDoc);
            var headerTitleOfAlert;
            var placeholderOfAlert;
            var okButtonText;
            var cancelButtonText;
            if (this.httpClient.currentLanguage == 'english') {
                headerTitleOfAlert = 'Remark';
                placeholderOfAlert = 'Enter Remark';
                okButtonText = 'Submit';
                cancelButtonText = 'Cancel';
            } else {
                headerTitleOfAlert = 'टिप्पणी';
                placeholderOfAlert = 'टिप्पणी दर्ज करें';
                okButtonText = 'जमा करे';
                cancelButtonText = 'रद्द करे';
            }
            const alert = await this.alertCtrl.create({
                header: headerTitleOfAlert,
                inputs: [
                    {
                        name: 'remark',
                        type: 'text',
                        placeholder: placeholderOfAlert,
                    },
                ],
                buttons: [
                    {
                        text: cancelButtonText,
                        role: 'cancel',
                        handler: () => {
                            console.log('Confirm Cancel');

                        },
                    },
                    {
                        text: okButtonText,
                        handler: (data) => {
                            if (data.remark) {
                                console.log('remark input ', data);
                                this.docRemark = data.remark;
                                this.isSelectedCloseDoc = !this.isSelectedCloseDoc;
                            } else {
                                this.httpClient.showToast('Please enter the remark');
                            }


                        },
                    },
                ],
            });

            await alert.present();

        } } else {
            this.isSelectedCheckDoc = !this.isSelectedCheckDoc;
            if (this.isSelectedCloseDoc == true) {
                this.isSelectedCloseDoc = !this.isSelectedCloseDoc;

            }
            console.log('this.isSelectedCheckDoc', this.isSelectedCheckDoc);
            console.log('this.isSelectedCloseDoc', this.isSelectedCloseDoc);

        }

    }
    confirmPVLicenseFinal() {
        var self = this;
        var sendRequestData = {
            'obj': {
                'usrnm': 'rajkisan',
                'psw': 'rajkisan@123',
                'srvnm': 'PreVerification',
                'srvmethodnm': 'ConfirmPVLicense',
                srvparam: JSON.stringify({
                    roleid: self.httpClient.userData.roleid,
                    userid: self.httpClient.userData.userid,
                    ApplicationId: this.checkList[0].ApplicationId,
                    AppType: this.upcomingData.ApplicationType,

                    'Remarks': 1,
                    'ActionCode': 'Physical Verification completed',

                }),
            }
        };
        console.log('sendRequestData -> ', sendRequestData);

        self.httpClient.post(sendRequestData).subscribe(
            function(temp) {
                var res: any = temp[0];
                console.log('res', res);
                self.httpClient.dismissLoading();
                if (res.status == 0) {
                    self.successAlertFinalSubmission();
                } else {
                    self.httpClient.showToast(res.message);
                }
            },
            (error) => {
                self.httpClient.showToastError();
            }
        );

    }

    checkRadioChange(menufType) {
        console.log(menufType);
    }


    async showRevertAlert() {
        if (this.httpClient.currentLanguage == "hindi") {
            const toast = await this.alertCtrl.create({
                header: "पुष्टीकरण !",
                message: "क्या आप यह आवेदन नागरिक को वापस करना चाहते हैं?",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "रद्द करें",
                        role: "cancel",
                        handler: () => {
                            console.log("Cancel revert");
                        },
                    }, {
                        text: "ठीक है",
                         handler: () => {
                            console.log("ok revert");
                             this.revert();

                         },
                    },
                ],
            });
            toast.present();
        } else {
            const toast = await this.alertCtrl.create({
                header: "Confirmation !",
                message: "Are you sure you want to Revert Back this application to citizen.",
                backdropDismiss: false,
                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel",
                        handler: () => {
                            console.log("Cancel revert");
                         },
                    }, {
                        text: "Ok",
                         handler: () => {
                            console.log("Ok revert");
                            this.revert();
                        },
                    },
                ],
            });
            toast.present();
        }
    }

    revert() {
        console.log('createdChecklist',this.createdChecklist);

 for (var i = 0; i < this.revertListData.length; i++) {
      var test = this.createdChecklist.filter((x) => x.LicenseAddressId == this.revertListData[i].LicenseAddressId );
     if(test.length > 0){
         this.revertListData[i].IsRevert = test[0].IsRevert;
         console.log(this.revertListData[i].IsRevert);
         console.log(test[0].IsRevert);
         console.log('revertListData after ',this.revertListData);

     }
 }
        var self = this;
        self.httpClient.showLoading();

        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PreVerification',
                srvmethodnm: 'RevertAddress',
                srvparam: JSON.stringify({
                    roleid: self.httpClient.userData.roleid,
                    userid: self.httpClient.userData.userid,
                    ApplicationId: this.checkList[0].ApplicationId,
                    Remarks: '',
                    LicenseAddressList: this.revertListData,
                 }),
            },
        };
        console.log('RevertAddress sendRequestData -> ', JSON.stringify(sendRequestData));

        self.httpClient.post(sendRequestData).subscribe(
            function(temp) {
                var res: any = temp[0];
                console.log('res', res);
                self.httpClient.dismissLoading();
                if (res.status == 0) {
                    self.successAlertFinalSubmission();
                } else {
                    self.httpClient.showToast(res.message);
                }
            },
            (error) => {
                var errorRequestData = {
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: 'PreVerification',
                        srvmethodnm: 'AddLicensePVData',
                        srvparam: JSON.stringify({
                            roleid: self.httpClient.userData.roleid,
                            userid: self.httpClient.userData.userid,
                            ApplicationId: self.checkList[0].ApplicationId,
                            Remarks: '',
                            LicenseAddressList: self.revertListData,
                         }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();                              }
        );

    }
    checkGPSPermission() {
        this.androidPermissions
            .checkPermission(
                this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
            )
            .then(
                (result) => {
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
                console.log("4");
            } else {
                //Show 'GPS Permission Request' dialogue
                this.androidPermissions
                    .requestPermission(
                        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
                    )
                    .then(
                        () => {
                            // call method to turn on GPS
                            this.askToTurnOnGPS();
                        },
                        (error) => {
                            //Show alert if user click on 'No Thanks'
                            alert(
                                "requestPermission Error requesting location permissions " +
                                error
                            );
                        }
                    );
            }
        });
    }

    askToTurnOnGPS() {
        this.locationAccuracy
            .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
            .then(
                () => {
                    // When GPS Turned ON call method to get Accurate location coordinates
                    this.getLoc();
                },
                (error) =>
                    alert(
                        "Error requesting location permissions " + JSON.stringify(error)
                    )
            );
    }

    getLoc(){

        this.geolocation.getCurrentPosition().then((resp) => {
            this.httpClient.latitude = resp.coords.latitude;
            this.httpClient.longitude = resp.coords.longitude;
            console.log(
                "location",
                this.httpClient.latitude,
                this.httpClient.longitude
            );
        })
            .catch((error) => {
                console.log("Error getting location", error);
                this.httpClient.showToast('Please Enable Location!!!');

            });
    }
}
