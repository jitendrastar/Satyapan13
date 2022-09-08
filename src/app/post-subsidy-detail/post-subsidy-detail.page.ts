import {Component,} from '@angular/core';
import {AlertController, NavController, Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {CommonService} from '../services/common.service';
import {Storage} from '@ionic/storage';
import {DatabaseServiceService} from '../services/database-service.service';

import {
    FileTransfer,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';

@Component({
    selector: 'app-post-subsidy-detail',
    templateUrl: './post-subsidy-detail.page.html',
    styleUrls: ['./post-subsidy-detail.page.scss'],
})
export class PostSubsidyDetailPage {
    applicationNumberForOfflineDelete: any;
    val: any = '1';
    farmerPhoto: any = '';
    ssoID: any;
    postVerificationListData: any;
    farmerNameHnd: any;
    roleId: any;
    userid: any;
    subsidyId: any;

    verifiedList: any = [];

    brandData: any = [];
    fileTransfer: FileTransferObject;


    /*Drip */

    constructor(private transfer: FileTransfer, public alertController: AlertController, public platform: Platform, public dbService: DatabaseServiceService, public router: Router, public navCtrl: NavController, public route: ActivatedRoute,
                private storage: Storage, public alertCtrl: AlertController, public httpClient: CommonService, private callNumber: CallNumber) {
        this.fileTransfer = this.transfer.create();
    }

    //
    // test(ev,i) {
    //     console.log(ev.detail.value);
    //     this.prevAvailedSubsidyArray[i].Year = new Date(ev.detail.value).getFullYear().toString();
    //     console.log(this.prevAvailedSubsidyArray[i].Year);
    //
    //
    // }
    //
    // getLand(i) {
    //     console.log('landArea', this.prevAvailedSubsidyArray[i].LandArea);
    // }
    ionViewDidLoad() {
        console.log('ionViewDidLoad PostSubsidyDetailPage');
    }

    async successAlertFinalSubmission() {
        this.httpClient.dismissLoading();
        if (this.httpClient.currentLanguage == 'english') {
            const alert = await this.alertController.create({
                header: 'Alert',
                subHeader: 'Successfully Submitted.',
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'Okay',
                        handler: () => {
                            this.VerificationList(this.roleId, this.userid, this.subsidyId);
                        },
                    },
                ],
            });

            await alert.present();
        } else {
            const alert = await this.alertController.create({
                header: 'Alert',
                subHeader: 'सफलतापूर्वक जमा किया गया | ',
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'ओके ',
                        handler: () => {
                            this.VerificationList(this.roleId, this.userid, this.subsidyId);
                        },
                    },
                ],
            });

            await alert.present();
        }
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter PostSubsidyDetailPage');
        this.subsidyId = this.route.snapshot.paramMap.get('subsidyId');
        this.roleId = this.httpClient.userData.roleid;
        this.userid = this.httpClient.userData.userid;
        if (this.httpClient.isOffline == true) {
            this.getOfflineData();
        } else {
            this.VerificationList(this.roleId, this.userid, this.subsidyId);
        }


        // this.oneYearFromNow = new Date().getFullYear() - 7;
        // console.log('oneYearFromNow', this.oneYearFromNow);
        //
        // for (let i = 0.20; i < parseFloat("4.99") + 0.01; i = i + 0.01) {
        //     this.LandAreaArr.push({
        //         value: i.toFixed(2)
        //     });
        // }
        // console.log('arr ', this.LandAreaArr);

    }

    getOfflineData() {
        this.postVerificationListData = [];
        if (this.subsidyId == '1') {
            this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfFarmpond', [])
                .then((res) => {
                    var formPondList = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            formPondList.push(res.rows.item(i));
                        }

                        console.log('this.formPondList', formPondList);
                        for (let j = 0; j < formPondList.length; j++) {
                            var tempObject = formPondList[j].applicationData;
                            this.postVerificationListData.push(JSON.parse(tempObject));
                            console.log('JSON.parse(tempObject)', JSON.parse(tempObject));
                            console.log('postVerificationListData', this.postVerificationListData);
                            // if (formPondList[j].finalSubmissionVerificationData == null) {
                            //     var tempObject = formPondList[j].applicationData;
                            //     this.postVerificationListData.push(JSON.parse(tempObject));
                            // }
                        }
                    }
                });
        } else if (this.subsidyId == '5') {
            this.dbService.storage
                .executeSql('SELECT * FROM postVpipelineIrrigationAllData', [])
                .then((res) => {
                    var pipelinelist = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            pipelinelist.push(res.rows.item(i));
                        }

                        console.log('this.pipelinelist', pipelinelist);
                        for (let j = 0; j < pipelinelist.length; j++) {
                            // if (pipelinelist[j].finalSubmission == null) {
                            var tempObject = JSON.parse(pipelinelist[j].applicationData);
                            console.log('tempObject', tempObject);
                            this.postVerificationListData.push(tempObject);
                            // }
                        }
                    }
                });
        } else if (this.subsidyId == '4') {
            this.dbService.storage
                .executeSql('SELECT * FROM postVerificationOfflineOfDiggi', [])
                .then((res) => {
                    var formPondList = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            formPondList.push(res.rows.item(i));
                        }

                        console.log('this.formPondList', formPondList);
                        for (let j = 0; j < formPondList.length; j++) {
                            if (formPondList[j].finalSubmissionVerificationData == null) {
                                var tempObject = formPondList[j].applicationData;
                                this.postVerificationListData.push(JSON.parse(tempObject));
                            }
                        }
                    }
                });
        } else if (this.subsidyId == '6') {
            this.dbService.storage
                .executeSql('SELECT * FROM postVerificationOfflineOfWaterTank', [])
                .then((res) => {
                    var formPondList = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            formPondList.push(res.rows.item(i));
                        }

                        console.log('this.formPondList', formPondList);
                        for (let j = 0; j < formPondList.length; j++) {
                            var tempObject = formPondList[j].applicationData;
                            this.postVerificationListData.push(JSON.parse(tempObject));
                            console.log('JSON.parse(tempObject)', JSON.parse(tempObject));
                            console.log('postVerificationListData', this.postVerificationListData);
                            // if (formPondList[j].finalSubmissionVerificationData == null) {
                            //     var tempObject = formPondList[j].applicationData;
                            //     this.postVerificationListData.push(JSON.parse(tempObject));
                            // }
                        }
                    }
                });
        } else if (this.subsidyId == '7') {
            this.dbService.storage
                .executeSql('SELECT * FROM postVerificationOfflineOfFarmImplement', [])
                .then((res) => {
                    var formPondList = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            formPondList.push(res.rows.item(i));
                        }

                        console.log('this.formPondList', formPondList);
                        for (let j = 0; j < formPondList.length; j++) {
                            var tempObject = formPondList[j].applicationData;
                            this.postVerificationListData.push(JSON.parse(tempObject));
                            console.log('JSON.parse(tempObject)', JSON.parse(tempObject));
                            console.log('postVerificationListData', this.postVerificationListData);
                            // if (formPondList[j].finalSubmissionVerificationData == null) {
                            //     var tempObject = formPondList[j].applicationData;
                            //     this.postVerificationListData.push(JSON.parse(tempObject));
                            // }
                        }
                    }
                });
        } else if (this.subsidyId == '11') {
            this.dbService.storage
                .executeSql('SELECT * FROM postVerificationOfflineOfDrip', [])
                .then((res) => {
                    var formPondList = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            formPondList.push(res.rows.item(i));
                        }

                        console.log('this.formPondList', formPondList);
                        for (let j = 0; j < formPondList.length; j++) {
                            var tempObject = formPondList[j].applicationData;
                            this.postVerificationListData.push(JSON.parse(tempObject));
                            console.log('JSON.parse(tempObject)', JSON.parse(tempObject));
                            console.log('postVerificationListData', this.postVerificationListData);

                        }
                    }
                });
        } else if (this.subsidyId == '16') {
            this.dbService.storage
                .executeSql('SELECT * FROM postVerificationOfflineOfMiniSprinkler', [])
                .then((res) => {
                    var formPondList = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            formPondList.push(res.rows.item(i));
                        }

                        console.log('this.formPondList', formPondList);
                        for (let j = 0; j < formPondList.length; j++) {
                            var tempObject = formPondList[j].applicationData;
                            this.postVerificationListData.push(JSON.parse(tempObject));
                            console.log('JSON.parse(tempObject)', JSON.parse(tempObject));
                            console.log('postVerificationListData', this.postVerificationListData);

                        }
                    }
                });
        } else if (this.subsidyId == '10') {
            this.dbService.storage
                .executeSql('SELECT * FROM postVerificationOfflineOfMicroSprinkler', [])
                .then((res) => {
                    var formPondList = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            formPondList.push(res.rows.item(i));
                        }

                        console.log('this.formPondList', formPondList);
                        for (let j = 0; j < formPondList.length; j++) {
                            var tempObject = formPondList[j].applicationData;
                            this.postVerificationListData.push(JSON.parse(tempObject));
                            console.log('JSON.parse(tempObject)', JSON.parse(tempObject));
                            console.log('postVerificationListData', this.postVerificationListData);

                        }
                    }
                });
        } else if (this.subsidyId == '3') {
            this.dbService.storage
                .executeSql('SELECT * FROM postVerificationOfflineOfSprinkler', [])
                .then((res) => {
                    var formPondList = [];
                    console.log('res', res);
                    if (res.rows.length > 0) {
                        console.log('res.rows', res.rows);
                        for (var i = 0; i < res.rows.length; i++) {
                            console.log(res.rows.item(i));
                            formPondList.push(res.rows.item(i));
                        }

                        console.log('this.formPondList', formPondList);
                        for (let j = 0; j < formPondList.length; j++) {
                            var tempObject = formPondList[j].applicationData;
                            this.postVerificationListData.push(JSON.parse(tempObject));
                            console.log('JSON.parse(tempObject)', JSON.parse(tempObject));
                            console.log('postVerificationOfflineOfSprinkler Data RS', this.postVerificationListData);

                        }
                    }
                });
        }
    }

    async gotoPostVerificationDetails(data) {
        // this.goToDetails(data);
        console.log('data', data);
        if (data.IsAdhaarVefify == '0') {
            var headerText: any;
            var messageText: any;
            if (this.httpClient.currentLanguage == 'hindi') {
                headerText = 'मोबाइल सत्यापित करें';
                messageText = 'कृपया कृषक का मोबाइल नंबर दर्ज करें';
            } else {
                headerText = 'Verify Mobile';
                messageText = 'Please enter the farmer mobile number';
            }
            const alert = await this.alertController.create({
                header: headerText,
                message: messageText,
                inputs: [
                    {
                        name: 'mobile',
                        type: 'number',
                        placeholder: 'Enter mobile',
                    },
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            console.log('Confirm Cancel');
                        },
                    },
                    {
                        text: 'Ok',
                        handler: (dataInput) => {
                            console.log('Confirm Ok', dataInput.mobile.length);
                            if (dataInput.mobile.length == 10) {
                                if (!this.httpClient.isOffline) {
                                    var self = this;
                                    self.httpClient.showLoading();
                                    var sendRequestData = {
                                        obj: {
                                            usrnm: 'rajkisan',
                                            psw: 'rajkisan@123',
                                            srvnm: 'PostVerification',
                                            srvmethodnm: 'VerifyAadhaarMobileNo',
                                            srvparam: JSON.stringify({
                                                aadhaarID: data.AadhaarNo,
                                                mobileNo: dataInput.mobile,
                                            }),
                                        },
                                    };
                                    this.httpClient.post(sendRequestData).subscribe(
                                        function(res: any) {
                                            self.httpClient.dismissLoading();
                                            if (res[0].status == 0) {
                                                self.goToDetails(data);
                                            } else {
                                                if (res[0].data == '') {
                                                    self.httpClient.showToast(res[0].message);
                                                } else {
                                                    self.httpClient.showToast(res[0].data);
                                                }
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
                                                    srvnm: 'PostVerification',
                                                    srvmethodnm: 'VerifyAadhaarMobileNo',
                                                    srvparam: JSON.stringify({
                                                        aadhaarID: data.AadhaarNo,
                                                        mobileNo: dataInput.mobile,
                                                    }),
                                                }
                                            };
                                            console.log('errorRequestData new', errorRequestData);
                                            self.httpClient.getErrorMobileLogs(errorRequestData);
                                            self.httpClient.showToastError();
                                        }
                                    );
                                } else {
                                    data.mobilToVerify = dataInput.mobile;
                                    this.goToDetails(data);

                                }
                            } else {
                                this.httpClient.showToast('कृपया सही मोबाइल नंबर दर्ज करें ');
                            }
                        },
                    },
                ],
            });

            await alert.present();
        } else {
            this.goToDetails(data);
        }

    }

    goToDetails(data) {
        if (data.SubsidySchemeId == '1') {
            if (data.offlineFinalSubmission) {
                this.httpClient.showToast(
                    'This verification is already done. Please SYNC this verification'
                );
            } else {
                this.router.navigate([
                    'post-action-detail',
                    {obj: JSON.stringify(data)},
                ]);
            }
        } else if (data.SubsidySchemeId == '5') {
            if (data.finalSubmission) {
                this.httpClient.showToast(
                    'This verification is already done. Please SYNC this verification'
                );
            } else {
                this.router.navigate([
                    'pipeline-post-verification',
                    {obj: JSON.stringify(data)},
                ]);
            }
        } else if (data.SubsidySchemeId == '6') {
            if (data.applicationSubmissionData) {
                this.httpClient.showToast(
                    'This verification is already done. Please SYNC this verification'
                );
            } else {
                this.router.navigate([
                    'water-tank-post-verification',
                    {obj: JSON.stringify(data)},
                ]);
            }
        } else if (data.SubsidySchemeId == '4') {
            if (data.finalSubmission) {
                this.httpClient.showToast('This verification is already done. Please SYNC this verification');
            } else {
                this.router.navigate([
                    'diggi-post-verification',
                    {obj: JSON.stringify(data)},
                ]);
            }
        } else if (data.SubsidySchemeId == '7') {
            if (data.finalSubmission) {
                this.httpClient.showToast(
                    'This verification is already done. Please SYNC this verification'
                );
            } else {
                this.router.navigate([
                    'farm-implements-post-verification',
                    {obj: JSON.stringify(data)},
                ]);
            }
        } else if (data.SubsidySchemeId == '3') {
            if (data.finalSubmission) {
                this.httpClient.showToast('This verification is already done. Please SYNC this verification');
            } else {
                this.router.navigate([
                    'horticulture-application-details',
                    {
                        data: JSON.stringify(data),
                        brandData: JSON.stringify(this.brandData),
                    },
                ]);
            }
        } else if (data.SubsidySchemeId == '11') {
            if (data.finalSubmission) {
                this.httpClient.showToast('This verification is already done. Please SYNC this verification');
            } else {
                this.router.navigate([
                    'drip-post-verification',
                    // "horticulture-application-details",
                    {
                        data: JSON.stringify(data),
                        brandData: JSON.stringify(this.brandData),
                    },
                ]);
            }

        } else if (data.SubsidySchemeId == '16') {
            if (data.finalSubmission) {
                this.httpClient.showToast('This verification is already done. Please SYNC this verification');
            } else {
                this.router.navigate([
                    'mini-sprinkler-post-verification',
                    // "horticulture-application-details",
                    {
                        data: JSON.stringify(data),
                        brandData: JSON.stringify(this.brandData),
                    },
                ]);
            }
        } else if (data.SubsidySchemeId == '15') {
            this.router.navigate([
                'mini-sprinkler-post-verification',
                // "horticulture-application-details",
                {
                    data: JSON.stringify(data),
                    brandData: JSON.stringify(this.brandData),
                },
            ]);
        } else if (data.SubsidySchemeId == '10') {
            if (data.finalSubmission) {
                this.httpClient.showToast('This verification is already done. Please SYNC this verification');
            } else {
                this.router.navigate([
                    'micro-sprinkler-post-verification',
                    // "horticulture-application-details",
                    {
                        data: JSON.stringify(data),
                        brandData: JSON.stringify(this.brandData),
                    },
                ]);
            }
        } else if (data.SubsidySchemeId == '2') {
            this.router.navigate([
                'raingun-post-verification',
                // "horticulture-application-details",
                {
                    data: JSON.stringify(data),
                    brandData: JSON.stringify(this.brandData),
                },
            ]);
        }
    }

    VerificationList(roleId, userid, subsidyId) {
        var self = this;
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'i75Q7Q6nYgW3rgEitGndNA==',
                srvnm: 'PreVerification',
                srvmethodnm: 'VerificationList',
                srvparam: JSON.stringify({
                    SubsidySchemeId: subsidyId,
                    RoleId: roleId,
                    UserId: userid,
                    Flag: '2',
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    self.postVerificationListData = res[0].data;
                    self.brandData = [];
                    for (let i = 0; i < self.postVerificationListData.length; i++) {
                        self.postVerificationListData[i].isAlreadySaved = 0;
                        if (
                            self.subsidyId == '11' || self.subsidyId == '16' ||
                            self.subsidyId == '3' ||
                            self.subsidyId == '15' ||
                            self.subsidyId == '10' ||
                            self.subsidyId == '2'
                        ) {
                            self.brandData.push({
                                HortiBrandId: self.postVerificationListData[i].HortiBrandId,
                                Brand: self.postVerificationListData[i].Brand,
                            });
                        }
                    }
                    self.postVerificationListData.brandData = self.brandData;

                    self.checkOfflineExistOrNot();
                } else {
                    if (res[0].data == '') {
                        self.showPrompt(res[0].message);
                    } else {
                        self.showPrompt(res[0].data);
                    }
                }
                self.httpClient.dismissLoadingImage();
            },
            (error) => {
                var errorRequestData = {
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: 'PreVerification',
                        srvmethodnm: 'VerificationList',
                        srvparam: JSON.stringify({
                            SubsidySchemeId: subsidyId,
                            RoleId: roleId,
                            UserId: userid,
                            Flag: '2',
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    checkOfflineExistOrNot() {
        var self = this;
        if (!self.platform.is('mobileweb')) {
            if (this.subsidyId == 1) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVerificationOfflineOfFarmpond', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                var temp = JSON.parse(res.rows.item(i).applicationData);
                                if (temp.offlineFinalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                } else if (temp.finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }

                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationListData', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }
                        // if (this.verifiedList.length > 0) {
                        //     for (var n = 0; n < this.postVerificationListData.length; n++) {
                        //         this.postVerificationListData[n].isAlreadySaved = 0;
                        //         for (let j = 0; j < this.verifiedList.length; j++) {
                        //             var tempObject = this.verifiedList[j].applicationData;
                        //             if (
                        //                 JSON.parse(tempObject).ApplicationId ==
                        //                 this.postVerificationListData[n].ApplicationId
                        //             ) {
                        //                 console.log("verifiedList[j]", this.verifiedList[j]);
                        //                 this.postVerificationListData[n].isAlreadySaved = 1;
                        //                 this.postVerificationListData[
                        //                     n
                        //                     ].billData = this.verifiedList[j].billData;
                        //                 this.postVerificationListData[n].mobilToVerify = JSON.parse(
                        //                     this.verifiedList[j].applicationData
                        //                 ).mobilToVerify;
                        //                 this.postVerificationListData[
                        //                     n
                        //                     ].photoOne = this.verifiedList[j].photoOne;
                        //                 this.postVerificationListData[
                        //                     n
                        //                     ].photoTwo = this.verifiedList[j].photoTwo;
                        //                 this.postVerificationListData[
                        //                     n
                        //                     ].photoThree = this.verifiedList[j].photoThree;
                        //                 this.postVerificationListData[
                        //                     n
                        //                     ].applicationVerificationData = this.verifiedList[
                        //                     j
                        //                     ].applicationVerificationData;
                        //                 this.postVerificationListData[
                        //                     n
                        //                     ].finalSubmissionVerificationData = this.verifiedList[
                        //                     j
                        //                     ].finalSubmissionVerificationData;
                        //             }
                        //         }
                        //     }
                        //     console.log("this.postVerificationListData",this.postVerificationListData);
                        // }
                    });
            } else if (this.subsidyId == 5) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVpipelineIrrigationAllData', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                if (JSON.parse(res.rows.item(i).applicationData).finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }
                        if (this.verifiedList.length > 0) {
                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationListData', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }
                    });
            } else if (this.subsidyId == 4) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVerificationOfflineOfDiggi', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                var temp = JSON.parse(res.rows.item(i).applicationData);
                                if (temp.finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }

                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationListData', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }

                    });
            } else if (this.subsidyId == 6) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVerificationOfflineOfWaterTank', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                var temp = JSON.parse(res.rows.item(i).applicationData);
                                if (temp.offlineFinalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                } else if (temp.finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }

                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationListData', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }

                    });
            } else if (this.subsidyId == 7) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVerificationOfflineOfFarmImplement', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                var temp = JSON.parse(res.rows.item(i).applicationData);
                                if (temp.offlineFinalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                } else if (temp.finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }

                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationListData', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }

                    });
            } else if (this.subsidyId == 11) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVerificationOfflineOfDrip', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                var temp = JSON.parse(res.rows.item(i).applicationData);
                                if (temp.finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }

                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationListData', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }

                    });
            } else if (this.subsidyId == 16) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVerificationOfflineOfMiniSprinkler', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                var temp = JSON.parse(res.rows.item(i).applicationData);
                                if (temp.finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }

                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationListData', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }

                    });
            } else if (this.subsidyId == 10) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVerificationOfflineOfMicroSprinkler', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                var temp = JSON.parse(res.rows.item(i).applicationData);
                                if (temp.finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }

                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationListData', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }

                    });
            } else if (this.subsidyId == 3) {
                self.dbService.storage
                    .executeSql('SELECT * FROM postVerificationOfflineOfSprinkler', [])
                    .then((res) => {
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                console.log('res.rows.item(i)', res.rows.item(i));
                                var temp = JSON.parse(res.rows.item(i).applicationData);
                                if (temp.finalSubmission) {
                                    this.verifiedList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }

                            for (let p = 0; p < this.postVerificationListData.length; p++) {
                                for (let t = 0; t < this.verifiedList.length; t++) {
                                    if (this.postVerificationListData[p].ApplicationId == this.verifiedList[t].ApplicationId) {
                                        this.postVerificationListData.splice(p, 1);
                                        this.verifiedList[t].isAlreadySaved = 2;
                                        this.postVerificationListData.unshift(this.verifiedList[t]);
                                        console.log('this.postVerificationOfflineOfSprinkler RS', this.postVerificationListData);
                                    }

                                }
                            }
                            console.log('verifiedList', this.verifiedList);
                        }

                    });
            }
        }
    }

    callFarmer(mobileNo) {
        this.callNumber
            .callNumber(mobileNo, true)
            .then((res) => console.log('Launched dialer!', res))
            .catch((err) => console.log('Error launching dialer', err));
    }

    async showPrompt(msg) {
        if (this.httpClient.currentLanguage == 'hindi') {
            const prompt = await this.alertCtrl.create({
                header: 'अलर्ट!',
                message: msg,
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'ठीक है',
                        handler: (data) => {
                            console.log('Ok clicked');
                            this.navCtrl.pop();
                        },
                    },
                ],
            });
            await prompt.present();
        } else {
            const alert = await this.alertCtrl.create({
                header: 'Alert!',
                message: msg,
                backdropDismiss: false,
                buttons: [
                    {
                        text: 'OK',
                        handler: (data) => {
                            console.log('Ok clicked');
                            this.navCtrl.pop();
                        },
                    },
                ],
            });
            await alert.present();
        }
    }

    getBisList(applicationData, checklistData) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetThicknessAndBISCodeList',
                srvparam: JSON.stringify({
                    Flag: '0',
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(temp) {
                var res: any = temp[0];

                if (res.status == 0) {

                    var listOfBIS = res.data;
                    self.getSheetThickness(applicationData, checklistData, listOfBIS);
                    console.log('listOfBIS- > ', listOfBIS);
                } else {
                    self.httpClient.dismissLoading();

                    if (res.data == '') {
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetThicknessAndBISCodeList',
                        srvparam: JSON.stringify({
                            Flag: '0',
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getSheetThickness(applicationData, checklistData, listOfBIS) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetThicknessAndBISCodeList',
                srvparam: JSON.stringify({
                    Flag: '1',
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(temp) {
                var res: any = temp[0];

                if (res.status == 0) {
                    self.httpClient.dismissLoading();

                    var listOfSheetThickness = res.data;
                    applicationData.checklistData = checklistData;
                    applicationData.listOfBIS = listOfBIS;
                    applicationData.listOfSheetThickness = listOfSheetThickness;
                    self.dbService.addpostVerificationOfFarmPondOffline(applicationData.ApplicationId, JSON.stringify(applicationData));

                } else {
                    self.httpClient.dismissLoading();

                    if (res.data == '') {
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetThicknessAndBISCodeList',
                        srvparam: JSON.stringify({
                            Flag: '1',
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getBisNumber(data, index) {
        var self = this;
        let listOfBIS = [];
        var sendRequestData6 = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetThicknessAndBISCodeList',
                srvparam: JSON.stringify({
                    Flag: '0',
                }),
            },
        };
        this.httpClient.post(sendRequestData6).subscribe(function(temp) {
                var res: any = temp[0];

                if (res.status == 0) {


                    data.listOfBIS = res.data;
                    self.getminsofIrrigration(data, index);
                    // console.log("listOfBIS- > ", self.listOfBIS);
                } else {
                    self.httpClient.dismissLoading();

                    if (res.data == '') {
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetThicknessAndBISCodeList',
                        srvparam: JSON.stringify({
                            Flag: '0',
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getminsofIrrigration(data, index) {
        var we = this;
        let meansOfIrrigationList = [];
        // self.httpClient.showLoading();
        var sendRequestData1 = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetMeansofIrrigation',
                srvparam: '{\'AgriLovValuesCode\':\'MeansofIrrigation\'}',
            },
        };
        we.httpClient.post(sendRequestData1).subscribe(function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    data.meansOfIrrigationList = res[0].data;
                    we.microIrrigationSystemList(data, index);
                } else {
                    we.httpClient.showToast(res[0].data);
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
                        userid: we.httpClient.userData.userid,
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetMeansofIrrigation',
                        srvparam: '{\'AgriLovValuesCode\':\'MeansofIrrigation\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                we.httpClient.getErrorMobileLogs(errorRequestData);
                we.httpClient.showToastError();
            }
        );
    }

    microIrrigationSystemList(data, index) {
        var you = this;
        let microIrrigationSystemList = [];
        // self.httpClient.showLoading();
        var sendRequestData2 = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetMicroIrrigationSystem',
                srvparam: '{\'AgriLovValuesCode\':\'MicroIrrigationAvailableInApp\'}',
            },
        };
        you.httpClient.post(sendRequestData2).subscribe(function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    data.microIrrigationSystemList = res[0].data;
                    you.minorIrrigationList(data, index);
                } else {
                    you.httpClient.showToast(res[0].data);
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
                        userid: you.httpClient.userData.userid,
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetMicroIrrigationSystem',
                        srvparam: '{\'AgriLovValuesCode\':\'MicroIrrigationAvailableInApp\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                you.httpClient.getErrorMobileLogs(errorRequestData);
                you.httpClient.showToastError();
            }
        );
    }

    minorIrrigationList(data, index) {
        var me = this;
        var minorIrrigationList: any = [];
        // self.httpClient.showLoading();
        var sendRequestData3 = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetMinorIrrigation',
                srvparam: '{}',
            },
        };

        this.httpClient.post(sendRequestData3).subscribe(function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    data.minorIrrigationList = res[0].data;
                    me.VerificationChecklistDiggi(data, index);
                } else {
                    me.httpClient.showToast(res[0].data);

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
                        userid: me.httpClient.userData.userid,
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetMinorIrrigation',
                        srvparam: '{}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                me.httpClient.getErrorMobileLogs(errorRequestData);
                me.httpClient.showToastError();
            }
        );
    }

    VerificationChecklistDiggi(data, index) {
        var self = this;
        var checklistData = [];

        var sendRequestData4 = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'i75Q7Q6nYgW3rgEitGndNA==',
                srvnm: 'PreVerification',
                srvmethodnm: 'VerificationChecklist',
                srvparam:
                    '{\'SchemeId\':\'' +
                    data.SubsidySchemeId +
                    '\', \'StepName\':\'Post verification\',\'ApplicationId\':\'' +
                    data.ApplicationId +
                    '\'}',
            },
        };
        this.httpClient.post(sendRequestData4).subscribe(function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    checklistData = res[0].data;
                    for (var i = 0; i < checklistData.length; i++) {
                        checklistData[i].isSelectedClose = false;
                        checklistData[i].isSelectedCheck = false;
                    }
                    data.isAlreadySaved = 1;
                    let applicationData = data;
                    applicationData.checklistData = checklistData;
                    applicationData.minorIrrigationList = data.minorIrrigationList;
                    applicationData.microIrrigationSystemList = data.microIrrigationSystemList;
                    applicationData.meansOfIrrigationList = data.meansOfIrrigationList;
                    applicationData.listOfBIS = data.listOfBIS;
                    applicationData.listOfSheetThickness = data.listOfSheetThickness;


                    self.dbService.addpostVerificationOfDiggi(data.ApplicationId, JSON.stringify(applicationData));
                    self.postVerificationListData[index].isAlreadySaved = 1;
                } else {
                    if (res[0].data == '') {
                        self.showPrompt(res[0].message);
                    } else {
                        self.showPrompt(res[0].data);
                    }
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
                        srvmethodnm: 'VerificationChecklist',
                        srvparam:
                            '{\'SchemeId\':\'' +
                            data.SubsidySchemeId +
                            '\', \'StepName\':\'Post verification\',\'ApplicationId\':\'' +
                            data.ApplicationId +
                            '\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    saveDataOfline(data, index) {
        var self = this;
        if (this.subsidyId == '1') {
            var self = this;
            var checklistData = [];
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'i75Q7Q6nYgW3rgEitGndNA==',
                    srvnm: 'PreVerification',
                    srvmethodnm: 'VerificationChecklist',
                    srvparam:
                        '{\'SchemeId\':\'' +
                        data.SubsidySchemeId +
                        '\', \'StepName\':\'Post verification\',\'ApplicationId\':\'' +
                        data.ApplicationId +
                        '\'}',
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {

                    if (res[0].status == 0) {
                        checklistData = res[0].data;
                        for (var i = 0; i < checklistData.length; i++) {
                            checklistData[i].isSelectedClose = false;
                            checklistData[i].isSelectedCheck = false;
                        }
                        self.postVerificationListData[index].isAlreadySaved = 1;
                        data.isAlreadySaved = 1;
                        self.getBisList(data, checklistData);
                    } else {
                        if (res[0].data == '') {
                            self.showPrompt(res[0].message);
                        } else {
                            self.showPrompt(res[0].data);
                        }
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
                            srvmethodnm: 'VerificationChecklist',
                            srvparam:
                                '{\'SchemeId\':\'' +
                                data.SubsidySchemeId +
                                '\', \'StepName\':\'Post verification\',\'ApplicationId\':\'' +
                                data.ApplicationId +
                                '\'}',
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        } else if (this.subsidyId == '5') {
            this.dbService.addPostVpipelineIrrigationAllData(data.ApplicationId, JSON.stringify(data));
            self.postVerificationListData[index].isAlreadySaved = 1;
        } else if (this.subsidyId == '4') {
            var ravi = this;
            ravi.httpClient.showLoading();
            let listOfSheetThickness = [];
            var sendRequestData5 = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'GetThicknessAndBISCodeList',
                    srvparam: JSON.stringify({
                        Flag: '1',
                    }),
                },
            };
            this.httpClient.post(sendRequestData5).subscribe(function(temp) {
                    var res: any = temp[0];

                    if (res.status == 0) {
                        self.httpClient.dismissLoading();

                        data.listOfSheetThickness = res.data;
                        ravi.getBisNumber(data, index);
                        // console.log("listOfSheetThickness- > ", self.listOfSheetThickness);
                    } else {
                        self.httpClient.dismissLoading();

                        if (res.data == '') {
                            ravi.httpClient.showToast(res.message);
                        } else {
                            ravi.httpClient.showToast(res.data);
                        }
                    }
                }, (error) => {
                    ravi.httpClient.dismissLoading();
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            srvnm: 'PostVerification',
                            srvmethodnm: 'GetThicknessAndBISCodeList',
                            srvparam: JSON.stringify({
                                Flag: '1',
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );


        }
        else if (this.subsidyId == '6') {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'i75Q7Q6nYgW3rgEitGndNA==',
                    srvnm: 'PreVerification',
                    srvmethodnm: 'VerificationChecklist',
                    srvparam:
                        '{\'SchemeId\':\'' +
                        data.SubsidySchemeId +
                        '\', \'StepName\':\'Post verification\',\'ApplicationId\':\'' +
                        data.ApplicationId +
                        '\'}',
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log('res', res);
                    if (res[0].status == 0) {
                        data.preVerificationChecklistData = res[0].data;
                        for (var i = 0; i < data.preVerificationChecklistData.length; i++) {
                            data.preVerificationChecklistData[i].isSelectedClose = false;
                            data.preVerificationChecklistData[i].isSelectedCheck = false;
                        }
                        self.postVerificationListData[index].isAlreadySaved = 1;
                        self.getListOfWaterTankType(data);

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
                            srvnm: 'PreVerification',
                            srvmethodnm: 'VerificationChecklist',
                            srvparam:
                                '{\'SchemeId\':\'' +
                                data.SubsidySchemeId +
                                '\', \'StepName\':\'Post verification\',\'ApplicationId\':\'' +
                                data.ApplicationId +
                                '\'}',
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        } else if (this.subsidyId == '7') {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'i75Q7Q6nYgW3rgEitGndNA==',
                    srvnm: 'PreVerification',
                    srvmethodnm: 'VerificationChecklist',
                    srvparam:
                        '{\'SchemeId\':\'' +
                        data.SubsidySchemeId +
                        '\', \'StepName\':\'Post verification\',\'ApplicationId\':\'' +
                        data.ApplicationId +
                        '\'}',
                },
            };
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log('res', res);
                    if (res[0].status == 0) {
                        data.preVerificationChecklistData = res[0].data;
                        for (var i = 0; i < data.preVerificationChecklistData.length; i++) {
                            data.preVerificationChecklistData[i].isSelectedClose = false;
                            data.preVerificationChecklistData[i].isSelectedCheck = false;
                        }
                        self.postVerificationListData[index].isAlreadySaved = 1;
                        self.getBHP(data);

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
                            srvnm: 'PreVerification',
                            srvmethodnm: 'VerificationChecklist',
                            srvparam:
                                '{\'SchemeId\':\'' +
                                data.SubsidySchemeId +
                                '\', \'StepName\':\'Post verification\',\'ApplicationId\':\'' +
                                data.ApplicationId +
                                '\'}',
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        } else if (this.subsidyId == '11') {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'VerificationChecklist',
                    srvparam: JSON.stringify({
                        schemeid: data.SubsidySchemeId,
                        StepName: 'Post Verification',
                        ApplicationId: data.ApplicationId,
                    }),
                },
            };
            console.log('VerificationChecklistt - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log(' VerificationChecklist res', res);
                    self.postVerificationListData[index].isAlreadySaved = 1;
                    if (res[0].status == 0) {
                        data.getVerificationCheckData = res[0].data;
                        for (var i = 0; i < data.getVerificationCheckData.length; i++) {
                            data.getVerificationCheckData[i].isSelectedClose = false;
                            data.getVerificationCheckData[i].isSelectedCheck = false;
                        }
                        self.getHorticultureManufactureListData(data);
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
                            srvnm: 'PostVerification',
                            srvmethodnm: 'VerificationChecklist',
                            srvparam: JSON.stringify({
                                schemeid: data.SubsidySchemeId,
                                StepName: 'Post Verification',
                                ApplicationId: data.ApplicationId,
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        }
        else if (this.subsidyId == '16') {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'VerificationChecklist',
                    srvparam: JSON.stringify({
                        schemeid: data.SubsidySchemeId,
                        StepName: 'Post Verification',
                        ApplicationId: data.ApplicationId,
                    }),
                },
            };
            console.log('VerificationChecklistt - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log(' VerificationChecklist res', res);
                    self.postVerificationListData[index].isAlreadySaved = 1;
                    if (res[0].status == 0) {
                        data.getVerificationCheckData = res[0].data;
                        for (var i = 0; i < data.getVerificationCheckData.length; i++) {
                            data.getVerificationCheckData[i].isSelectedClose = false;
                            data.getVerificationCheckData[i].isSelectedCheck = false;
                        }
                        self.getHorticultureManufactureListDataMiniSprinkler(data);
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
                            srvnm: 'PostVerification',
                            srvmethodnm: 'VerificationChecklist',
                            srvparam: JSON.stringify({
                                schemeid: data.SubsidySchemeId,
                                StepName: 'Post Verification',
                                ApplicationId: data.ApplicationId,
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        } else if (this.subsidyId == '10') {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'VerificationChecklist',
                    srvparam: JSON.stringify({
                        schemeid: data.SubsidySchemeId,
                        StepName: 'Post Verification',
                        ApplicationId: data.ApplicationId,
                    }),
                },
            };
            console.log('VerificationChecklistt - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log(' VerificationChecklist res', res);
                    self.postVerificationListData[index].isAlreadySaved = 1;
                    if (res[0].status == 0) {
                        data.getVerificationCheckData = res[0].data;
                        for (var i = 0; i < data.getVerificationCheckData.length; i++) {
                            data.getVerificationCheckData[i].isSelectedClose = false;
                            data.getVerificationCheckData[i].isSelectedCheck = false;
                        }
                        self.getHorticultureManufactureListDataMicroSprinkler(data);
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
                            srvnm: 'PostVerification',
                            srvmethodnm: 'VerificationChecklist',
                            srvparam: JSON.stringify({
                                schemeid: data.SubsidySchemeId,
                                StepName: 'Post Verification',
                                ApplicationId: data.ApplicationId,
                            }),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        } else if (this.subsidyId == '3') {
            var self = this;
            self.httpClient.showLoading();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'VerificationChecklist',
                    srvparam: JSON.stringify({
                        schemeid: data.SubsidySchemeId,
                        StepName: 'Post Verification',
                        ApplicationId: data.ApplicationId,
                    }),
                },
            };
            console.log('VerificationChecklistt RS - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log(' VerificationChecklist res', res);
                    self.postVerificationListData[index].isAlreadySaved = 1;
                    if (res[0].status == 0) {
                        data.getVerificationCheckData = res[0].data;
                        for (var i = 0; i < data.getVerificationCheckData.length; i++) {
                            data.getVerificationCheckData[i].isSelectedClose = false;
                            data.getVerificationCheckData[i].isSelectedCheck = false;
                        }
                        self.getHorticultureManufactureListDataSprinkler(data);
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
                            srvnm: 'PostVerification',
                            srvmethodnm: 'VerificationChecklist',
                            srvparam: JSON.stringify({
                                schemeid: data.SubsidySchemeId,
                                StepName: 'Post Verification',
                                ApplicationId: data.ApplicationId,
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

    getHorticultureManufactureListDataSprinkler(data) {
        var self = this;
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHorticultureManufactureList',
                srvparam: '{}',
            },
        };
        console.log('HorticultureManufactureList RS- ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' HorticultureManufactureList res', res);
                self.httpClient.dismissLoadingImage();

                if (res[0].status == 0) {
                    data.getHorticultureManufactureData = res[0].data;
                    self.getHorticultureManufactureDealerListSprinkler(data);

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetHorticultureManufactureList',
                        srvparam: '{}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getHorticultureManufactureDealerListSprinkler(data) {
        var self = this;
        // self.dealerValue = "";
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHorticultureManufactureDealerList',
                srvparam:
                    '{\'HorticultureManufactureId\':\'' +
                    -1 +
                    '\',\'ProductTypeId\':\'' +
                    1 +
                    '\'}',
            },
        };
        console.log('GetHorticultureManufactureDealerList RS- ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' GetHorticultureManufactureDealerList res', res);
                self.httpClient.dismissLoadingImage();

                if (res[0].status == 0) {
                    data.getHorticultureManufactureDealerListData = res[0].data;
                    self.getISILISTSprinkler(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetHorticultureManufactureDealerList',
                        srvparam:
                            '{\'HorticultureManufactureId\':\'' +
                            -1 +
                            '\',\'ProductTypeId\':\'' +
                            1 +
                            '\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getISILISTSprinkler(data) {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetISIMarkList',
                srvparam: '{\'SubsidySchemeId\':\'3\'}',
            },
        };
        console.log('GetISIMarkList RS- ', sendRequestData);

        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                // self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    data.listOfISIMarks = res[0].data;
                    // self.getHorticultureCouplerComponentListSprinkler(data);
                    self.getGetHortiHectareModelRangelist(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetISIMarkList',
                        srvparam: '{\'SubsidySchemeId\':\'3\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getGetHortiHectareModelRangelist(data) {

        var self = this;
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHortiHectareModelRangelist',
                srvparam: '{}',
            },
        };
        console.log('GetHortiHectareModelRangelist - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(function(res: any) {
                console.log(' HorticultureManufactureList res', res);
                self.httpClient.dismissLoadingImage();

                if (res[0].status == 0) {
                    data.getGetHortiHectareModelRangelistData = res[0].data;
                    self.GetHortiCouplerSizelist(data);
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

    GetHortiCouplerSizelist(data) {

        var self = this;
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHortiCouplerSizelist',
                srvparam: '{}',
            },
        };
        console.log('GetHortiCouplerSizelistData - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(function(res: any) {
                console.log(' GetHortiCouplerSizelistData res', res);
                self.httpClient.dismissLoadingImage();

                if (res[0].status == 0) {
                    data.GetHortiCouplerSizelistData = res[0].data;
                    self.getHorticultureCouplerComponentListSprinkler(data);

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

    getHorticultureCouplerComponentListSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GeHorticultureCouplerComponentList',
                srvparam: JSON.stringify({
                    HectareModel: data.HectareModel,
                    PipeSize: data.PipeId,
                    SubsidySchemeId: data.SubsidySchemeId,
                }),
            },
        };
        console.log('GeHorticultureCouplerComponentList RS- ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    console.log(' GeHorticultureCouplerComponentList res', res);
                    data.getHorticultureCouplerComponentListData = res[0].data;
                    data.listOfPipeType = res[0].data.filter((x) => x.IsTempRemove == '1');
                    self.dbService.addPostVerificationOfflineOfSprinkler(data.ApplicationId, JSON.stringify(data));


                } else {
                    self.httpClient.showToast(res[0].message);
                }
                console.log(' GeHorticultureCouplerComponentList res', res);

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
                        srvmethodnm: 'GeHorticultureCouplerComponentList',
                        srvparam: JSON.stringify({
                            HectareModel: data.HectareModel,
                            PipeSize: data.PipeId,
                            SubsidySchemeId: data.SubsidySchemeId,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }


    getBHP(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetFarmImplementsBHP',
                srvparam: JSON.stringify({
                    AgriLovValuesCode: 'Tractor BHP',
                    ImplementId: data.FarmImplementsMachineryId,
                }),
            },
        };

        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    data.listOfbhp = res[0].data;
                    self.getDistrict(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetFarmImplementsBHP',
                        srvparam: JSON.stringify({
                            AgriLovValuesCode: 'Tractor BHP',
                            ImplementId: data.FarmImplementsMachineryId,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getDistrict(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'GetMasterData',
                srvmethodnm: 'getmasterdataforMobilebytable',
                srvparam: JSON.stringify({
                    tablename: 'District',
                    filterfirst: '',
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    data.listOfDistrict = res[0].data;
                    self.getDealers(data);
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
                        srvnm: 'GetMasterData',
                        srvmethodnm: 'getmasterdataforMobilebytable',
                        srvparam: JSON.stringify({
                            tablename: 'District',
                            filterfirst: '',
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getDealers(data) {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetFarmImplementsDealers',
                srvparam: JSON.stringify({
                    userid: this.httpClient.userData.userid,
                    action: 'GetDealerOffline',
                    districtid: 0,
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    data.dealerList = res[0].data;
                    self.getRates(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetFarmImplementsDealers',
                        srvparam: JSON.stringify({
                            userid: self.httpClient.userData.userid,
                            action: 'GetDealerOffline',
                            districtid: 0,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getRates(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetFarmImplementsRateByDealer',
                srvparam: JSON.stringify({
                    action: 'GetRateOffline',
                    FarmImplementsMachineryId: data.FarmImplementsMachineryId,
                    AgriLovValuesCode: '0',
                    'dealerid': '0'
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    data.listOfRates = res[0].data;
                    self.getImplementsCategory(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetFarmImplementsRateByDealer',
                        srvparam: JSON.stringify({
                            action: 'GetRateOffline',
                            FarmImplementsMachineryId: data.FarmImplementsMachineryId,
                            AgriLovValuesCode: '0',
                            'dealerid': '0'
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getImplementsCategory(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetImplementCategoryIdByBHP',
                srvparam: JSON.stringify({
                    BHPId: 0,
                    ImplementId: data.FarmImplementsMachineryId,
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    data.listOfImplementCategory = res[0].data;
                    console.log('data', data);
                    self.dbService.addpostVerificationOfFarmImplement(data.ApplicationId, JSON.stringify(data));
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetImplementCategoryIdByBHP',
                        srvparam: JSON.stringify({
                            BHPId: 0,
                            ImplementId: data.FarmImplementsMachineryId,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }


    getListOfWaterTankType(data) {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetWaterStorageTypeLov',
                srvparam: '{\'AgriLovValuesCode\':\'ShapeWaterTank\'}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    data.listOfWaterTankType = res[0].data;
                    self.getMicroIrrigationSystem(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetWaterStorageTypeLov',
                        srvparam: '{\'AgriLovValuesCode\':\'ShapeWaterTank\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getMicroIrrigationSystem(data) {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetMicroIrrigationSystem',
                srvparam: '{\'AgriLovValuesCode\':\'MicroIrrigationAvailableInApp\'}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                if (res[0].status == 0) {
                    data.microIrrigationSystemList = res[0].data;
                    self.getListOfMeansofIrrigation(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetMicroIrrigationSystem',
                        srvparam: '{\'AgriLovValuesCode\':\'MicroIrrigationAvailableInApp\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getListOfMeansofIrrigation(data) {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetMeansofIrrigation',
                srvparam: '{\'AgriLovValuesCode\':\'MeansofIrrigation\'}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    data.meansOfIrrigationList = res[0].data;
                    self.dbService.addpostVerificationOfWaterTank(data.ApplicationId, JSON.stringify(data));
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetMeansofIrrigation',
                        srvparam: '{\'AgriLovValuesCode\':\'MeansofIrrigation\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    syncData(data) {
        if (this.subsidyId == 1) {
            console.log('data to posted', data);

            // console.log(data.applicationVerificationData);
            // var tempData = JSON.parse(data.applicationVerificationData);
            // console.log("tempData", tempData);
            if (data.sendRequestDataOffline) {
                this.submitYesForm(data);
            } else {
                this.diggiPhoto1NoCase(data);
            }
        } else if (this.subsidyId == 4) {
            console.log('data to posted', data);
            console.log(data.applicationVerificationData);
            var tempData = data;
            console.log('tempData', tempData);
            if (tempData.sendRequestDataOffline) {
                this.submitYesFormDiggi(data);
            } else {
                // this.submitNoFormDiggi(data.mobilToVerify, tempData);
                this.diggiPhoto1NoCase(data);
            }
        } else if (this.subsidyId == 6) {
            console.log('data to posted', data);
            console.log(data.applicationVerificationData);
            var tempData = data;
            console.log('tempData', tempData);
            if (tempData.sendRequestDataOffline) {
                this.submitYesFormWaterTank(data);
            } else {

                this.submitNoCaseFirstPhotomWaterTank(data);
            }
        } else if (this.subsidyId == 5) {
            if (data.sendRequestData) {
                if (data.farmerGrantPrevious == 'yes') {
                    this.uploadPhotoOfAffidavitPreviousGranted(data);
                } else {
                    this.submitDataOfPipelineSubsidyNotGranted(data);
                }
            } else {
                this.uploadFarmerLetterOfDissentNoCase(data);
            }

        } else if (this.subsidyId == 7) {
            if (data.sendRequestDataOffline) {
                this.submitYesForm(data);
            } else {
                this.diggiPhoto1NoCase(data);
            }

        }
        else if (this.subsidyId == 11) {
            if (data.imgOfConsentLetter) {
                this.uploadimgOfConsentLetterOfDrip(data);
            } else if (data.basicDataSubmission.PrevAvailedSubsidyArray) {
                this.uploadimgOfPreAvailedSubsidy(data);
            } else {
                this.httpClient.showLoading();
                this.submitBasicDataOfDrip(data);
            }

        }
        else if (this.subsidyId == 16) {
            if (data.imgOfConsentLetter) {
                this.uploadimgOfConsentLetterOfMiniSprinkler(data);
            } else if (data.basicDataSubmission.PrevAvailedSubsidyArray) {
                this.uploadimgOfPreAvailedSubsidyMiniSprinkler(data);
            } else {
                this.httpClient.showLoading();
                this.submitBasicDataOfMiniSprinkler(data);
            }

        }
        else if (this.subsidyId == 10) {
            if (data.imgOfConsentLetter) {
                this.uploadimgOfConsentLetterOfMicroSprinkler(data);
            } else if (data.basicDataSubmission.PrevAvailedSubsidyArray) {
                this.uploadimgOfPreAvailedSubsidyMicroSprinkler(data);
            } else {
                this.httpClient.showLoading();
                this.submitBasicDataOfMicroSprinkler(data);
            }

        }
        else if (this.subsidyId == 3) {
            this.httpClient.showLoading();
            this.submitBasicDataOfSprinkler(data);

        }
    }

    /*SPRINKLER*/
    submitBasicDataOfSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddSprinklerPostVerification',
                srvparam: JSON.stringify(data.basicDataSubmission)
            },
        };
        console.log('AddSprinklerPostVerification - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' AddSprinklerPostVerification res', res);
                if (res[0].status == 0) {
                    self.uploadBillDetailsofSprinkler(data, res[0].data[0].PostVerificationId, 0);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddSprinklerPostVerification',
                        srvparam: JSON.stringify(data.basicDataSubmission)
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadBillDetailsofSprinkler(data, postverificationId, param) {
        console.log(' ApplicationId bill', postverificationId);
        console.log(' data.billDetails[param].BillImg', data.billDetails[param].BillImg);
        var self = this;
        this.fileTransfer
            .upload(data.billDetails[param].BillImg, this.httpClient.imageUploadUrl, data.billDetails[param].options)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    console.log('index', param);
                    console.log('data.billDetails.length', data.billDetails.length);
                    console.log('dataTwo.response', dataTwo.response);
                    var temp = JSON.parse(dataTwo.response);
                    data.billDetails[param].BillImg = temp[0].data;
                    if (param == data.billDetails.length - 1) {
                        console.log('in chaek');
                        self.uploadBillsApiOfSprinkler(data, postverificationId, 0);
                    } else {
                        self.uploadBillDetailsofSprinkler(data, postverificationId, param + 1);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );


    }

    uploadBillsApiOfSprinkler(data, postverificationId, param) {
        console.log('postverificationId', postverificationId);
        console.log('uploadBillsApi(data', data);
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationBillOneByOne',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    PostVerificationId: postverificationId,
                    userid: self.httpClient.userData.userid,
                    SubsidySchemeId: this.subsidyId,
                    BillNo: data.billDetails[param].BillNo,
                    BillAmount: data.billDetails[param].BillAmount,
                    BillImg: data.billDetails[param].BillImg,
                    BillDate: data.billDetails[param].BillDate,
                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    if (param == data.billDetails.length - 1) {
                        self.uploadFirstPhotoOfSprinkler(data, postverificationId);
                    } else {
                        self.uploadBillsApiOfSprinkler(data, postverificationId, param + 1);
                    }

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationBillOneByOne',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            PostVerificationId: postverificationId,
                            userid: self.httpClient.userData.userid,
                            SubsidySchemeId: self.subsidyId,
                            BillNo: data.billDetails[param].BillNo,
                            BillAmount: data.billDetails[param].BillAmount,
                            BillImg: data.billDetails[param].BillImg,
                            BillDate: data.billDetails[param].BillDate,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );

    }

    uploadFirstPhotoOfSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfimgSprinklerWithFarmeDateTime;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.imgSprinklerWithFarmeDateTime, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSecondPhotoOfSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSecondPhotoOfSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfimgSourceOfIrrigationDateTime;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.imgSourceOfIrrigationDateTime, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.finalSubmissionOfSprinkler(data);

                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    finalSubmissionOfSprinkler(data) {
        var self = this;
        var sendRequestData = data.finalSubmission;

        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    console.log(res);
                    self.dbService.storage.executeSql('DELETE FROM postVerificationOfflineOfSprinkler WHERE ApplicationId = ?', [data.ApplicationId]).then((_) => {
                        self.successAlertFinalSubmission();

                    })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'FinalSubmissionPostVerification',
                        srvparam: data.finalSubmission,
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    /*SPRINKLER END*/

    /*DRIP*/
    getHorticultureManufactureListData(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHorticultureManufactureList',
                srvparam: '{}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    data.getHorticultureManufactureData = res[0].data;
                    self.getHorticultureManufactureDealerList(data);


                } else {
                    self.showPrompt(res[0].data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetHorticultureManufactureList',
                        srvparam: '{}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getHorticultureManufactureDealerList(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHorticultureManufactureDealerList',
                srvparam:
                    '{\'HorticultureManufactureId\':\'' +
                    -1 +
                    '\',\'ProductTypeId\':\'' +
                    2 +
                    '\'}',
            },
        };
        console.log('GetHorticultureManufactureDealerList - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' GetHorticultureManufactureDealerList res', res);

                if (res[0].status == 0) {
                    data.getHorticultureManufactureDealerListData = res[0].data;
                    self.getISILIST(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetHorticultureManufactureDealerList',
                        srvparam:
                            '{\'HorticultureManufactureId\':\'' +
                            -1 +
                            '\',\'ProductTypeId\':\'' +
                            2 +
                            '\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getISILIST(data) {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetISIMarkList',
                srvparam: '{\'SubsidySchemeId\':\'11\'}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                // self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    data.listOfISIMarks = res[0].data;
                    // self.getHorticultureCouplerComponentList(data);
                    self.getGetPVOptionalItemList(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetISIMarkList',
                        srvparam: '{\'SubsidySchemeId\':\'11\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getGetPVOptionalItemList(data) {

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
            function(res: any) {
                console.log(' GetPVOptionalItemList res', res);
                self.httpClient.dismissLoading();

                if (res[0].status == 0) {
                    data.getPVOptionalItemListData = res[0].data;
                    console.log('getPVOptionalItemListData ---RS----', data.getPVOptionalItemListData);

                    self.getHorticultureCouplerComponentList(data);


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


    getHorticultureCouplerComponentList(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GeHorticultureCouplerComponentList',
                srvparam: JSON.stringify({
                    HectareModel: data.HectareModel,
                    SpaceTypeId: data.SpaceTypeId,
                    SubsidySchemeId: data.SubsidySchemeId,
                }),
            },
        };
        console.log('GeHorticultureCouplerComponentList - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    console.log(' GeHorticultureCouplerComponentList res', res);
                    data.getHorticultureCouplerComponentListData = res[0].data;
                    // data.prevAvailedSubsidyArray = [];
                    self.dbService.addpostVerificationOfflineOfDrip(data.ApplicationId, JSON.stringify(data));
                    // self.storage.get('dripApplicationsOffline').then((val) => {
                    //     if (val) {
                    //         console.log("val if ", val);
                    //         var temp = [];
                    //         temp = val;
                    //         for (var a = 0; a < temp.length; a++) {
                    //             self.httpClient.dismissLoading();
                    //             if (data.ApplicationId != temp[a].applicationId) {
                    //                 temp.push({ applicationId: data.ApplicationId, applicationData: data })
                    //                 self.storage.set('dripApplicationsOffline',temp).then((res) => {
                    //                     console.log('res', res);
                    //                     self.httpClient.showToast('This application is saved for Offline');
                    //                 })
                    //             }

                    //         }

                    //     }
                    //     else {

                    //         console.log("val else ", val);
                    //         self.storage.set('dripApplicationsOffline', [{ applicationId: data.ApplicationId, applicationData: data }]).then((res) => {
                    //             console.log('res', res);
                    //             self.httpClient.dismissLoading();
                    //         })
                    //     }
                    // })

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GeHorticultureCouplerComponentList',
                        srvparam: JSON.stringify({
                            HectareModel: data.HectareModel,
                            SpaceTypeId: data.SpaceTypeId,
                            SubsidySchemeId: data.SubsidySchemeId,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }


    submitBasicDataOfDrip(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddDripIrrigationPostVerification',
                srvparam: JSON.stringify(data.basicDataSubmission)
            },
        };
        console.log('AddSprinklerPostVerification - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' AddSprinklerPostVerification res', res);
                if (res[0].status == 0) {
                    self.uploadBillDetailsofDrip(data, res[0].data[0].PostVerificationId, 0);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddDripIrrigationPostVerification',
                        srvparam: JSON.stringify(data.basicDataSubmission)
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadBillsApiOfDrip(data, postverificationId, param) {
        console.log('postverificationId', postverificationId);
        console.log('uploadBillsApi(data', data);
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationBillOneByOne',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    PostVerificationId: postverificationId,
                    userid: self.httpClient.userData.userid,
                    SubsidySchemeId: this.subsidyId,
                    BillNo: data.billDetails[param].BillNo,
                    BillAmount: data.billDetails[param].BillAmount,
                    BillImg: data.billDetails[param].BillImg,
                    BillDate: data.billDetails[param].BillDate,
                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    if (param == data.billDetails.length - 1) {
                        self.uploadFirstPhotoOfDrip(data, postverificationId);
                    } else {
                        self.uploadBillsApiOfDrip(data, postverificationId, param + 1);
                    }

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationBillOneByOne',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            PostVerificationId: postverificationId,
                            userid: self.httpClient.userData.userid,
                            SubsidySchemeId: self.subsidyId,
                            BillNo: data.billDetails[param].BillNo,
                            BillAmount: data.billDetails[param].BillAmount,
                            BillImg: data.billDetails[param].BillImg,
                            BillDate: data.billDetails[param].BillDate,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );


    }

    finalSubmissionOfDrip(data) {
        var self = this;
        var sendRequestData = data.finalSubmission;

        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    console.log(res);
                    self.dbService.storage.executeSql('DELETE FROM postVerificationOfflineOfDrip WHERE ApplicationId = ?', [data.ApplicationId]).then((_) => {
                        self.successAlertFinalSubmission();

                    })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'FinalSubmissionPostVerification',
                        srvparam: data.finalSubmission
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadSeventhPhotoOfDrip(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfCompomnentTable;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.CompomnentTable, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.finalSubmissionOfDrip(data);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSixthPhotoOfDrip(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgWarrantyCard;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgWarrantyCard, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSeventhPhotoOfDrip(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFifthPhotoOfDrip(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgTriPartyAgreement;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgTriPartyAgreement, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSixthPhotoOfDrip(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFourthPhotoOfDrip(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgFarmerWithOfficer2;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgFarmerWithOfficer2, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadFifthPhotoOfDrip(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadThirdPhotoOfDrip(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgFarmerWithOfficer;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgFarmerWithOfficer, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadFourthPhotoOfDrip(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSecondPhotoOfDrip(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgDripBrandName2;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgDripBrandName2, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadThirdPhotoOfDrip(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFirstPhotoOfDrip(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgDripBrandName1;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgDripBrandName1, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSecondPhotoOfDrip(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadBillDetailsofDrip(data, postverificationId, param) {
        console.log(' ApplicationId bill', postverificationId);
        console.log(' data.billDetails[param].BillImg', data.billDetails[param].BillImg);
        var self = this;
        this.fileTransfer
            .upload(data.billDetails[param].BillImg, this.httpClient.imageUploadUrl, data.billDetails[param].options)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    console.log('index', param);
                    console.log('data.billDetails.length', data.billDetails.length);
                    console.log('dataTwo.response', dataTwo.response);
                    var temp = JSON.parse(dataTwo.response);
                    data.billDetails[param].BillImg = temp[0].data;
                    if (param == data.billDetails.length - 1) {
                        console.log('in chaek');
                        self.uploadBillsApiOfDrip(data, postverificationId, 0);
                    } else {
                        self.uploadBillDetailsofDrip(data, postverificationId, param + 1);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );


    }

    uploadimgOfConsentLetterOfDrip(data) {
        this.httpClient.showLoading();
        this.fileTransfer.upload(data.imgOfConsentLetter, this.httpClient.imageUploadUrl, data.optionsOfimgOfConsentLetter).then((dataa) => {
                var temp = JSON.parse(dataa.response);
                console.log('temp[0].data', temp[0].data);
                if (temp[0].data) {
                    data.basicDataSubmission.ImgConsentLetter = temp[0].data;
                    this.submitBasicDataOfDrip(data);
                } else {
                    this.httpClient.showToastError();
                }
            },
            (err) => {
                // error

                this.httpClient.dismissLoading();
                this.httpClient.showToastError();
                console.log('err', err);
            }
        );
    }


    uploadimgOfPreAvailedSubsidy(data) {
        this.httpClient.showLoading();
        var tempArray = [];
        tempArray = data.prevAvailedSubsidyArray;
        for (let i = 0; i < tempArray.length; i++) {
            this.fileTransfer.upload(tempArray[i].ProofDoc, this.httpClient.imageUploadUrl, data.OptionsOfProofDoc).then((dataa) => {
                    var temp = JSON.parse(dataa.response);
                    console.log('temp[0].data', temp[0].data);
                    if (temp[0].data) {
                        data.basicDataSubmission.PrevAvailedSubsidyArray[i].ProofDoc = temp[0].data;
                        if (i == tempArray.length - 1) {
                            this.submitBasicDataOfDrip(data);
                        }
                        // this.submitBasicDataOfDrip(data);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                });
        }


    }

    /*DRIP END*/


    /*MINI SPRINKLER*/
    uploadimgOfPreAvailedSubsidyMiniSprinkler(data) {
        this.httpClient.showLoading();
        var tempArray = [];
        tempArray = data.prevAvailedSubsidyArray;
        for (let i = 0; i < tempArray.length; i++) {
            this.fileTransfer.upload(tempArray[i].ProofDoc, this.httpClient.imageUploadUrl, data.OptionsOfProofDoc).then((dataa) => {
                    var temp = JSON.parse(dataa.response);
                    console.log('temp[0].data', temp[0].data);
                    if (temp[0].data) {
                        data.basicDataSubmission.PrevAvailedSubsidyArray[i].ProofDoc = temp[0].data;
                        if (i == tempArray.length - 1) {
                            this.submitBasicDataOfMiniSprinkler(data);
                        }
                        // this.submitBasicDataOfDrip(data);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                });
        }


    }

    getHorticultureManufactureListDataMiniSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHorticultureManufactureList',
                srvparam: '{}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    data.getHorticultureManufactureData = res[0].data;
                    self.getHorticultureManufactureDealerListMiniSprinkler(data);


                } else {
                    self.showPrompt(res[0].data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetHorticultureManufactureList',
                        srvparam: '{}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getHorticultureManufactureDealerListMiniSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHorticultureManufactureDealerList',
                srvparam:
                    '{\'HorticultureManufactureId\':\'' +
                    -1 +
                    '\',\'ProductTypeId\':\'' +
                    2 +
                    '\'}',
            },
        };
        console.log('GetHorticultureManufactureDealerList - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' GetHorticultureManufactureDealerList res', res);

                if (res[0].status == 0) {
                    data.getHorticultureManufactureDealerListData = res[0].data;
                    self.getISILISTMiniSprinkler(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetHorticultureManufactureDealerList',
                        srvparam:
                            '{\'HorticultureManufactureId\':\'' +
                            -1 +
                            '\',\'ProductTypeId\':\'' +
                            2 +
                            '\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getISILISTMiniSprinkler(data) {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetISIMarkList',
                srvparam: '{\'SubsidySchemeId\':\'16\'}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                // self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    data.listOfISIMarks = res[0].data;
                    self.getGetPVOptionalItemListMiniSprinkler(data);
                    // self.getHorticultureCouplerComponentListMiniSprinkler(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetISIMarkList',
                        srvparam: '{\'SubsidySchemeId\':\'16\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getGetPVOptionalItemListMiniSprinkler(data) {

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
            function(res: any) {
                console.log(' GetPVOptionalItemList res', res);
                self.httpClient.dismissLoading();

                if (res[0].status == 0) {
                    data.getPVOptionalItemListData = res[0].data;
                    console.log('getPVOptionalItemListData ---RS----', data.getPVOptionalItemListData);

                    self.getHorticultureCouplerComponentListMiniSprinkler(data);


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

    getHorticultureCouplerComponentListMiniSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GeHorticultureCouplerComponentList',
                srvparam: JSON.stringify({
                    HectareModel: data.HectareModel,
                    SpaceTypeId: data.SpaceTypeId,
                    SubsidySchemeId: data.SubsidySchemeId,
                }),
            },
        };
        console.log('GeHorticultureCouplerComponentList - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    console.log(' GeHorticultureCouplerComponentList res', res);
                    data.getHorticultureCouplerComponentListData = res[0].data;
                    self.dbService.addpostVerificationOfflineOfMiniSprinkler(data.ApplicationId, JSON.stringify(data));
                    // self.storage.get('dripApplicationsOffline').then((val) => {
                    //     if (val) {
                    //         console.log("val if ", val);
                    //         var temp = [];
                    //         temp = val;
                    //         for (var a = 0; a < temp.length; a++) {
                    //             self.httpClient.dismissLoading();
                    //             if (data.ApplicationId != temp[a].applicationId) {
                    //                 temp.push({ applicationId: data.ApplicationId, applicationData: data })
                    //                 self.storage.set('dripApplicationsOffline',temp).then((res) => {
                    //                     console.log('res', res);
                    //                     self.httpClient.showToast('This application is saved for Offline');
                    //                 })
                    //             }

                    //         }

                    //     }
                    //     else {

                    //         console.log("val else ", val);
                    //         self.storage.set('dripApplicationsOffline', [{ applicationId: data.ApplicationId, applicationData: data }]).then((res) => {
                    //             console.log('res', res);
                    //             self.httpClient.dismissLoading();
                    //         })
                    //     }
                    // })

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GeHorticultureCouplerComponentList',
                        srvparam: JSON.stringify({
                            HectareModel: data.HectareModel,
                            SpaceTypeId: data.SpaceTypeId,
                            SubsidySchemeId: data.SubsidySchemeId,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    submitBasicDataOfMiniSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddDripIrrigationPostVerification',
                srvparam: JSON.stringify(data.basicDataSubmission)
            },
        };
        console.log('AddSprinklerPostVerification - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' AddSprinklerPostVerification res', res);
                if (res[0].status == 0) {
                    self.uploadBillDetailsofMiniSprinkler(data, res[0].data[0].PostVerificationId, 0);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddDripIrrigationPostVerification',
                        srvparam: JSON.stringify(data.basicDataSubmission)
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadBillsApiOfMiniSprinkler(data, postverificationId, param) {
        console.log('postverificationId', postverificationId);
        console.log('uploadBillsApi(data', data);
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationBillOneByOne',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    PostVerificationId: postverificationId,
                    userid: self.httpClient.userData.userid,
                    SubsidySchemeId: this.subsidyId,
                    BillNo: data.billDetails[param].BillNo,
                    BillAmount: data.billDetails[param].BillAmount,
                    BillImg: data.billDetails[param].BillImg,
                    BillDate: data.billDetails[param].BillDate,
                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    if (param == data.billDetails.length - 1) {
                        self.uploadFirstPhotoOfMiniSprinkler(data, postverificationId);
                    } else {
                        self.uploadBillsApiOfMiniSprinkler(data, postverificationId, param + 1);
                    }

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationBillOneByOne',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            PostVerificationId: postverificationId,
                            userid: self.httpClient.userData.userid,
                            SubsidySchemeId: self.subsidyId,
                            BillNo: data.billDetails[param].BillNo,
                            BillAmount: data.billDetails[param].BillAmount,
                            BillImg: data.billDetails[param].BillImg,
                            BillDate: data.billDetails[param].BillDate,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );


    }

    finalSubmissionOfMiniSprinkler(data) {
        var self = this;
        var sendRequestData = data.finalSubmission;

        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    console.log(res);
                    self.dbService.storage.executeSql('DELETE FROM postVerificationOfflineOfMiniSprinkler WHERE ApplicationId = ?', [data.ApplicationId]).then((_) => {
                        self.successAlertFinalSubmission();

                    })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'FinalSubmissionPostVerification',
                        srvparam: data.finalSubmission,
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadSeventhPhotoOfMini(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfCompomnentTable;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.CompomnentTable, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.finalSubmissionOfMiniSprinkler(data);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSixthPhotoOfMini(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgWarrantyCard;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgWarrantyCard, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSeventhPhotoOfMini(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSixthPhotoOfMiniSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgWarrantyCard;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgWarrantyCard, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSixthPhotoOfMini(data, postverificationId);

                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFifthPhotoOfMiniSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgTriPartyAgreement;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgTriPartyAgreement, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSixthPhotoOfMiniSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFourthPhotoOfMiniSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgFarmerWithOfficer2;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgFarmerWithOfficer2, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadFifthPhotoOfMiniSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadThirdPhotoOfMiniSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgFarmerWithOfficer;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgFarmerWithOfficer, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadFourthPhotoOfMiniSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSecondPhotoOfMiniSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgDripBrandName2;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgDripBrandName2, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadThirdPhotoOfMiniSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFirstPhotoOfMiniSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgDripBrandName1;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgDripBrandName1, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSecondPhotoOfMiniSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadBillDetailsofMiniSprinkler(data, postverificationId, param) {
        console.log(' ApplicationId bill', postverificationId);
        console.log(' data.billDetails[param].BillImg', data.billDetails[param].BillImg);
        var self = this;
        this.fileTransfer
            .upload(data.billDetails[param].BillImg, this.httpClient.imageUploadUrl, data.billDetails[param].options)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    console.log('index', param);
                    console.log('data.billDetails.length', data.billDetails.length);
                    console.log('dataTwo.response', dataTwo.response);
                    var temp = JSON.parse(dataTwo.response);
                    data.billDetails[param].BillImg = temp[0].data;
                    if (param == data.billDetails.length - 1) {
                        console.log('in chaek');
                        self.uploadBillsApiOfMiniSprinkler(data, postverificationId, 0);
                    } else {
                        self.uploadBillDetailsofMiniSprinkler(data, postverificationId, param + 1);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );


    }

    uploadimgOfConsentLetterOfMiniSprinkler(data) {
        this.httpClient.showLoading();
        this.fileTransfer.upload(data.imgOfConsentLetter, this.httpClient.imageUploadUrl, data.optionsOfimgOfConsentLetter).then((dataa) => {
                var temp = JSON.parse(dataa.response);
                console.log('temp[0].data', temp[0].data);
                if (temp[0].data) {
                    data.basicDataSubmission.ImgConsentLetter = temp[0].data;
                    this.submitBasicDataOfMiniSprinkler(data);
                } else {
                    this.httpClient.showToastError();
                }
            },
            (err) => {
                // error

                this.httpClient.dismissLoading();
                this.httpClient.showToastError();
                console.log('err', err);
            }
        );
    }

    /*MINI SPRINKLER END*/


    /*MICRO SPRINKLER*/
    uploadimgOfPreAvailedSubsidyMicroSprinkler(data) {
        this.httpClient.showLoading();
        var tempArray = [];
        tempArray = data.prevAvailedSubsidyArray;
        for (let i = 0; i < tempArray.length; i++) {
            this.fileTransfer.upload(tempArray[i].ProofDoc, this.httpClient.imageUploadUrl, data.OptionsOfProofDoc).then((dataa) => {
                    var temp = JSON.parse(dataa.response);
                    console.log('temp[0].data', temp[0].data);
                    if (temp[0].data) {
                        data.basicDataSubmission.PrevAvailedSubsidyArray[i].ProofDoc = temp[0].data;
                        if (i == tempArray.length - 1) {
                            this.submitBasicDataOfMicroSprinkler(data);
                        }
                        // this.submitBasicDataOfDrip(data);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                });
        }


    }

    getHorticultureManufactureListDataMicroSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHorticultureManufactureList',
                srvparam: '{}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    data.getHorticultureManufactureData = res[0].data;
                    self.getHorticultureManufactureDealerListMicroSprinkler(data);


                } else {
                    self.showPrompt(res[0].data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetHorticultureManufactureList',
                        srvparam: '{}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getHorticultureManufactureDealerListMicroSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetHorticultureManufactureDealerList',
                srvparam:
                    '{\'HorticultureManufactureId\':\'' +
                    -1 +
                    '\',\'ProductTypeId\':\'' +
                    2 +
                    '\'}',
            },
        };
        console.log('GetHorticultureManufactureDealerList - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' GetHorticultureManufactureDealerList res', res);

                if (res[0].status == 0) {
                    data.getHorticultureManufactureDealerListData = res[0].data;
                    self.getISILISTMicroSprinkler(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetHorticultureManufactureDealerList',
                        srvparam:
                            '{\'HorticultureManufactureId\':\'' +
                            -1 +
                            '\',\'ProductTypeId\':\'' +
                            2 +
                            '\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getISILISTMicroSprinkler(data) {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetISIMarkList',
                srvparam: '{\'SubsidySchemeId\':\'10\'}',
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
                // self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    data.listOfISIMarks = res[0].data;
                    self.getGetPVOptionalItemListMicroSprinkler(data);
                    // self.getHorticultureCouplerComponentListMicroSprinkler(data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetISIMarkList',
                        srvparam: '{\'SubsidySchemeId\':\'10\'}',
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getGetPVOptionalItemListMicroSprinkler(data) {

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
            function(res: any) {
                console.log(' GetPVOptionalItemList res', res);
                self.httpClient.dismissLoading();

                if (res[0].status == 0) {
                    data.getPVOptionalItemListData = res[0].data;
                    console.log('getPVOptionalItemListData ---RS----', data.getPVOptionalItemListData);

                    self.getHorticultureCouplerComponentListMicroSprinkler(data);


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

    getHorticultureCouplerComponentListMicroSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GeHorticultureCouplerComponentList',
                srvparam: JSON.stringify({
                    HectareModel: data.HectareModel,
                    SpaceTypeId: data.SpaceTypeId,
                    SubsidySchemeId: data.SubsidySchemeId,
                }),
            },
        };
        console.log('GeHorticultureCouplerComponentList - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    console.log(' GeHorticultureCouplerComponentList res', res);
                    data.getHorticultureCouplerComponentListData = res[0].data;
                    self.dbService.addpostVerificationOfflineOfMicroSprinkler(data.ApplicationId, JSON.stringify(data));


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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GeHorticultureCouplerComponentList',
                        srvparam: JSON.stringify({
                            HectareModel: data.HectareModel,
                            SpaceTypeId: data.SpaceTypeId,
                            SubsidySchemeId: data.SubsidySchemeId,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }


    submitBasicDataOfMicroSprinkler(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddDripIrrigationPostVerification',
                srvparam: JSON.stringify(data.basicDataSubmission)
            },
        };
        console.log('AddSprinklerPostVerification - ', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log(' AddSprinklerPostVerification res', res);
                if (res[0].status == 0) {
                    self.uploadBillDetailsofMicroSprinkler(data, res[0].data[0].PostVerificationId, 0);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddDripIrrigationPostVerification',
                        srvparam: JSON.stringify(data.basicDataSubmission)
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadBillsApiOfMicroSprinkler(data, postverificationId, param) {
        console.log('postverificationId', postverificationId);
        console.log('uploadBillsApi(data', data);
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationBillOneByOne',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    PostVerificationId: postverificationId,
                    userid: self.httpClient.userData.userid,
                    SubsidySchemeId: this.subsidyId,
                    BillNo: data.billDetails[param].BillNo,
                    BillAmount: data.billDetails[param].BillAmount,
                    BillImg: data.billDetails[param].BillImg,
                    BillDate: data.billDetails[param].BillDate,
                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    if (param == data.billDetails.length - 1) {
                        self.uploadFirstPhotoOfMicroSprinkler(data, postverificationId);
                    } else {
                        self.uploadBillsApiOfMicroSprinkler(data, postverificationId, param + 1);
                    }

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationBillOneByOne',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            PostVerificationId: postverificationId,
                            userid: self.httpClient.userData.userid,
                            SubsidySchemeId: self.subsidyId,
                            BillNo: data.billDetails[param].BillNo,
                            BillAmount: data.billDetails[param].BillAmount,
                            BillImg: data.billDetails[param].BillImg,
                            BillDate: data.billDetails[param].BillDate,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );


    }

    finalSubmissionOfMicroSprinkler(data) {
        var self = this;
        var sendRequestData = data.finalSubmission;

        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    console.log(res);
                    self.dbService.storage.executeSql('DELETE FROM postVerificationOfflineOfMicroSprinkler WHERE ApplicationId = ?', [data.ApplicationId]).then((_) => {
                        self.successAlertFinalSubmission();

                    })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'FinalSubmissionPostVerification',
                        srvparam: data.finalSubmission,
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadSeventhPhotoOfMicroSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfCompomnentTable;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.CompomnentTable, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.finalSubmissionOfMicroSprinkler(data);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSixthPhotoOfMicroSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgWarrantyCard;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgWarrantyCard, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSeventhPhotoOfMicroSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFifthPhotoOfMicroSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgTriPartyAgreement;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgTriPartyAgreement, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSixthPhotoOfMicroSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFourthPhotoOfMicroSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgFarmerWithOfficer2;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgFarmerWithOfficer2, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadFifthPhotoOfMicroSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadThirdPhotoOfMicroSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgFarmerWithOfficer;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgFarmerWithOfficer, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadFourthPhotoOfMicroSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSecondPhotoOfMicroSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgDripBrandName2;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgDripBrandName2, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadThirdPhotoOfMicroSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFirstPhotoOfMicroSprinkler(data, postverificationId) {
        console.log('data', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfImgDripBrandName1;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.ImgDripBrandName1, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSecondPhotoOfMicroSprinkler(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadBillDetailsofMicroSprinkler(data, postverificationId, param) {
        console.log(' ApplicationId bill', postverificationId);
        console.log(' data.billDetails[param].BillImg', data.billDetails[param].BillImg);
        var self = this;
        this.fileTransfer
            .upload(data.billDetails[param].BillImg, this.httpClient.imageUploadUrl, data.billDetails[param].options)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    console.log('index', param);
                    console.log('data.billDetails.length', data.billDetails.length);
                    console.log('dataTwo.response', dataTwo.response);
                    var temp = JSON.parse(dataTwo.response);
                    data.billDetails[param].BillImg = temp[0].data;
                    if (param == data.billDetails.length - 1) {
                        console.log('in chaek');
                        self.uploadBillsApiOfMicroSprinkler(data, postverificationId, 0);
                    } else {
                        self.uploadBillDetailsofMicroSprinkler(data, postverificationId, param + 1);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );


    }

    uploadimgOfConsentLetterOfMicroSprinkler(data) {
        this.httpClient.showLoading();
        this.fileTransfer.upload(data.imgOfConsentLetter, this.httpClient.imageUploadUrl, data.optionsOfimgOfConsentLetter).then((dataa) => {
                var temp = JSON.parse(dataa.response);
                console.log('temp[0].data', temp[0].data);
                if (temp[0].data) {
                    data.basicDataSubmission.ImgConsentLetter = temp[0].data;
                    this.submitBasicDataOfMicroSprinkler(data);
                } else {
                    this.httpClient.showToastError();
                }
            },
            (err) => {
                // error

                this.httpClient.dismissLoading();
                this.httpClient.showToastError();
                console.log('err', err);
            }
        );
    }

    /*MICRO SPRINKLER END*/

    submitNoCaseFirstPhotomWaterTank(data) {
        var self = this;
        self.httpClient.showLoading();
        this.fileTransfer
            .upload(data.photoFarmerApprovalCertificateNoCase, this.httpClient.imageUploadUrl, data.optionOfphotoFarmerWithOfficerNoCase)
            .then(
                (dataTwo) => {
                    var temp = JSON.parse(dataTwo.response);
                    data.finalSubmission.ImgFarmerWithOfficer = temp[0].data;
                    self.submitNoCaseSecondPhotomWaterTank(data);

                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    submitNoCaseSecondPhotomWaterTank(data) {
        var self = this;
        this.fileTransfer
            .upload(data.photoFarmerApprovalCertificateNoCase, this.httpClient.imageUploadUrl, data.optionOfphotoFarmerApprovalCertificateNoCase)
            .then(
                (dataTwo) => {
                    var temp = JSON.parse(dataTwo.response);
                    data.finalSubmission.NotAcceptanceDocPath = temp[0].data;
                    self.submitNoCaseFinalWaterTank(data);

                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    submitNoCaseFinalWaterTank(data) {
        var self = this;
        var sendRequestDataTwo = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddWaterStorageTankPostVerification',
                srvparam: JSON.stringify(data.finalSubmission),
            },
        };

        this.httpClient.post(sendRequestDataTwo).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.dbService.storage.executeSql('DELETE FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?', [data.ApplicationId]).then((_) => {
                        self.successAlertFinalSubmission();

                    })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddWaterStorageTankPostVerification',
                        srvparam: JSON.stringify(data.finalSubmission),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    submitYesFormWaterTank(data) {
        var self = this;
        var sendRequestData = data.sendRequestDataOffline;

        console.log('sendRequestData', sendRequestData);
        self.httpClient.showLoading();
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    console.log(
                        ' res[0].data[0].PostVerificationId',
                        res[0].data[0].PostVerificationId
                    );
                    self.uploadBillDetailsWaterTank(data, res[0].data[0].PostVerificationId, 0);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddWaterStorageTankPostVerification',
                        srvparam: JSON.stringify(data.sendRequestDataOffline),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadBillDetailsWaterTank(data, postverificationId, param) {
        console.log(' ApplicationId bill', postverificationId);
        console.log(' data.billDetails[param].BillImg', data.billDetails[param].BillImg);
        var self = this;
        this.fileTransfer
            .upload(data.billDetails[param].BillImg, this.httpClient.imageUploadUrl, data.billDetails[param].options)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    console.log('index', param);
                    console.log('data.billDetails.length', data.billDetails.length);
                    console.log('dataTwo.response', dataTwo.response);
                    var temp = JSON.parse(dataTwo.response);
                    data.billDetails[param].BillImg = temp[0].data;
                    if (param == data.billDetails.length - 1) {
                        console.log('in chaek');
                        self.uploadBillsApiWaterTank(data, postverificationId, 0);
                    } else {
                        self.uploadBillDetailsWaterTank(data, postverificationId, param + 1);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );


    }

    uploadBillsApiWaterTank(data, postverificationId, param) {
        console.log('postverificationId', postverificationId);
        console.log('uploadBillsApi(data', data);
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationBillOneByOne',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    PostVerificationId: postverificationId,
                    userid: self.httpClient.userData.userid,
                    SubsidySchemeId: this.subsidyId,
                    BillNo: data.billDetails[param].BillNo,
                    BillAmount: data.billDetails[param].BillAmount,
                    BillImg: data.billDetails[param].BillImg,
                    BillDate: data.billDetails[param].BillDate,
                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    if (param == data.billDetails.length - 1) {
                        // console.log("in chaek");
                        // if (data.SubsidySchemeId == '1') {
                        //     self.uploadPhoto1FarmPond(data, postverificationId);
                        // } else if (data.SubsidySchemeId == '4') {
                        //     self.uploadPhoto1Diggi(data, postverificationId);
                        // }
                        self.uploadFirstPhotoOfWaterTank(data, postverificationId);
                    } else {
                        self.uploadBillsApiWaterTank(data, postverificationId, param + 1);
                    }

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationBillOneByOne',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            PostVerificationId: postverificationId,
                            userid: self.httpClient.userData.userid,
                            SubsidySchemeId: this.subsidyId,
                            BillNo: data.billDetails[param].BillNo,
                            BillAmount: data.billDetails[param].BillAmount,
                            BillImg: data.billDetails[param].BillImg,
                            BillDate: data.billDetails[param].BillDate,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );


    }

    uploadFirstPhotoOfWaterTank(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfPhotoFarmerWithOfficer;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photoFarmerWithOfficer, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadSecondPhotoOfWaterTank(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadSecondPhotoOfWaterTank(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfPhotoIrrigationBarSlip;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photoIrrigationBarSlip, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadThirdPhotoOfWaterTank(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadThirdPhotoOfWaterTank(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionOfPhotoIrrigationBarSlip;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photoIrrigationBarSlip, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        if (data.NakshaTrace) {
                            console.log('data.NakshaTrace', data.NakshaTrace);
                            this.uploadNakshaTrace(postverificationId, data);
                        } else {
                            this.finalSubmissionOfWaterTank(data);
                        }
                        // 
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    finalSubmissionOfWaterTank(data) {
        var self = this;
        var sendRequestDataTwo = data.finalSubmission;

        this.httpClient.post(sendRequestDataTwo).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.dbService.storage
                        .executeSql(
                            'DELETE FROM postVerificationOfflineOfWaterTank WHERE ApplicationId = ?',
                            [data.ApplicationId]
                        )
                        .then((_) => {
                            self.successAlertFinalSubmission();

                        })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'FinalSubmissionPostVerification',
                        srvparam: JSON.stringify(data.finalSubmission),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    finalSubmissionOfPipelineNoCase(data) {
        var self = this;
        var sendRequestDataTwo = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationPipeline',
                srvparam: JSON.stringify(data.finalSubmission),
            },
        };

        this.httpClient.post(sendRequestDataTwo).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.dbService.storage
                        .executeSql(
                            'DELETE FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?',
                            [data.ApplicationId]
                        )
                        .then((_) => {
                            self.successAlertFinalSubmission();

                        })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationPipeline',
                        srvparam: JSON.stringify(data.finalSubmission),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadImgFarmerWithOfficerNoCase(data) {
        var self = this;
        this.fileTransfer
            .upload(data.farmerAndOfficer, this.httpClient.imageUploadUrl, data.OptionOffarmerAndOfficer)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    var temp = JSON.parse(dataTwo.response);
                    console.log('temp', temp);
                    data.finalSubmission.ImgFarmerWithOfficer = temp[0].data;
                    this.finalSubmissionOfPipelineNoCase(data);
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadFarmerLetterOfDissentNoCase(data) {
        var self = this;
        this.httpClient.showLoading();
        this.fileTransfer
            .upload(data.fFarmerLetterOfDissent, this.httpClient.imageUploadUrl, data.OptionOffFarmerLetterOfDissent)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    var temp = JSON.parse(dataTwo.response);
                    console.log('temp', temp);
                    data.finalSubmission.ImgNotAcceptanceDoc = temp[0].data;
                    this.uploadImgFarmerWithOfficerNoCase(data);
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    finalSubmissionOfPipelineWithGranted(data) {
        var self = this;
        var sendRequestDataTwo = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationPipeline',
                srvparam: JSON.stringify(data.sendRequestData),
            },
        };

        this.httpClient.post(sendRequestDataTwo).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.dbService.storage
                        .executeSql(
                            'DELETE FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?',
                            [data.ApplicationId]
                        )
                        .then((_) => {
                            self.successAlertFinalSubmission();

                        })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationPipeline',
                        srvparam: JSON.stringify(data.sendRequestData),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadPhotoFarmerWithOfficerPreviousGranted(data) {
        var self = this;
        this.fileTransfer
            .upload(data.photoFarmerWithOfficerPreviousGranted, this.httpClient.imageUploadUrl, data.OptionOfphotoFarmerWithOfficerPreviousGranted)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    var temp = JSON.parse(dataTwo.response);
                    console.log('temp', temp);
                    data.sendRequestData.ImgFarmerWithOfficer = temp[0].data;
                    this.finalSubmissionOfPipelineWithGranted(data);
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadPhotoOfAffidavitPreviousGranted(data) {
        var self = this;
        self.httpClient.showLoading();
        this.fileTransfer
            .upload(data.PhotoOfAffidavitPreviousGranted, this.httpClient.imageUploadUrl, data.OptionOfPhotoOfAffidavitPreviousGranted)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    var temp = JSON.parse(dataTwo.response);
                    console.log('temp', temp);
                    data.sendRequestData.ImgAffidevitSubsidyGranted = temp[0].data;
                    this.uploadPhotoFarmerWithOfficerPreviousGranted(data);
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    diggiPhoto1NoCase(data) {

        this.httpClient.showLoading();
        this.fileTransfer.upload(data.photoFarmerWithOfficerNoCase, this.httpClient.imageUploadUrl, data.optionsOfPhotoFarmerWithOfficerNoCase).then((dataa) => {
                var temp = JSON.parse(dataa.response);
                console.log('temp[0].data', temp[0].data);
                if (temp[0].data) {
                    data.finalSubmission.ImgFarmerWithOfficer = temp[0].data;
                    this.diggiPhoto2NoCase(data);
                } else {
                    this.httpClient.showToastError();
                }
            },
            (err) => {
                // error

                this.httpClient.dismissLoading();
                this.httpClient.showToastError();
                console.log('err', err);
            }
        );
    }

    diggiPhoto2NoCase(data) {

        this.fileTransfer.upload(data.photoFarmerApprovalCertificate, this.httpClient.imageUploadUrl, data.optionsOfphotoFarmerApprovalCertificate).then((dataa) => {

                var temp = JSON.parse(dataa.response);
                console.log('temp[0].data', temp[0].data);
                if (temp[0].data) {
                    data.finalSubmission.NotAcceptanceDocPath = temp[0].data;
                    if (data.SubsidySchemeId == '1') {
                        this.submitNoFormFarmPond(data);
                    } else if (data.SubsidySchemeId == '4') {
                        this.submitNoFormDiggi(data);
                    } else if (data.SubsidySchemeId == '7') {
                        this.submitNoFormFarmImplement(data);
                    }
                } else {
                    this.httpClient.showToastError();
                }
            },
            (err) => {
                // error

                this.httpClient.dismissLoading();
                this.httpClient.showToastError();
                console.log('err', err);
            }
        );
    }

    submitNoFormFarmPond(data) {

        var self = this;

        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationDetail',
                srvparam: JSON.stringify(data.finalSubmission),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.httpClient.dismissLoading();
                    console.log(
                        'this.applicationNumberForOfflineDelete',
                        self.applicationNumberForOfflineDelete
                    );
                    self.dbService.storage
                        .executeSql(
                            'DELETE FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?',
                            [data.ApplicationId]
                        )
                        .then((_) => {
                            console.log(
                                'this.applicationNumberForOfflineDelete',
                                self.applicationNumberForOfflineDelete
                            );
                            self.successAlertFinalSubmission();
                        })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationDetail',
                        srvparam: JSON.stringify(data.finalSubmission),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    submitNoFormFarmImplement(data) {
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddFarmImplementPostVerification',
                srvparam: JSON.stringify(data.finalSubmission),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.httpClient.dismissLoading();
                    console.log(
                        'this.applicationNumberForOfflineDelete',
                        self.applicationNumberForOfflineDelete
                    );
                    self.dbService.storage
                        .executeSql(
                            'DELETE FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?',
                            [data.ApplicationId]
                        )
                        .then((_) => {
                            console.log(
                                'this.applicationNumberForOfflineDelete',
                                self.applicationNumberForOfflineDelete
                            );
                            self.successAlertFinalSubmission();
                        })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddFarmImplementPostVerification',
                        srvparam: JSON.stringify(data.finalSubmission),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    submitNoFormDiggi(data) {

        var self = this;

        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddDiggiPostVerification',
                srvparam: JSON.stringify(data.finalSubmission),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.httpClient.dismissLoading();
                    console.log(
                        'this.applicationNumberForOfflineDelete',
                        self.applicationNumberForOfflineDelete
                    );
                    self.dbService.storage
                        .executeSql(
                            'DELETE FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?',
                            [data.ApplicationId]
                        )
                        .then((_) => {
                            console.log(
                                'this.applicationNumberForOfflineDelete',
                                self.applicationNumberForOfflineDelete
                            );
                            self.successAlertFinalSubmission();
                        })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddDiggiPostVerification',
                        srvparam: JSON.stringify(data.finalSubmission),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    submitYesFormDiggi(data) {
        var self = this;
        var sendRequestData = data.sendRequestDataOffline;

        console.log('sendRequestData', sendRequestData);
        self.httpClient.showLoading();
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    console.log(
                        ' res[0].data[0].PostVerificationId',
                        res[0].data[0].PostVerificationId
                    );
                    self.uploadBillDetailsDiggi(data, res[0].data[0].PostVerificationId, 0);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddDiggiPostVerification',
                        srvparam: JSON.stringify(data.sendRequestDataOffline),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadBillDetailsDiggi(data, postverificationId, param) {
        console.log(' ApplicationId bill', postverificationId);
        console.log(' data.billDetails[param].BillImg', data.billDetails[param].BillImg);
        var self = this;
        this.fileTransfer
            .upload(data.billDetails[param].BillImg, this.httpClient.imageUploadUrl, data.billDetails[param].options)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    console.log('index', param);
                    console.log('data.billDetails.length', data.billDetails.length);
                    console.log('dataTwo.response', dataTwo.response);
                    var temp = JSON.parse(dataTwo.response);
                    data.billDetails[param].BillImg = temp[0].data;
                    if (param == data.billDetails.length - 1) {
                        console.log('in chaek');
                        self.uploadBillsApi(data, postverificationId, 0);
                    } else {
                        self.uploadBillDetailsDiggi(data, postverificationId, param + 1);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );


    }


    uploadBillsApi(data, postverificationId, param) {
        console.log('postverificationId', postverificationId);
        console.log('uploadBillsApi(data', data);
        var self = this;

        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationBillOneByOne',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    PostVerificationId: postverificationId,
                    userid: self.httpClient.userData.userid,
                    SubsidySchemeId: this.subsidyId,
                    BillNo: data.billDetails[param].BillNo,
                    BillAmount: data.billDetails[param].BillAmount,
                    BillImg: data.billDetails[param].BillImg,
                    BillDate: data.billDetails[param].BillDate,
                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    if (param == data.billDetails.length - 1) {
                        console.log('in chaek');
                        if (data.SubsidySchemeId == '1') {
                            self.uploadPhoto1FarmPond(data, postverificationId);
                        } else if (data.SubsidySchemeId == '4') {
                            self.uploadPhoto1Diggi(data, postverificationId);
                        } else if (data.SubsidySchemeId == '7') {
                            if (data.photoRCrenew) {
                                self.uploadphotoRCrenew(data, postverificationId);
                            } else {
                                self.photoImplemenWIthFarmer(data, postverificationId);
                            }

                        }
                    } else {
                        self.uploadBillsApi(data, postverificationId, param + 1);
                    }

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationBillOneByOne',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            PostVerificationId: postverificationId,
                            userid: self.httpClient.userData.userid,
                            SubsidySchemeId: this.subsidyId,
                            BillNo: data.billDetails[param].BillNo,
                            BillAmount: data.billDetails[param].BillAmount,
                            BillImg: data.billDetails[param].BillImg,
                            BillDate: data.billDetails[param].BillDate,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );


    }

    uploadphotoRCrenew(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionsOfphotoRCrenew;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photoRCrenew, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.photoFphotoRcRnewalReceipt(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    photoFphotoRcRnewalReceipt(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionsOfphotoRcRnewalReceipt;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photoFphotoRcRnewalReceipt, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.photoImplemenWIthFarmer(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    photoImplemenWIthFarmer(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionsOfphotoImplemenWIthFarmer;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photoImplemenWIthFarmer, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        if (data.NakshaTrace) {
                            console.log('data.NakshaTrace', data.NakshaTrace);
                            this.uploadNakshaTrace(postverificationId, data);
                        } else {
                            this.finalSubmissionOfYesDiggi(data);
                        }
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadPhoto1FarmPond(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionsOfphotophotoFarmerWithOfficer;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photophotophotoFarmerWithOfficer, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadPhoto2FarmPond(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadPhoto2FarmPond(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionsOfphotoKhasaraCertificate;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photophotoKhasaraCertificate, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadPhoto3FarmPond(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadPhoto3FarmPond(data, postverificationId) {
        console.log('farmpond1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionsOfphotoAffidavit;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photoAffidavit, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        if (data.NakshaTrace) {
                            console.log('data.NakshaTrace', data.NakshaTrace);
                            this.uploadNakshaTrace(postverificationId, data);
                        } else {
                            this.finalSubmissionOfYesDiggi(data);
                        }
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadPhoto1Diggi(data, postverificationId) {
        console.log('diggi1', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionsOfphotoAffidavit;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photoAffidavit, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataa) => {
                    // success
                    var temp = JSON.parse(dataa.response);
                    console.log('diggi1', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadPhoto2Diggi(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );

    }

    uploadPhoto2Diggi(data, postverificationId) {
        console.log('diggi2', data);
        console.log('postverificationId', postverificationId);
        var tempOption = data.optionsOfphotoKhasaraCertificate;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photophotoKhasaraCertificate, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (data2) => {
                    // success
                    var temp = JSON.parse(data2.response);
                    console.log('diggi2', temp[0].data);
                    if (temp[0].data[0].URL) {
                        this.uploadPhoto3Diggi(data, postverificationId);
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadPhoto3Diggi(data, postverificationId) {
        console.log('diggi3', data);
        console.log('postverificationId', postverificationId);

        var tempOption = data.optionsOfphotophotoFarmerWithOfficer;
        tempOption.params.id = postverificationId;
        this.fileTransfer
            .upload(data.photophotophotoFarmerWithOfficer, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (data4) => {
                    // success
                    var temp = JSON.parse(data4.response);
                    console.log('diggi3', temp[0].data);
                    if (temp[0].data[0].URL) {
                        if (data.NakshaTrace) {
                            console.log('data.NakshaTrace', data.NakshaTrace);
                            this.uploadNakshaTrace(postverificationId, data);
                        } else {
                            this.finalSubmissionOfYesDiggi(data);
                        }


                        // this.finalSubmissionOfYesDiggi(data)
                    } else {
                        this.httpClient.showToastError();
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    finalSubmissionOfYesDiggi(data) {
        console.log('data', data);
        var self = this;
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'FinalSubmissionPostVerification',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    userid: this.httpClient.userData.userid,
                    SubsidySchemeId: data.SubsidySchemeId,
                    roleid: self.httpClient.userData.roleid,
                }),
            },
        };

        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    self.httpClient.dismissLoading();
                    console.log(
                        'this.applicationNumberForOfflineDelete',
                        self.applicationNumberForOfflineDelete
                    );
                    if (data.SubsidySchemeId == '1') {
                        self.dbService.storage
                            .executeSql(
                                'DELETE FROM postVerificationOfflineOfFarmpond WHERE ApplicationId = ?',
                                [data.ApplicationId]
                            )
                            .then((_) => {
                                console.log(
                                    'this.applicationNumberForOfflineDelete',
                                    self.applicationNumberForOfflineDelete
                                );
                                self.successAlertFinalSubmission();
                            })
                            .catch((err) => {
                                console.log('err', err);
                            });
                    } else if (data.SubsidySchemeId == '4') {
                        self.dbService.storage
                            .executeSql(
                                'DELETE FROM postVerificationOfflineOfDiggi WHERE ApplicationId = ?',
                                [data.ApplicationId]
                            )
                            .then((_) => {
                                console.log(
                                    'this.applicationNumberForOfflineDelete',
                                    self.applicationNumberForOfflineDelete
                                );
                                self.successAlertFinalSubmission();
                            })
                            .catch((err) => {
                                console.log('err', err);
                            });
                    } else if (data.SubsidySchemeId == '7') {
                        self.dbService.storage
                            .executeSql(
                                'DELETE FROM postVerificationOfflineOfFarmImplement WHERE ApplicationId = ?',
                                [data.ApplicationId]
                            )
                            .then((_) => {
                                console.log(
                                    'this.applicationNumberForOfflineDelete',
                                    self.applicationNumberForOfflineDelete
                                );
                                self.successAlertFinalSubmission();
                            })
                            .catch((err) => {
                                console.log('err', err);
                            });
                    } else if (data.SubsidySchemeId == '5') {
                        self.dbService.storage
                            .executeSql(
                                'DELETE FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?',
                                [data.ApplicationId]
                            )
                            .then((_) => {
                                self.successAlertFinalSubmission();
                                console.log(
                                    'this.applicationNumberForOfflineDelete',
                                    self.applicationNumberForOfflineDelete
                                );

                            })
                            .catch((err) => {
                                console.log('err', err);
                            });
                    }

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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'FinalSubmissionPostVerification',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            userid: this.httpClient.userData.userid,
                            SubsidySchemeId: data.SubsidySchemeId,
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

    submitNoFormOfPipeline(mobilToVerify, tempDataOfPipeline) {
        console.log('no case ', tempDataOfPipeline);
        var self = this;
        self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationPipeline',
                srvparam: JSON.stringify({
                    ApplicationId: tempDataOfPipeline.ApplicationId,
                    mobilToVerify: mobilToVerify,
                    IsFarmerAcceptance: 'No',
                    IsSubsidyGranted: 'No',
                    UserId: this.httpClient.userData.userid,
                    latitude: tempDataOfPipeline.lat,
                    longitude: tempDataOfPipeline.lng,
                    Remarks: '',
                    RoleId: self.httpClient.userData.roleid,
                    SubsidySchemeId: tempDataOfPipeline.SubsidySchemeId,
                    ImgFarmerWithOfficer: tempDataOfPipeline.farmerAndOfficer,
                    ImgFarmerWithOfficerDate: tempDataOfPipeline.farmerAndOfficerDateTime,
                    ImgNotAcceptanceDoc: tempDataOfPipeline.fFarmerLetterOfDissent,
                    ImgNotAcceptanceDocDate:
                    tempDataOfPipeline.fFarmerLetterOfDissentDateTime,
                    ImgAffidevitSubsidyGranted: '',
                    ImgAffidevitSubsidyGrantedDate: '',
                    PipelineTypeId: '0',
                    PostVerificationKhasraNo: '',
                    Dimeter: '',
                    BrandId: '0',
                    CompanyId: '0',
                    ManufacturingYear: '',
                    ManufacturingBatchNo: '',
                    ISINo: '',
                    CMLNo: '',
                    PipelineLength: '0',
                    ImgfarmerwithSourceIrri: '',
                    TotalAmount: '0',
                    AppVersion: 'V.' + this.httpClient.currentAppVersion,
                    IsOnline_Offline: 1,
                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationPipeline',
                        srvparam: JSON.stringify({
                            ApplicationId: tempDataOfPipeline.ApplicationId,
                            mobilToVerify: mobilToVerify,
                            IsFarmerAcceptance: 'No',
                            IsSubsidyGranted: 'No',
                            UserId: this.httpClient.userData.userid,
                            latitude: tempDataOfPipeline.lat,
                            longitude: tempDataOfPipeline.lng,
                            Remarks: '',
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: tempDataOfPipeline.SubsidySchemeId,
                            ImgFarmerWithOfficer: tempDataOfPipeline.farmerAndOfficer,
                            ImgFarmerWithOfficerDate: tempDataOfPipeline.farmerAndOfficerDateTime,
                            ImgNotAcceptanceDoc: tempDataOfPipeline.fFarmerLetterOfDissent,
                            ImgNotAcceptanceDocDate:
                            tempDataOfPipeline.fFarmerLetterOfDissentDateTime,
                            ImgAffidevitSubsidyGranted: '',
                            ImgAffidevitSubsidyGrantedDate: '',
                            PipelineTypeId: '0',
                            PostVerificationKhasraNo: '',
                            Dimeter: '',
                            BrandId: '0',
                            CompanyId: '0',
                            ManufacturingYear: '',
                            ManufacturingBatchNo: '',
                            ISINo: '',
                            CMLNo: '',
                            PipelineLength: '0',
                            ImgfarmerwithSourceIrri: '',
                            TotalAmount: '0',
                            AppVersion: 'V.' + this.httpClient.currentAppVersion,
                            IsOnline_Offline: 1,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    submitDataOfPipelineSubsidyGranted(mobilToVerify, data) {
        var self = this;
        console.log('data', data);
        self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationPipeline',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    mobilToVerify: mobilToVerify,
                    IsFarmerAcceptance: 'Yes',
                    IsSubsidyGranted: 'Yes',
                    UserId: this.httpClient.userData.userid,
                    latitude: data.lat,
                    longitude: data.lng,
                    Remarks: '',
                    GrantedYear: new Date(data.previousGrantYear).getFullYear(),
                    RoleId: self.httpClient.userData.roleid,
                    SubsidySchemeId: data.SubsidySchemeId,
                    ImgFarmerWithOfficer: data.photoFarmerWithOfficerPreviousGranted,
                    ImgFarmerWithOfficerDate:
                    data.photoFarmerWithOfficerPreviousGrantedDateTime,
                    ImgNotAcceptanceDoc: '',
                    ImgNotAcceptanceDocDate: '',
                    ImgAffidevitSubsidyGranted: data.PhotoOfAffidavitPreviousGranted,
                    ImgAffidevitSubsidyGrantedDate:
                    data.PhotoOfAffidavitPreviousGrantedDateTIme,
                    PipelineTypeId: '0',
                    PostVerificationKhasraNo: '',
                    Dimeter: '',
                    BrandId: '0',
                    CompanyId: '0',
                    ManufacturingYear: '',
                    ManufacturingBatchNo: '',
                    ISINo: '',
                    CMLNo: '',
                    PipelineLength: '0',
                    ImgfarmerwithSourceIrri: '',
                    TotalAmount: '0',
                    AppVersion: 'V.' + this.httpClient.currentAppVersion,
                    IsOnline_Offline: 1,
                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.httpClient.dismissLoading();
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationPipeline',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            mobilToVerify: mobilToVerify,
                            IsFarmerAcceptance: 'Yes',
                            IsSubsidyGranted: 'Yes',
                            UserId: this.httpClient.userData.userid,
                            latitude: data.lat,
                            longitude: data.lng,
                            Remarks: '',
                            GrantedYear: new Date(data.previousGrantYear).getFullYear(),
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: data.SubsidySchemeId,
                            ImgFarmerWithOfficer: data.photoFarmerWithOfficerPreviousGranted,
                            ImgFarmerWithOfficerDate:
                            data.photoFarmerWithOfficerPreviousGrantedDateTime,
                            ImgNotAcceptanceDoc: '',
                            ImgNotAcceptanceDocDate: '',
                            ImgAffidevitSubsidyGranted: data.PhotoOfAffidavitPreviousGranted,
                            ImgAffidevitSubsidyGrantedDate:
                            data.PhotoOfAffidavitPreviousGrantedDateTIme,
                            PipelineTypeId: '0',
                            PostVerificationKhasraNo: '',
                            Dimeter: '',
                            BrandId: '0',
                            CompanyId: '0',
                            ManufacturingYear: '',
                            ManufacturingBatchNo: '',
                            ISINo: '',
                            CMLNo: '',
                            PipelineLength: '0',
                            ImgfarmerwithSourceIrri: '',
                            TotalAmount: '0',
                            AppVersion: 'V.' + this.httpClient.currentAppVersion,
                            IsOnline_Offline: 1,
                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    submitDataOfPipelineSubsidyNotGranted(data) {

        var self = this;
        var sendRequestData = data.sendRequestData;
        console.log('sendRequestData', sendRequestData);
        self.httpClient.showLoading();
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    self.billUploadOfPipeline(res[0].data[0].PostVerificationId, data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationPipeline',
                        srvparam: JSON.stringify(data.sendRequestData),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    billUploadOfPipeline(PostVerificationId, data) {
        console.log(' ApplicationId bill', PostVerificationId);
        console.log(' data.billDetails[param].BillImg', data.billDetails[0].BillImg);
        var self = this;
        this.fileTransfer
            .upload(data.billDetails[0].BillImg, this.httpClient.imageUploadUrl, data.billDetails[0].options)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    var temp = JSON.parse(dataTwo.response);
                    console.log('temp', temp);
                    data.billDetails[0].BillImg = temp[0].data;

                    console.log('data.billDetails[0].BillImg', data.billDetails[0].BillImg);
                    self.uploadBillsApiPipeline(data, PostVerificationId);

                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );

    }

    uploadBillsApiPipeline(data, PostVerificationId) {
        var self = this;
        self.httpClient.showLoading();

        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'AddPostVerificationBillOneByOne',
                srvparam: JSON.stringify({
                    ApplicationId: data.ApplicationId,
                    PostVerificationId: PostVerificationId,
                    userid: self.httpClient.userData.userid,
                    SubsidySchemeId: data.SubsidySchemeId,
                    BillNo: data.billDetails[0].BillNo,
                    BillAmount: data.billDetails[0].BillAmount,
                    BillImg: data.billDetails[0].BillImg,
                    BillDate: data.billDetails[0].BillDate,

                }),
            },
        };
        console.log('sendRequestData', sendRequestData);
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    console.log('till bill done');

                    self.uploadVendorCertificate(PostVerificationId, data);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationBillOneByOne',
                        srvparam: JSON.stringify({
                            ApplicationId: data.ApplicationId,
                            PostVerificationId: PostVerificationId,
                            userid: self.httpClient.userData.userid,
                            SubsidySchemeId: data.SubsidySchemeId,
                            BillNo: data.billDetails[0].BillNo,
                            BillAmount: data.billDetails[0].BillAmount,
                            BillImg: data.billDetails[0].BillImg,
                            BillDate: data.billDetails[0].BillDate,

                        }),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadfarmerAndOfficerWithIrrigationSource(PostVerificationId, data) {
        var tempOption = data.optionOffarmerAndOfficerWithIrrigationSource;
        tempOption.params.id = PostVerificationId;
        var self = this;
        this.fileTransfer
            .upload(data.farmerAndOfficerWithIrrigationSource, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataTwo) => {
                    self.uploadphotoOfNazriyaNaksha(PostVerificationId, data);

                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadfarmerAndOfficerAtTheEndPointOfPipeline(PostVerificationId, data) {
        var tempOption = data.optionOffarmerAndOfficerAtTheEndPointOfPipeline;
        tempOption.params.id = PostVerificationId;
        var self = this;
        this.fileTransfer
            .upload(data.farmerAndOfficerAtTheEndPointOfPipeline, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataTwo) => {
                    self.uploadfarmerAndOfficerWithIrrigationSource(PostVerificationId, data);

                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadVendorCertificate(PostVerificationId, data) {
        var tempOption = data.optionOfauthorizedVendorCertificate;
        tempOption.params.id = PostVerificationId;
        var self = this;
        this.fileTransfer
            .upload(data.authorizedVendorCertificate, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataTwo) => {
                    self.uploadfarmerAndOfficerAtTheEndPointOfPipeline(PostVerificationId, data);

                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );


    }

    uploadJamabandi(PostVerificationId, data, index) {
        console.log('data.jamabandiArray[index]', index, data.jamabandiArray[index].jamabandiOption);
        var tempOption = data.jamabandiArray[index].jamabandiOption;
        console.log('data.jamabandiArray[index].jamabandiOption', data.jamabandiArray[index].jamabandiOption);
        var self = this;
        this.fileTransfer
            .upload(data.jamabandiArray[index].jamabandiImageData, this.httpClient.imageUploadUrlForJamaBandi, tempOption)
            .then(
                (dataTwo) => {
                    console.log('jamanbandi', dataTwo);

                    // if (data.jamabandiArray.length > index) {
                    if (index == data.jamabandiArray.length - 1) {
                        if (this.subsidyId == 6) {
                            this.finalSubmissionOfWaterTank(data);
                        } else {
                            this.finalSubmissionOfYesDiggi(data);
                        }
                    } else {
                        self.uploadJamabandi(PostVerificationId, data, index + 1);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadNakshaTrace(PostVerificationId, data) {
        var tempOption = data.NakshaTrace.nakshaTraceOptions;
        // tempOption.params.id = PostVerificationId;
        var self = this;
        this.fileTransfer
            .upload(data.NakshaTrace.nakshaTraceImage, this.httpClient.imageUploadUrlForJamaBandi, tempOption)
            .then(
                (dataTwo) => {
                    console.log('NakshaTrace', dataTwo);
                    if (data.jamabandiArray) {
                        self.uploadJamabandi(PostVerificationId, data, 0);
                    } else {
                        self.finalSubmissionYesOfPipeline(data);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    uploadphotoOfNazriyaNaksha(PostVerificationId, data) {
        console.log('upload najariya naksha');
        var tempOption = data.optionOfphotoOfNazriyaNaksha;
        tempOption.params.id = PostVerificationId;
        var self = this;
        this.fileTransfer
            .upload(data.photoOfNazriyaNaksha, this.httpClient.imageUploadUrl, tempOption)
            .then(
                (dataTwo) => {


                    console.log('moving to final');
                    if (data.NakshaTrace) {
                        console.log('data.NakshaTrace', data.NakshaTrace);
                        self.uploadNakshaTrace(PostVerificationId, data);
                    } else {
                        self.finalSubmissionYesOfPipeline(data);
                    }

                    // }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );
    }

    finalSubmissionYesOfPipeline(data) {

        var self = this;
        var sendRequestData = data.finalSubmission;
        console.log('sendRequestData', sendRequestData);

        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    self.dbService.storage
                        .executeSql(
                            'DELETE FROM postVpipelineIrrigationAllData WHERE ApplicationId = ?',
                            [data.ApplicationId]
                        )
                        .then((_) => {
                            self.successAlertFinalSubmission();
                            console.log(
                                'this.applicationNumberForOfflineDelete',
                                self.applicationNumberForOfflineDelete
                            );

                        })
                        .catch((err) => {
                            console.log('err', err);
                        });
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'FinalSubmissionPostVerification',
                        srvparam: JSON.stringify(data.finalSubmission),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }


    submitYesForm(data) {

        var self = this;
        var sendRequestData = data.sendRequestDataOffline;
        console.log('sendRequestData', sendRequestData);
        self.httpClient.showLoading();
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                if (res[0].status == 0) {
                    if (data.SubsidySchemeId == 1) {

                    }
                    self.uploadBillDetails(data, res[0].data[0].PostVerificationId, 0);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddPostVerificationDetail',
                        srvparam: JSON.stringify(data.sendRequestDataOffline),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    uploadBillDetails(data, PostVerificationId, param) {
        console.log(' ApplicationId bill', PostVerificationId);
        console.log(' data.billDetails[param].BillImg', data.billDetails[param].BillImg);
        var self = this;
        this.fileTransfer
            .upload(data.billDetails[param].BillImg, this.httpClient.imageUploadUrl, data.billDetails[param].options)
            .then(
                (dataTwo) => {
                    console.log('dataTwo', dataTwo);
                    console.log('index', param);
                    console.log('data.billDetails.length', data.billDetails.length);
                    console.log('dataTwo.response', dataTwo.response);
                    var temp = JSON.parse(dataTwo.response);
                    data.billDetails[param].BillImg = temp[0].data;
                    if (param == data.billDetails.length - 1) {
                        console.log('in chaek');
                        self.uploadBillsApi(data, PostVerificationId, 0);
                    } else {
                        self.uploadBillDetails(data, PostVerificationId, param + 1);
                    }
                },
                (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    this.httpClient.showToastError();
                    console.log('err', err);
                }
            );


    }

}
