import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { DatabaseServiceService } from "../services/database-service.service";

import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

@Component({
    selector: "app-subsidy-detail",
    templateUrl: "./subsidy-detail.page.html",
    styleUrls: ["./subsidy-detail.page.scss"],
})
export class SubsidyDetailPage {
    val: any = "1";
    farmerPhoto: any = "";
    preVerificationListData: any = [];
    preVerificationListDataTwo: any = [];

    farmerNameHnd: any;
    roleId: any;
    userid: any;
    subsidyId: any;
    fileTransfer: any;
    counter: number;
    listLength = false;
    formPondList: Array<any>;
    cast: any='';
    castData: any=[
        {
            id:'GEN',
            name:'GEN',
            nameH:'सामान्य'
        },
        {
            id:'SC',
            name:'SC',
            nameH:'अनुसूचित जाति'
        },
        {
            id:'ST',
            name:'ST',
            nameH:'अनुसूचित जनजाति'
        },
    ];

    constructor(
        private transfer: FileTransfer,
        public alertController: AlertController,
        public platform: Platform,
        public dbService: DatabaseServiceService,
        public router: Router,
        public route: ActivatedRoute,
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        private callNumber: CallNumber,
        private storage: Storage,
        public httpClient: CommonService
    ) {
        this.fileTransfer = this.transfer.create();
    }

    ionViewWillEnter() {
        this.subsidyId = this.route.snapshot.paramMap.get("subsidyId");
        console.log("this.subsidyId", this.subsidyId);
        if (this.httpClient.isOffline) {
            this.getOffLineData();
        } else {
            this.roleId = this.httpClient.userData.roleid;
            this.userid = this.httpClient.userData.userid;
            this.VerificationList(this.roleId, this.userid, this.subsidyId,this.cast);
        }
    }

    async gotoPreVerificationDetails(data) {
        // this.goToDetails(data, '');
        console.log("data", data);
        if (this.subsidyId == "7") {
            this.goToDetails(data, "");
        }
        else {
            if (data.IsAdhaarVefify == "0") {
                var headerText: any;
                var messageText: any;
                if (this.httpClient.currentLanguage == "hindi") {
                    headerText = "मोबाइल सत्यापित करें";
                    messageText =
                        "कृपया कृषक का मोबाइल नंबर दर्ज करें जो कृषक की आधार आईडी से लिंक है";
                } else {
                    headerText = "Verify Mobile";
                    messageText =
                        "Please enter the farmer mobile number which is linked to farmer Aadhaar ID";
                }
                const alert = await this.alertController.create({
                    header: headerText,
                    message: messageText,
                    inputs: [
                        {
                            name: "mobile",
                            type: "number",
                            placeholder: "Enter mobile",
                        },
                    ],
                    buttons: [
                        {
                            text: "Cancel",
                            role: "cancel",
                            cssClass: "secondary",
                            handler: () => {
                                console.log("Confirm Cancel");
                            },
                        },
                        {
                            text: "Ok",
                            handler: (dataInput) => {
                                console.log("Confirm Ok", data.mobile);
                                if (!this.httpClient.isOffline) {
                                    var self = this;
                                    self.httpClient.showLoading();
                                    var sendRequestData = {
                                        obj: {
                                            usrnm: "rajkisan",
                                            psw: "rajkisan@123",
                                            srvnm: "PostVerification",
                                            srvmethodnm: "VerifyAadhaarMobileNo",
                                            srvparam: JSON.stringify({
                                                aadhaarID: data.AadhaarNo,
                                                mobileNo: dataInput.mobile,
                                            }),
                                        },
                                    };
                                    this.httpClient.post(sendRequestData).subscribe(
                                        function (res: any) {
                                            self.httpClient.dismissLoading();
                                            if (res[0].status == 0) {
                                                self.goToDetails(data, dataInput.mobile);
                                            } else {
                                                if (res[0].data == "") {
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
                                                    srvnm: "PostVerification",
                                                    srvmethodnm: "VerifyAadhaarMobileNo",
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
                                    if (this.subsidyId == 1) {
                                        data.mobilToVerify = dataInput.mobile;
                                        this.dbService.storage
                                            .executeSql(
                                                `
                    UPDATE preVerificationOfflineFormPond
                    SET applicationSubmissionData = '${JSON.stringify(data)}'
                    WHERE ApplicationId = '${data.ApplicationId}'
                  `,
                                                []
                                            )
                                            .then(() => {
                                                this.goToDetails(data, dataInput.mobile);
                                            })

                                            .catch((e) => {
                                                // alert("error " + JSON.stringify(e))
                                            });
                                    } else if (this.subsidyId == 5) {
                                        data.mobilToVerify = dataInput.mobile;
                                        this.dbService.storage
                                            .executeSql(
                                                `
                    UPDATE preVerificationOfflinePipeline
                    SET applicationSubmissionData = '${JSON.stringify(data)}'
                    WHERE ApplicationId = '${data.ApplicationId}'
                  `,
                                                []
                                            )
                                            .then(() => {
                                                this.goToDetails(data, dataInput.mobile);
                                            })

                                            .catch((e) => {
                                                // alert("error " + JSON.stringify(e))
                                            });
                                    } else if (this.subsidyId == 4) {
                                        data.mobilToVerify = dataInput.mobile;
                                        this.dbService.storage
                                            .executeSql(
                                                `
                    UPDATE preVerificationOfflineDiggi
                    SET applicationSubmissionData = '${JSON.stringify(data)}'
                    WHERE ApplicationId = '${data.ApplicationId}'
                  `,
                                                []
                                            )
                                            .then(() => {
                                                this.goToDetails(data, dataInput.mobile);
                                            })

                                            .catch((e) => {
                                                // alert("error " + JSON.stringify(e))
                                            });
                                    } else if (this.subsidyId == 6) {
                                        data.mobilToVerify = dataInput.mobile;
                                        this.dbService.storage
                                            .executeSql(
                                                `
                    UPDATE preVerificationOfflineWaterTank
                    SET applicationSubmissionData = '${JSON.stringify(data)}'
                    WHERE ApplicationId = '${data.ApplicationId}'
                  `,
                                                []
                                            )
                                            .then(() => {
                                                this.goToDetails(data, dataInput.mobile);
                                            })

                                            .catch((e) => {
                                                // alert("error " + JSON.stringify(e))
                                            });
                                    }
                                }
                            },
                        },
                    ],
                });

                await alert.present();
            } else {
                this.goToDetails(data, "");
            }
        }

        //
    }

     goToDetails(dataTosend, mobile) {
        var data = dataTosend;
        data.mobilToVerify = mobile;
        if (data.SubsidySchemeId == "1") {
            if (data.sendRequestDataFinal) {
                this.httpClient.showToast(
                    "This verification is already done. Please SYNC this verification"
                );
            } else {
                this.router.navigate([
                    "farm-pond-pre-verification",
                    { obj: JSON.stringify(data) },
                ]);
            }
        }
        else if (data.SubsidySchemeId == "5") {
            if (data.sendRequestDataFinal) {
                this.httpClient.showToast(
                    "This verification is already done. Please SYNC this verification"
                );
            } else {
                this.router.navigate([
                    "pipeline-pre-verification",
                    { obj: JSON.stringify(data) },
                ]);
            }
        }
        else if (data.SubsidySchemeId == "4") {
            if (data.sendRequestDataFinal) {
                this.httpClient.showToast(
                    "This verification is already done. Please SYNC this verification"
                );
            } else {
                this.router.navigate([
                    "diggi-pre-verification",
                    { obj: JSON.stringify(data) },
                ]);
            }
        }
        else if (data.SubsidySchemeId == "6") {
            if (data.sendRequestDataFinal) {
                this.httpClient.showToast(
                    "This verification is already done. Please SYNC this verification"
                );
            } else {
                this.router.navigate([
                    "preverification-water-tank",
                    { obj: JSON.stringify(data) },
                ]);
            }
        }
        else if (data.SubsidySchemeId == "7") {
            if (data.sendRequestDataFinal) {
                this.httpClient.showToast(
                    "This verification is already done. Please SYNC this verification"
                );
            } else {
                this.router.navigate([
                    "farm-impliment-pre-verification",
                    { obj: JSON.stringify(data) },
                ]);
            }
        }
    }

    checkOfflineExistOrNot() {
        var self = this;
        var verificationList: any = [];
        var verifiedList: any = [];
        if (this.subsidyId == "1") {
            if (!self.platform.is("mobileweb")) {
                self.dbService.storage
                    .executeSql("SELECT * FROM preVerificationOfflineFormPond", [])
                    .then((res) => {
                        console.log("res.rows.length", res.rows.length);
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                if (JSON.parse(res.rows.item(i).applicationSubmissionData) != null) {
                                    verificationList.push(JSON.parse(res.rows.item(i).applicationSubmissionData));
                                }
                            }
                            console.log("verificationList", verificationList);
                            if (verificationList.length > 0) {
                                for (var j = 0; j < this.preVerificationListData.length; j++) {
                                    for (let k = 0; k < verificationList.length; k++) {
                                        if (verificationList[k].sendRequestDataFinal != undefined) {
                                            if (verificationList[k].ApplicationId == this.preVerificationListData[j].ApplicationId) {
                                                this.preVerificationListData.splice(j, 1);
                                                verificationList[k].isAlreadySaved = 2;
                                                this.preVerificationListData.unshift(verificationList[k]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                
                    });
            }
        }
        else if (this.subsidyId == "5") {
            if (!self.platform.is("mobileweb")) {
                self.dbService.storage
                    .executeSql("SELECT * FROM preVerificationOfflinePipeline", [])
                    .then((res) => {
                        console.log("res.rows.length", res.rows.length);
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                if (
                                    JSON.parse(res.rows.item(i).applicationSubmissionData) != null
                                ) {
                                    verificationList.push(
                                        JSON.parse(res.rows.item(i).applicationSubmissionData)
                                    );
                                }
                            }
                            console.log("verificationList", verificationList);
                            if (verificationList.length > 0) {
                                for (var j = 0; j < this.preVerificationListData.length; j++) {
                                    for (let k = 0; k < verificationList.length; k++) {
                                        if (verificationList[k].sendRequestDataFinal != undefined) {
                                            if (
                                                verificationList[k].ApplicationId ==
                                                this.preVerificationListData[j].ApplicationId
                                            ) {
                                                console.log(
                                                    "verificationList[k].sendRequestDataFinal",
                                                    verificationList[k].sendRequestDataFinal
                                                );
                                                console.log("verificationList[k]", verificationList[k]);
                                                this.preVerificationListData.splice(j, 1);
                                                verificationList[k].isAlreadySaved = 2;
                                                this.preVerificationListData.unshift(
                                                    verificationList[k]
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
            }
        }
        else if (this.subsidyId == "4") {
            if (!self.platform.is("mobileweb")) {
                self.dbService.storage
                    .executeSql("SELECT * FROM preVerificationOfflineDiggi", [])
                    .then((res) => {
                        console.log("res.rows.length", res.rows.length);
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                if (
                                    JSON.parse(res.rows.item(i).applicationSubmissionData) != null
                                ) {
                                    verificationList.push(
                                        JSON.parse(res.rows.item(i).applicationSubmissionData)
                                    );
                                }
                            }
                            console.log("verificationList", verificationList);
                            if (verificationList.length > 0) {
                                for (var j = 0; j < this.preVerificationListData.length; j++) {
                                    for (let k = 0; k < verificationList.length; k++) {
                                        if (verificationList[k].sendRequestDataFinal != undefined) {
                                            if (
                                                verificationList[k].ApplicationId ==
                                                this.preVerificationListData[j].ApplicationId
                                            ) {
                                                console.log(
                                                    "verificationList[k].sendRequestDataFinal",
                                                    verificationList[k].sendRequestDataFinal
                                                );
                                                console.log("verificationList[k]", verificationList[k]);
                                                this.preVerificationListData.splice(j, 1);
                                                verificationList[k].isAlreadySaved = 2;
                                                this.preVerificationListData.unshift(
                                                    verificationList[k]
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        // if (res.rows.item(i).applicationSubmissionData == null) {
                        //   verificationList.push(res.rows.item(i));
                        //   console.log("verificationList", verifiedList)

                        // }
                        // else {
                        //   verifiedList.push(res.rows.item(i));
                        //   console.log("verifiedList", verifiedList)
                        // }
                        // if (verificationList.length > 0) {
                        //   for (var n = 0; n < this.preVerificationListData.length; n++) {
                        //     this.preVerificationListData[n].isAlreadySaved = 0;
                        //     for (let j = 0; j < verificationList.length; j++) {
                        //       var tempObject = verificationList[j].applicationData;
                        //       if (JSON.parse(tempObject).ApplicationId == this.preVerificationListData[n].ApplicationId && JSON.parse(tempObject).SubsidySchemeId == this.preVerificationListData[n].SubsidySchemeId) {
                        //         this.preVerificationListData[n].isAlreadySaved = 1;
                        //       }
                        //     }
                        //   }
                        // }

                        // if (verifiedList.length > 0) {
                        //   for (var n = 0; n < this.preVerificationListData.length; n++) {
                        //     this.preVerificationListData[n].isAlreadySaved = 0;
                        //     for (let j = 0; j < verifiedList.length; j++) {
                        //       var tempObject = verifiedList[j].applicationData;
                        //       if (JSON.parse(tempObject).ApplicationId == this.preVerificationListData[n].ApplicationId && JSON.parse(tempObject).SubsidySchemeId == this.preVerificationListData[n].SubsidySchemeId) {
                        //         console.log("verifiedList[j]", verifiedList[j])
                        //         this.preVerificationListData[n].isAlreadySaved = 2;
                        //         this.preVerificationListData[n].submissionData = verifiedList[j].applicationSubmissionData;
                        //       }
                        //     }
                        //   }
                        //   console.log("preVerificationListData", this.preVerificationListData);
                        // }
                    });
            }
        }
        else if (this.subsidyId == "6") {
            if (!self.platform.is("mobileweb")) {
                self.dbService.storage
                    .executeSql("SELECT * FROM preVerificationOfflineWaterTank", [])
                    .then((res) => {
                        console.log("res.rows.length", res.rows.length);
                        if (res.rows.length > 0) {
                            for (var i = 0; i < res.rows.length; i++) {
                                if (JSON.parse(res.rows.item(i).applicationData) != null) {
                                    verificationList.push(JSON.parse(res.rows.item(i).applicationData));
                                }
                            }
                            console.log("verificationList", verificationList);
                            if (verificationList.length > 0) {
                                for (var j = 0; j < this.preVerificationListData.length; j++) {
                                    for (let k = 0; k < verificationList.length; k++) {
                                        if (verificationList[k].sendRequestDataFinal != undefined) {
                                            if (verificationList[k].ApplicationId == this.preVerificationListData[j].ApplicationId) {
                                                console.log("verificationList[k].sendRequestDataFinal", verificationList[k].sendRequestDataFinal);
                                                console.log("verificationList[k]", verificationList[k]);
                                                this.preVerificationListData.splice(j, 1);
                                                verificationList[k].isAlreadySaved = 2;
                                                this.preVerificationListData.unshift(
                                                    verificationList[k]
                                                );
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
            }
        }
    }
    loadData() {
        for (var i = this.preVerificationListData.length; i < this.counter + 10; i++) {
            console.log("i", i);
            if (this.preVerificationListDataTwo[i]) {
                this.preVerificationListData.push(this.preVerificationListDataTwo[i]);
            }
        }
        this.counter = this.counter + 10;
    }
    VerificationList(roleId, userid, subsidyId,cast) {
        var self = this;
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "i75Q7Q6nYgW3rgEitGndNA==",
                srvnm: "PreVerification",
                srvmethodnm: "VerificationList",
                srvparam: JSON.stringify({
                    SubsidySchemeId: subsidyId,
                    RoleId: roleId,
                    UserId: userid,
                    Flag: "1",
                    CasteCategory: cast,
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                if (res[0].status == 0) {
                    self.preVerificationListDataTwo = res[0].data;
                    self.preVerificationListData = res[0].data;
                    for (let i = 0; i < self.preVerificationListData.length; i++) {
                        self.preVerificationListData[i].isAlreadySaved = 0;
                    }
                    // if (self.preVerificationListData.length < 5) {
                    //     self.preVerificationListData = self.preVerificationListData;
                    //     self.listLength = false;
                    // }
                    // else {
                    //     self.preVerificationListData = res[0].data.splice(0, 5);
                    //     self.counter = 5;
                    //     self.listLength = true;

                    // }
                    self.checkOfflineExistOrNot();
                } else {
                    if (res[0].data == "") {
                        self.showPromptRecordNotFound(res[0].message);
                    } else {
                        self.showPromptRecordNotFound(res[0].data);
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
                        srvnm: "PreVerification",
                        srvmethodnm: "VerificationList",
                        srvparam: JSON.stringify({
                            SubsidySchemeId: subsidyId,
                            RoleId: roleId,
                            UserId: userid,
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

    callFarmer(mobileNo) {
        this.callNumber
            .callNumber(mobileNo, true)
            .then((res) => console.log("Launched dialer!", res))
            .catch((err) => console.log("Error launching dialer", err));
    }

    async showPromptRecordNotFound(msg) {
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
                            if(this.subsidyId!=7)
                            {
                                this.navCtrl.pop();
                            }
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
                            if(this.subsidyId!=7)
                            {
                                this.navCtrl.pop();
                            }
                        },
                    },
                ],
            });
            await alert.present();
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
                            this.VerificationList(this.roleId, this.userid, this.subsidyId,this.cast);
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
                            this.VerificationList(this.roleId, this.userid, this.subsidyId,this.cast);
                        },
                    },
                ],
            });
            await alert.present();
        }
    }

    getDataOffLine(data, index) {
        var self = this;
        self.preVerificationListData[index].isAlreadySaved = 1;
        self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "i75Q7Q6nYgW3rgEitGndNA==",
                srvnm: "PreVerification",
                srvmethodnm: "VerificationChecklist",
                srvparam:
                    "{'SchemeId':'" +
                    data.SubsidySchemeId +
                    "', 'StepName':'Pre verification','ApplicationId':'" +
                    data.ApplicationId +
                    "'}",
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    data.preVerificationChecklistData = res[0].data;
                    for (var i = 0; i < data.preVerificationChecklistData.length; i++) {
                        data.preVerificationChecklistData[i].isSelectedClose = false;
                        data.preVerificationChecklistData[i].isSelectedCheck = false;
                    }

                    if (self.subsidyId == "1") {
                        self.dbService.addpreVerificationOffline(
                            data.ApplicationId,
                            JSON.stringify(data)
                        );
                    }
                    else if (self.subsidyId == "5") {
                        self.dbService.addpreVerificationOfflinePipeline(
                            data.ApplicationId,
                            JSON.stringify(data)
                        );
                    }
                    else if (self.subsidyId == "4") {
                        self.dbService.addpreVerificationOfflineDiggi(
                            data.ApplicationId,
                            JSON.stringify(data)
                        );
                    } else if (self.subsidyId == "6") {
                        self.dbService.addpreVerificationOfflineWaterTank(
                            data.ApplicationId,
                            JSON.stringify(data)
                        );
                    }
                } else {
                    if (res[0].data == "") {
                        self.showPrompt(res[0].message);
                    } else {
                        self.showPrompt(res[0].data);
                    }
                    // self.httpClient.showToast(res.message);
                }
                // self.httpClient.showToast(res.message)
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
                            data.SubsidySchemeId +
                            "', 'StepName':'Pre verification','ApplicationId':'" +
                            data.ApplicationId +
                            "'}",
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }



    getOffLineData() {
        if (this.subsidyId == "1") {
            this.preVerificationListData = [];
            this.dbService.storage
                .executeSql("SELECT * FROM preVerificationOfflineFormPond", [])
                .then((res) => {
                    this.formPondList = [];
                    if (res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {
                            if (res.rows.item(i).applicationSubmissionData != null) {
                                this.preVerificationListData.push(
                                    JSON.parse(res.rows.item(i).applicationSubmissionData)
                                );
                            }
                        }

                        console.log(
                            "this.preVerificationListData",
                            this.preVerificationListData
                        );
                        // for (let j = 0; j < this.formPondList.length; j++) {
                        //   var tempObject = this.formPondList[j].applicationData;
                        //   this.preVerificationListData.push(JSON.parse(tempObject));
                        // }
                    }
                });

            console.log("2");
        } else if (this.subsidyId == "5") {
            this.preVerificationListData = [];
            this.dbService.storage
                .executeSql("SELECT * FROM preVerificationOfflinePipeline", [])
                .then((res) => {
                    this.formPondList = [];
                    if (res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {
                            if (res.rows.item(i).applicationSubmissionData != null) {
                                this.preVerificationListData.push(
                                    JSON.parse(res.rows.item(i).applicationSubmissionData)
                                );
                            }
                        }

                        console.log(
                            "this.preVerificationListData",
                            this.preVerificationListData
                        );
                        // for (let j = 0; j < this.formPondList.length; j++) {
                        //   var tempObject = this.formPondList[j].applicationData;
                        //   this.preVerificationListData.push(JSON.parse(tempObject));
                        // }
                    }
                });

            console.log("2");
        } else if (this.subsidyId == "4") {
            this.preVerificationListData = [];
            this.dbService.storage
                .executeSql("SELECT * FROM preVerificationOfflineDiggi", [])
                .then((res) => {
                    this.formPondList = [];
                    if (res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {
                            if (res.rows.item(i).applicationSubmissionData != null) {
                                this.preVerificationListData.push(
                                    JSON.parse(res.rows.item(i).applicationSubmissionData)
                                );
                            }
                        }

                        console.log(
                            "this.preVerificationListData",
                            this.preVerificationListData
                        );
                        // for (let j = 0; j < this.formPondList.length; j++) {
                        //   var tempObject = this.formPondList[j].applicationData;
                        //   this.preVerificationListData.push(JSON.parse(tempObject));
                        // }
                    }
                });

            console.log("2");
        } else if (this.subsidyId == "6") {
            this.preVerificationListData = [];
            this.dbService.storage
                .executeSql("SELECT * FROM preVerificationOfflineWaterTank", [])
                .then((res) => {
                    this.formPondList = [];
                    console.log("res.rows.length", res.rows.length);

                    if (res.rows.length > 0) {
                        for (var i = 0; i < res.rows.length; i++) {

                            if (res.rows.item(i).applicationData != null) {
                                console.log(" JSON.parse(res.rows.item(i).applicationData)", JSON.parse(res.rows.item(i).applicationData));
                                this.preVerificationListData.push(
                                    JSON.parse(res.rows.item(i).applicationData)
                                );
                            }
                        }
                    }
                });
        }
    }

    submitCheckList(data) {
        if (this.subsidyId == "1") {
            console.log("data", data);
            if (data.mainDataSubmit != undefined) {
                this.farmPondYesMainDataSubmit(data);
            } else {
                this.httpClient.showLoading();
                this.fileTransfer.upload(data.imageOFimgFarmerWithOfficerNoCase, this.httpClient.imageUploadUrl, data.optionsOFimgFarmerWithOfficerNoCase).then((imgfarmerNoCase) => {
                    console.log("imgfarmerNoCase", imgfarmerNoCase);
                    var linkOFimgfarmerNoCaseTemp = JSON.parse(imgfarmerNoCase.response);
                    var linkOFimgfarmerNoCase = linkOFimgfarmerNoCaseTemp[0].data;
                    this.fileTransfer.upload(data.imageOFfarmerNonConsentLetter, this.httpClient.imageUploadUrl, data.optionsOFfarmerNonConsentLetter).then((consentLetter) => {
                        console.log("consentLetter", consentLetter);
                        console.log(data.sendRequestDataFinal);
                        var linkOFconsentLetterTemp = JSON.parse(consentLetter.response);
                        var linkOFconsentLetter = linkOFconsentLetterTemp[0].data;
                        var tempSRVparam = data.sendRequestDataFinal;
                        tempSRVparam.ImgFarmer = linkOFimgfarmerNoCase;
                        tempSRVparam.NotAcceptanceDocPath = linkOFimgfarmerNoCase;
                        console.log("tempSRVparam", tempSRVparam);
                        console.log("linkOFimgfarmerNoCase", linkOFimgfarmerNoCase);
                        console.log("linkOFconsentLetter", linkOFconsentLetter);
                        var self = this;
                        var sendRequestData = {
                            obj: {
                                usrnm: "rajkisan",
                                psw: "rajkisan@123",
                                srvnm: "PreVerification",
                                srvmethodnm: "AddPreverificationBasicData",
                                srvparam: JSON.stringify(tempSRVparam),
                            },
                        };

                        this.httpClient.post(sendRequestData).subscribe(function (res: any) {
                            console.log("res", res);
                            if (res[0].status == 0) {
                                self.dbService.storage.executeSql(
                                    "DELETE FROM preVerificationOfflineFormPond WHERE ApplicationId = ?",
                                    [data.ApplicationId]
                                )
                                    .then((_) => {
                                        self.httpClient.dismissLoading();
                                        self.showPrompt(res[0].message);
                                    })
                                    .catch((err) => {
                                        console.log("err", err);
                                    });
                            } else {

                            }
                            // self.httpClient.showToast(res.message);
                            self.httpClient.dismissLoading();
                        });
                    }),
                        (err) => {
                            this.httpClient.dismissLoading();
                            console.log("err", err);
                        }
                }),
                    (err) => {
                        this.httpClient.dismissLoading();
                        console.log("err", err);
                    }

            }
        }
        else if (this.subsidyId == "5") {
            console.log("data", data);
            if (data.mainDataSubmit != undefined) {
                this.pipelineYesMainDataSubmit(data);
            } else {
                this.httpClient.showLoading();
                this.fileTransfer.upload(data.imageOFimgFarmerWithOfficerNoCase, this.httpClient.imageUploadUrl, data.optionsOFimgFarmerWithOfficerNoCase).then((imgfarmerNoCase) => {
                    console.log("imgfarmerNoCase", imgfarmerNoCase);
                    var linkOFimgfarmerNoCaseTemp = JSON.parse(imgfarmerNoCase.response);
                    var linkOFimgfarmerNoCase = linkOFimgfarmerNoCaseTemp[0].data;
                    this.fileTransfer.upload(data.imageOFfarmerNonConsentLetter, this.httpClient.imageUploadUrl, data.optionsOFfarmerNonConsentLetter).then((consentLetter) => {
                        console.log("consentLetter", consentLetter);
                        console.log(data.sendRequestDataFinal);
                        var linkOFconsentLetterTemp = JSON.parse(consentLetter.response);
                        var linkOFconsentLetter = linkOFconsentLetterTemp[0].data;
                        var tempSRVparam = data.sendRequestDataFinal;
                        tempSRVparam.ImgFarmer = linkOFimgfarmerNoCase;
                        tempSRVparam.NotAcceptanceDocPath = linkOFimgfarmerNoCase;
                        console.log("tempSRVparam", tempSRVparam);
                        console.log("linkOFimgfarmerNoCase", linkOFimgfarmerNoCase);
                        console.log("linkOFconsentLetter", linkOFconsentLetter);
                        var self = this;
                        var sendRequestData = {
                            obj: {
                                usrnm: "rajkisan",
                                psw: "rajkisan@123",
                                srvnm: "PreVerification",
                                srvmethodnm: "AddPreverificationBasicData",
                                srvparam: JSON.stringify(tempSRVparam),
                            },
                        };

                        this.httpClient.post(sendRequestData).subscribe(function (res: any) {
                            console.log("res", res);
                            if (res[0].status == 0) {
                                self.dbService.storage.executeSql(
                                    "DELETE FROM preVerificationOfflinePipeline WHERE ApplicationId = ?",
                                    [data.ApplicationId]
                                )
                                    .then((_) => {
                                        self.httpClient.dismissLoading();
                                        self.showPrompt(res[0].message);
                                    })
                                    .catch((err) => {
                                        console.log("err", err);
                                    });
                            } else {

                            }
                            // self.httpClient.showToast(res.message);
                            self.httpClient.dismissLoading();
                        });
                    }),
                        (err) => {
                            this.httpClient.dismissLoading();
                            console.log("err", err);
                        }
                }),
                    (err) => {
                        this.httpClient.dismissLoading();
                        console.log("err", err);
                    }

            }
        }
        else if (this.subsidyId == "4") {
            console.log("data", data);
            if (data.mainDataSubmit != undefined) {
                this.farmPondYesMainDataSubmit(data);
            } else {
                this.httpClient.showLoading();
                this.fileTransfer.upload(data.imageOFimgFarmerWithOfficerNoCase, this.httpClient.imageUploadUrl, data.optionsOFimgFarmerWithOfficerNoCase).then((imgfarmerNoCase) => {
                    console.log("imgfarmerNoCase", imgfarmerNoCase);
                    var linkOFimgfarmerNoCaseTemp = JSON.parse(imgfarmerNoCase.response);
                    var linkOFimgfarmerNoCase = linkOFimgfarmerNoCaseTemp[0].data;
                    this.fileTransfer.upload(data.imageOFfarmerNonConsentLetter, this.httpClient.imageUploadUrl, data.optionsOFfarmerNonConsentLetter).then((consentLetter) => {
                        console.log("consentLetter", consentLetter);
                        console.log(data.sendRequestDataFinal);
                        var linkOFconsentLetterTemp = JSON.parse(consentLetter.response);
                        var linkOFconsentLetter = linkOFconsentLetterTemp[0].data;
                        var tempSRVparam = data.sendRequestDataFinal;
                        tempSRVparam.ImgFarmer = linkOFimgfarmerNoCase;
                        tempSRVparam.NotAcceptanceDocPath = linkOFimgfarmerNoCase;
                        console.log("tempSRVparam", tempSRVparam);
                        console.log("linkOFimgfarmerNoCase", linkOFimgfarmerNoCase);
                        console.log("linkOFconsentLetter", linkOFconsentLetter);
                        var self = this;
                        var sendRequestData = {
                            obj: {
                                usrnm: "rajkisan",
                                psw: "rajkisan@123",
                                srvnm: "PreVerification",
                                srvmethodnm: "AddPreverificationBasicData",
                                srvparam: JSON.stringify(tempSRVparam),
                            },
                        };

                        this.httpClient.post(sendRequestData).subscribe(function (res: any) {
                            console.log("res", res);
                            if (res[0].status == 0) {
                                self.dbService.storage.executeSql(
                                    "DELETE FROM preVerificationOfflineFormPond WHERE ApplicationId = ?",
                                    [data.ApplicationId]
                                )
                                    .then((_) => {
                                        self.httpClient.dismissLoading();
                                        self.showPrompt(res[0].message);
                                    })
                                    .catch((err) => {
                                        console.log("err", err);
                                    });
                            } else {

                            }
                            // self.httpClient.showToast(res.message);
                            self.httpClient.dismissLoading();
                        });
                    }),
                        (err) => {
                            this.httpClient.dismissLoading();
                            console.log("err", err);
                        }
                }),
                    (err) => {
                        this.httpClient.dismissLoading();
                        console.log("err", err);
                    }

                // var self = this;
                // self.httpClient.showLoading();
                // this.httpClient
                //     .post(data.sendRequestDataFinal)
                //     .subscribe(function (res: any) {
                //         console.log("res", res);
                //         if (res[0].status == 0) {
                //             self.dbService.storage
                //                 .executeSql(
                //                     "DELETE FROM preVerificationOfflineDiggi WHERE ApplicationId = ?",
                //                     [data.ApplicationId]
                //                 )
                //                 .then((_) => {
                //                     self.showPrompt(res[0].message);
                //                 })
                //                 .catch((err) => {
                //                     console.log("err", err);
                //                 });
                //             // self.preVerificationId=
                //         } else {
                //             if (res[0].data == "") {
                //                 self.httpClient.showToast(res[0].message);
                //             } else {
                //                 self.httpClient.showToast(res[0].data);
                //             }
                //             // self.httpClient.showToast(res.message);
                //         }
                //         // self.httpClient.showToast(res.message);
                //         self.httpClient.dismissLoading();
                //     });
            }
        }
        else if (this.subsidyId == "6") {
            console.log("data", data);
            if (data.mainDataSubmit) {
                this.farmPondYesMainDataSubmit(data);
            } else {
                this.httpClient.showLoading();
                this.fileTransfer.upload(data.imageOFimgFarmerWithOfficerNoCase, this.httpClient.imageUploadUrl, data.optionsOFimgFarmerWithOfficerNoCase).then((imgfarmerNoCase) => {
                    console.log("imgfarmerNoCase", imgfarmerNoCase);
                    var linkOFimgfarmerNoCaseTemp = JSON.parse(imgfarmerNoCase.response);
                    var linkOFimgfarmerNoCase = linkOFimgfarmerNoCaseTemp[0].data;
                    this.fileTransfer.upload(data.imageOFfarmerNonConsentLetter, this.httpClient.imageUploadUrl, data.optionsOFfarmerNonConsentLetter).then((consentLetter) => {
                        console.log("consentLetter", consentLetter);
                        console.log(data.sendRequestDataFinal);
                        var linkOFconsentLetterTemp = JSON.parse(consentLetter.response);
                        var linkOFconsentLetter = linkOFconsentLetterTemp[0].data;
                        var tempSRVparam = data.sendRequestDataFinal;
                        tempSRVparam.ImgFarmer = linkOFimgfarmerNoCase;
                        tempSRVparam.NotAcceptanceDocPath = linkOFimgfarmerNoCase;
                        console.log("tempSRVparam", tempSRVparam);
                        console.log("linkOFimgfarmerNoCase", linkOFimgfarmerNoCase);
                        console.log("linkOFconsentLetter", linkOFconsentLetter);
                        var self = this;
                        var sendRequestData = {
                            obj: {
                                usrnm: "rajkisan",
                                psw: "rajkisan@123",
                                srvnm: "PreVerification",
                                srvmethodnm: "AddPreverificationBasicData",
                                srvparam: JSON.stringify(tempSRVparam),
                            },
                        };

                        this.httpClient.post(sendRequestData).subscribe(function (res: any) {
                            console.log("res", res);
                            if (res[0].status == 0) {
                                self.dbService.storage.executeSql(
                                    "DELETE FROM preVerificationOfflineWaterTank WHERE ApplicationId = ?",
                                    [data.ApplicationId]
                                )
                                    .then((_) => {
                                        self.httpClient.dismissLoading();
                                        self.showPrompt(res[0].message);
                                    })
                                    .catch((err) => {
                                        console.log("err", err);
                                    });
                            } else {

                            }
                            // self.httpClient.showToast(res.message);
                            self.httpClient.dismissLoading();
                        });
                    }),
                        (err) => {
                            this.httpClient.dismissLoading();
                            console.log("err", err);
                        }
                }),
                    (err) => {
                        this.httpClient.dismissLoading();
                        console.log("err", err);
                    }
            }
        }
    }

    pipelineYesMainDataSubmit(data) {
        var self = this;

        self.httpClient.showLoading();
        this.httpClient.post(data.mainDataSubmit).subscribe(function (res: any) {
            console.log("res", res);
            if (res[0].status == 0) {
                // self.preVerificationId = res[0].data[0].AddStatus;
                // self.successAlert();
                // // self.preVerificationId=
                self.uploadNajariyaNaksha(res[0].data[0].AddStatus, data);
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
                self.httpClient.dismissLoading();
                var errorRequestData = {
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "PreVerification",
                        srvmethodnm: "AddPreverificationBasicData",
                        srvparam: JSON.stringify(data.mainDataSubmit),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }



        );
    }

    farmPondYesMainDataSubmit(data) {
        var self = this;
        self.httpClient.showLoading();
        this.httpClient.post(data.mainDataSubmit).subscribe(function (res: any) {
            console.log("res", res);
            if (res[0].status == 0) {
                self.uploadNajariyaNaksha(res[0].data[0].AddStatus, data);
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
                self.httpClient.dismissLoading();
                var errorRequestData = {
                    'obj': {
                        'usrnm': 'rajkisan',
                        'psw': 'rajkisan@123',
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "PreVerification",
                        srvmethodnm: "AddPreverificationBasicData",
                        srvparam: JSON.stringify(data.mainDataSubmit),
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            });
    }

    uploadNajariyaNaksha(preVerificationID, data) {
        if (this.subsidyId == "1") {
            var options = data.optionsOFnajariyaNaksha;
            options.params.id = preVerificationID;
            console.log("options najariya naksha", options);
            this.fileTransfer.upload(data.imageOFnajariyaNaksha, this.httpClient.imageUploadUrl, options).then((najariyaNaksha) => {
                var temp = JSON.parse(najariyaNaksha.response);
                console.log("najariya naksha uploaded", temp[0].data);
                this.uploadFarmerImage(preVerificationID, data);
            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }
        } else if (this.subsidyId == "5") {
            var options = data.optionsOFImgSignedMap;
            options.params.id = preVerificationID;
            console.log("options najariya naksha", options);
            this.fileTransfer.upload(data.imageOFImgSignedMap, this.httpClient.imageUploadUrl, options).then((najariyaNaksha) => {
                var temp = JSON.parse(najariyaNaksha.response);
                console.log("najariya naksha uploaded", temp[0].data);
                this.uploadFarmerImage(preVerificationID, data);
            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }
        } else if (this.subsidyId == "4") {
            var options = data.optionsOFImgSignedMap;
            options.params.id = preVerificationID;
            console.log("options najariya naksha", options);
            this.fileTransfer.upload(data.imageOFImgSignedMap, this.httpClient.imageUploadUrl, options).then((najariyaNaksha) => {
                var temp = JSON.parse(najariyaNaksha.response);
                console.log("najariya naksha uploaded", temp[0].data);
                this.uploadFarmerImage(preVerificationID, data);
            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }
        }
        else if (this.subsidyId == "6") {
            var options = data.optionsOFnajariyaNaksha;
            options.params.id = preVerificationID;
            console.log("options najariya naksha", options);
            this.fileTransfer.upload(data.imageOfnajariyaNaksha, this.httpClient.imageUploadUrl, options).then((najariyaNaksha) => {
                var temp = JSON.parse(najariyaNaksha.response);
                console.log("najariya naksha uploaded", temp[0].data);
                this.uploadFarmerImage(preVerificationID, data);
            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }
        }


    }

    uploadFarmerImage(preVerificationID, data) {

        var self = this;
        if (this.subsidyId == "1") {
            var options = data.optionsOFimgFarmerAndOfficerWithFarmPond;

            console.log("options  farmer Officer1", data);
            options.params.id = preVerificationID;
            console.log("options  farmer Officer", options);
            this.fileTransfer.upload(data.imageOFimgFarmerAndOfficerWithFarmPond, this.httpClient.imageUploadUrl, options).then((Officer) => {
                var temp = JSON.parse(Officer.response);
                console.log(" farmer Officer", temp[0].data);
                if (self.subsidyId == "1") {
                    self.submitFinalDataOfFarmPond(data);
                } else if (self.subsidyId == "5") {
                    self.uploadSourceOfIrrigration(preVerificationID, data);
                } else if (self.subsidyId == "4") {
                    self.submitFinalDataOfFarmPond(data);
                } else if (self.subsidyId == "6") {
                    self.submitFinalDataOfFarmPond(data);
                }
            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }

        } else if (this.subsidyId == "5") {
            var options = data.optionsOFImgfarmerWithOfficer;
            console.log("options  farmer Officer1", data);
            options.params.id = preVerificationID;
            console.log("options  farmer Officer", options);
            this.fileTransfer.upload(data.imageOFImgfarmerWithOfficer, this.httpClient.imageUploadUrl, options).then((Officer) => {
                var temp = JSON.parse(Officer.response);
                console.log(" farmer Officer", temp[0].data);
                if (self.subsidyId == "1") {
                    self.submitFinalDataOfFarmPond(data);
                } else if (self.subsidyId == "5") {
                    self.uploadSourceOfIrrigration(preVerificationID, data);
                } else if (self.subsidyId == "4") {
                    self.submitFinalDataOfFarmPond(data);
                } else if (self.subsidyId == "6") {
                    self.submitFinalDataOfFarmPond(data);
                }
            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }
        } else if (this.subsidyId == "4") {
            var options = data.optionsOFImgfarmerWithOfficer;

            console.log("options  farmer Officer1", data);
            options.params.id = preVerificationID;
            console.log("options  farmer Officer", options);
            this.fileTransfer.upload(data.imageOFImgfarmerWithOfficer, this.httpClient.imageUploadUrl, options).then((Officer) => {
                var temp = JSON.parse(Officer.response);
                console.log(" farmer Officer", temp[0].data);
                if (self.subsidyId == "1") {
                    self.submitFinalDataOfFarmPond(data);
                } else if (self.subsidyId == "5") {
                    self.uploadSourceOfIrrigration(preVerificationID, data);
                } else if (self.subsidyId == "4") {
                    self.submitFinalDataOfFarmPond(data);
                } else if (self.subsidyId == "6") {
                    self.submitFinalDataOfFarmPond(data);
                }
            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }

        }
        else if (this.subsidyId == "6") {
            var options = data.optionsOFimgFarmerAndOfficerWithFarmPond;

            console.log("options  farmer Officer1", data);
            options.params.id = preVerificationID;
            console.log("options  farmer Officer", options);
            this.fileTransfer.upload(data.imgFarmerAndOfficerWithFarmPond, this.httpClient.imageUploadUrl, options).then((Officer) => {
                var temp = JSON.parse(Officer.response);
                console.log(" farmer Officer", temp[0].data);
                self.submitFinalDataOfFarmPond(data);

            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }

        }

    }

    uploadSourceOfIrrigration(preVerificationID, data) {
        if (this.subsidyId == "5") {
            var options = data.optionsOFImgSourceOfIrrigation;
            console.log("options  farmer Officer1", data);
            options.params.id = preVerificationID;
            console.log("options  farmer Officer", options);
            this.fileTransfer.upload(data.imageOFImgSourceOfIrrigation, this.httpClient.imageUploadUrl, options).then((Officer) => {
                var temp = JSON.parse(Officer.response);
                console.log(" farmer Officer", temp[0].data);
                this.submitFinalDataOfFarmPond(data);

            }),
                (err) => {
                    this.httpClient.dismissLoading();
                    console.log("err", err);
                }
        }


    }

    submitFinalDataOfFarmPond(data) {
        var self = this;
        this.httpClient
            .post(data.sendRequestDataFinal)
            .subscribe(function (res: any) {
                console.log("res", res);

                self.httpClient.dismissLoading();
                if (res[0].status == 0) {
                    if (self.subsidyId == "1") {
                        self.dbService.storage
                            .executeSql(
                                "DELETE FROM preVerificationOfflineFormPond WHERE ApplicationId = ?",
                                [data.ApplicationId]
                            )
                            .then((_) => {
                                self.showPrompt(res[0].message);
                            })
                            .catch((err) => {
                                console.log("err", err);
                            });
                    } else if (self.subsidyId == "5") {
                        self.dbService.storage
                            .executeSql(
                                "DELETE FROM preVerificationOfflinePipeline WHERE ApplicationId = ?",
                                [data.ApplicationId]
                            )
                            .then((_) => {
                                self.showPrompt(res[0].message);
                            })
                            .catch((err) => {
                                console.log("err", err);
                            });
                    } else if (self.subsidyId == "4") {
                        self.dbService.storage
                            .executeSql(
                                "DELETE FROM preVerificationOfflineDiggi WHERE ApplicationId = ?",
                                [data.ApplicationId]
                            )
                            .then((_) => {
                                self.showPrompt(res[0].message);
                            })
                            .catch((err) => {
                                console.log("err", err);
                            });
                    } else if (self.subsidyId == "6") {
                        self.dbService.storage
                            .executeSql(
                                "DELETE FROM preVerificationOfflineWaterTank WHERE ApplicationId = ?",
                                [data.ApplicationId]
                            )
                            .then((_) => {
                                self.showPrompt(res[0].message);
                            })
                            .catch((err) => {
                                console.log("err", err);
                            });
                    }
                } else {
                    if (res[0].data == "") {
                        self.httpClient.showToast(res[0].message);
                    } else {
                        self.httpClient.showToast(res[0].data);
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
                            srvnm: "PreVerification",
                            srvmethodnm: "ConfirmPreVerification",
                            srvparam: JSON.stringify(data.sendRequestDataFinal),
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                });
    }

/*
    async showPrompttwo(msg) {
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
                            this.VerificationList(this.roleId, this.userid, this.subsidyId,this.cast);
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
                            this.VerificationList(this.roleId, this.userid, this.subsidyId,this.cast);
                        },
                    },
                ],
            });
            await alert.present();
        }
    }
*/
    onchangeCast(cast) {
        this.VerificationList(this.roleId, this.userid, this.subsidyId, cast);
        this.preVerificationListData = [];
    }

}
