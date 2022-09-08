import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DatabaseServiceService } from "../services/database-service.service";
import { FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Camera } from '@ionic-native/camera/ngx';

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.page.html",
    styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage {
    getVerificationDashboardData: any;
    getHortiApplicationToWorkConfirmAAO: any = [];
    SelfTotalPending: any;
    SelfTotalCompleted: any;
    AssignedTOASTotalPending: any;
    AssignedTOASTotalCompleted: any;
    PostVerificationPending: any;
    PostVerificationCompleted: any;
    PostVerificationPendingConfirmation: any;
    roleId: any;
    officerNameEn: any;
    roleName_EN: any;
    userid: any;
    ssoID: any;
    userName: any;
    ssoLoginData: any;
    pageName: any;
    pendingRow: any = true;
    userDataDashboard: any;
    latitude: any = "";
    longitude: any = "";

    checkLocationAvailableRes: any;
    checkIsLocationEnabledRes: any;
    checkIsGpsLocationAvailableRes: any;
    checkIsGpsLocationEnabledRes: any;
    isLocation: any = true;
    dashboardAOcount: any;

    aoFlag: any = false;

    constructor(
        public dbService: DatabaseServiceService,
        public navCtrl: NavController,
        public router: Router,
        public route: ActivatedRoute,
        public alertCtrl: AlertController,
        public httpClient: CommonService,
        public storage: Storage,
        public platform: Platform,
        private camera: Camera,

        public geolocation: Geolocation
    ) {

    }


    changeRole() {
        this.navCtrl.navigateRoot(["selectrole"]);
    }
    home() {
        if (this.httpClient.userList.length == 0) {
            this.navCtrl.navigateRoot([
                "subsidy-lic-selection",
                { userData: JSON.stringify([this.httpClient.userData]) },
            ]);
        }
        else {
            this.navCtrl.navigateRoot([
                "subsidy-lic-selection",
                { userData: JSON.stringify(this.httpClient.userList) },
            ]);
        }
    }
    ionViewWillEnter() {
        this.getLoc();
        this.ssoID = this.httpClient.userData.SSO_ID;
        this.roleId = this.httpClient.userData.roleid;
        this.userid = this.httpClient.userData.userid;
        this.officerNameEn = this.httpClient.userData.OfficerNameEn;
        this.roleName_EN = this.httpClient.userData.RoleName_EN;
        if (
            this.httpClient.userData.RoleName_EN == "Agriculture Officer" ||
            this.httpClient.userData.RoleName_EN == "Agriculture Officer District"
        ) {
            this.aoFlag = true;
            this.getdashboardCountOfAO();
        }
        if (this.roleName_EN == "Agriculture Supervisor") {
            this.pendingRow = false;
        } else {
            this.pendingRow = true;
        }
        this.getVerificationDashboard(this.roleId, this.userid);
        this.getGetApplicationToWorkConfirm(this.roleId, this.userid);

        this.getVersion();
    }

    ionViewDidLoad() {
        console.log("ionViewDidLoad DashboardPage");
    }

    getdashboardCountOfAO() {
        var self = this;
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "i75Q7Q6nYgW3rgEitGndNA==",
                srvnm: "HortiSubsidy",
                srvmethodnm: "GetVerificationDashboardForAO",
                srvparam: JSON.stringify({
                    RoleId: this.httpClient.userData.roleid,
                    userid: this.httpClient.userData.userid,
                }),
            },
        };

        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                console.log("res", res);
                if (res[0].status == 0) {
                    self.dashboardAOcount = res[0].data[0];
                } else {
                    self.httpClient.showToast(res[0].message);
                }
                self.httpClient.dismissLoadingImage();
            },
            (error) => {
                var errorRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "i75Q7Q6nYgW3rgEitGndNA==",
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "HortiSubsidy",
                        srvmethodnm: "GetVerificationDashboardForAO",
                        srvparam: JSON.stringify({
                            RoleId: self.httpClient.userData.roleid,
                            userid: self.httpClient.userData.userid,
                        }),
                    },
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    getLoc() {
        this.geolocation
            .getCurrentPosition({ timeout: 30000, enableHighAccuracy: true })
            .then((resp) => {
                this.httpClient.latitude = resp.coords.latitude;
                this.httpClient.longitude = resp.coords.longitude;
                this.isLocation = true;
            })
            .catch((error) => {
                this.isLocation = true;
                console.log("error", error);
                if (this.httpClient.currentLanguage == "english") {
                    this.showLocationPrompt(
                        "You will have to enable the location or GPS permission for this app."
                    );
                } else {
                    this.showLocationPrompt(
                        "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
                    );
                }
            });
    }

    getVerificationDashboard(roleId, userid) {
        var self = this;
        self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "i75Q7Q6nYgW3rgEitGndNA==",
                srvnm: "SubsidyDashboard",
                srvmethodnm: "GetVerificationDashboard",
                srvparam: "{'RoleId':'" + roleId + "','userId':'" + userid + "'}",
            },
        };

        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                console.log("res", res);
                if (res[0].status == 0) {
                    self.getVerificationDashboardData = res[0].data[0];

                } else {
                    self.httpClient.showToast(res[0].message);
                }
                self.httpClient.dismissLoading();
            },
            (error) => {
                self.httpClient.dismissLoading();
                var errorRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "i75Q7Q6nYgW3rgEitGndNA==",
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "SubsidyDashboard",
                        srvmethodnm: "GetVerificationDashboard",
                        srvparam: "{'RoleId':'" + roleId + "','userId':'" + userid + "'}",
                    },
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    pvVarificationdonebyPage() {
        if (this.isLocation == false) {
            // this.getLoc();
            if (this.httpClient.currentLanguage == "english") {
                this.showLocationPrompt(
                    "You will have to enable the location or GPS permission for this app."
                );
            } else {
                this.showLocationPrompt(
                    "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
                );
            }
        } else {
            this.router.navigate(["verification-done-by"]);
        }
    }

    pvCompletePage() {
        if (this.isLocation == false) {
            this.getLoc();
            if (this.httpClient.currentLanguage == "english") {
                this.showLocationPrompt(
                    "You will have to enable the location or GPS permission for this app."
                );
            } else {
                this.showLocationPrompt(
                    "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
                );
            }
        } else {
            this.router.navigate(["pv-complete"]);
        }
    }

    preVerificationDashboardPage(pre) {
        if (this.isLocation == false) {
            this.getLoc();
            if (this.httpClient.currentLanguage == "english") {
                this.showLocationPrompt(
                    "You will have to enable the location or GPS permission for this app."
                );
            } else {
                this.showLocationPrompt(
                    "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
                );
            }
        } else {
            this.router.navigate(["pre-verification", { header: pre }]);
        }
    }

    postVerificationDashboardPendingPage(post) {
        if (this.isLocation == false) {
            this.getLoc();
            if (this.httpClient.currentLanguage == "english") {
                this.showLocationPrompt(
                    "You will have to enable the location or GPS permission for this app."
                );
            } else {
                this.showLocationPrompt(
                    "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
                );
            }
        } else {
            this.router.navigate(["pre-verification", { header: post }]);
            // if (this.httpClient.userData.RoleName_EN == "Agriculture Supervisor") {
            //   this.router.navigate(["pre-verification", { header: post }]);
            // }
        }
    }

    postVerificationDashboardCompletePage(post) {
        this.router.navigate([
            "post-verification-pending-list",
            { flag: "completed" },
        ]);
    }

    gotoPostVerificationPendingListPage() {
        if (this.isLocation == false) {
            this.getLoc();
            if (this.httpClient.currentLanguage == "english") {
                this.showLocationPrompt(
                    "You will have to enable the location or GPS permission for this app."
                );
            } else {
                this.showLocationPrompt(
                    "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
                );
            }
        } else {
            this.router.navigate([
                "post-verification-pending-list",
                { flag: "pending" },
            ]);
        }
    }
    getGetApplicationToWorkConfirm(roleId, userid) {
        var self = this;
        self.httpClient.showLoadingImage();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "rajkisan@123",
                srvnm: "PreVerification",
                srvmethodnm: "GetHortiApplicationToWorkConfirmAAO",
                srvparam: JSON.stringify({
                    userId: userid,
                    roleId: roleId,
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function (res: any) {
                console.log("res", res);
                if (res[0].status == 0) {
                    self.getHortiApplicationToWorkConfirmAAO = res[0].data;
                    console.log('self.getHortiApplicationToWorkConfirmAAO', self.getHortiApplicationToWorkConfirmAAO, self.getHortiApplicationToWorkConfirmAAO.length);

                } else {
                    console.log(res[0].message);

                    // if (res[0].data == "") {
                    //     self.showPrompt(res[0].message);
                    // } else {
                    //     self.showPrompt(res[0].data);
                    // }
                }
                self.httpClient.dismissLoadingImage();
            },
            (error) => {
                var errorRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "i75Q7Q6nYgW3rgEitGndNA==",
                        srvresponce: error,
                        userid: self.httpClient.userData.userid,
                        srvnm: "PreVerification",
                        srvmethodnm: "GetHortiApplicationToWorkConfirmAAO",
                        srvparam: JSON.stringify({
                            userId: userid,
                            roleId: roleId,
                        }),
                    },
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    gotoWorkConfirmationListPage(methodName) {
        if (this.isLocation == false) {
            this.getLoc();
            if (this.httpClient.currentLanguage == "english") {
                this.showLocationPrompt(
                    "You will have to enable the location or GPS permission for this app."
                );
            } else {
                this.showLocationPrompt(
                    "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
                );
            }
        } else {
            this.router.navigate(["work-confirmation-list", { methodName: methodName }]);
        }
    }

    selectRolePage() {
        this.router.navigate(["selectrole"]);
    }

    logoutPopUp() {
        if (this.httpClient.currentLanguage == "english") {
            this.showPrompt("Are you sure you want to logout");
        } else {
            this.showPrompt("क्या आप लॉग आउट करना चाहते हैं");
        }
    }

    logout() {
        var self = this;
        self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: "rajkisan",
                psw: "rajkisan@123",
                srvnm: "PreVerification",
                srvmethodnm: "logoutMobileuser",
                userid: self.userid,
                srvparam: JSON.stringify({ userid: self.userid }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function (temp) {
                var res: any = temp[0];
                console.log("res", res);
                if (res.status == 0) {
                    self.dbService.emptyStorage();
                    // self.storage.clear();
                    self.storage.remove('userData');
                    self.storage.remove('roleList');
                    self.httpClient.userList = '';
                    self.navCtrl.navigateRoot("login");
                } else {
                    self.httpClient.showToast(res.message);
                }
                self.httpClient.dismissLoading();
            },
            (error) => {
                self.httpClient.dismissLoading();
                var errorRequestData = {
                    obj: {
                        usrnm: "rajkisan",
                        psw: "i75Q7Q6nYgW3rgEitGndNA==",
                        srvnm: "PreVerification",
                        srvmethodnm: "logoutMobileuser",
                        userid: self.userid,
                        srvparam: JSON.stringify({ userid: self.userid }),
                    },
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
                header: "लॉग आउट",
                message: msg,
                backdropDismiss: false,

                buttons: [
                    {
                        text: "रद्द करें",
                        role: "cancel",
                        handler: () => {
                        },
                    },
                    {
                        text: "ठीक है",
                        handler: (data) => {
                            console.log("Ok clicked");
                            this.logout();
                        },
                    },
                ],
            });
            await prompt.present();
        } else {
            const alert = await this.alertCtrl.create({
                header: "Logout",
                message: msg,
                backdropDismiss: false,

                buttons: [
                    {
                        text: "Cancel",
                        role: "cancel",
                        handler: () => {
                        },
                    },
                    {
                        text: "OK",
                        handler: (data) => {
                            console.log("Ok clicked");
                            this.logout();
                        },
                    },
                ],
            });
            await alert.present();
        }
    }

    doRefresh(refresher) {
        this.getVerificationDashboard(this.roleId, this.userid);

        setTimeout(() => {
            console.log("Async operation has ended");
            refresher.complete();
        }, 2000);
    }

    getVersion() {
        var self = this;
        this.platform.ready().then(() => {
            var sendRequestData = {
                obj: {
                    usrnm: "rajkisan",
                    psw: "rajkisan@123",
                    srvnm: "PostVerification",
                    srvmethodnm: "GetPVAppversionByName",
                    srvparam: "{'appname':'PVapp'}",
                },
            };
            self.httpClient.post(sendRequestData).subscribe(
                function (temp) {
                    var res: any = temp[0];
                    console.log("res", res);

                    if (res.status == 0) {
                        if (
                            parseFloat(res.data[0].version) >
                            self.httpClient.currentAppVersion
                        ) {
                            let navigationExtras: NavigationExtras = {
                                queryParams: {
                                    param: res.data[0].version,
                                },
                            };
                            self.navCtrl.navigateRoot(["version-update"], navigationExtras);
                        }
                    } else {
                    }
                },
                (error) => {
                    self.httpClient.showToastError();
                }
            );
        });
    }

    back() {
    }

    async showLocationPrompt(msg) {
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
                            // navigator["app"].exitApp();
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
                            // navigator["app"].exitApp();
                        },
                    },
                ],
            });
            await alert.present();
        }
    }

    materialVerificationList() {
        if (this.isLocation == false) {
            this.getLoc();
            if (this.httpClient.currentLanguage == "english") {
                this.showLocationPrompt(
                    "You will have to enable the location or GPS permission for this app."
                );
            } else {
                this.showLocationPrompt(
                    "आपको इस ऐप के लिए लोकेशन और GPS की अनुमति को सक्षम करना होगा।"
                );
            }
        } else {
            this.router.navigate(["material-verification-list"]);
        }
    }

    materialVerificationCompletedList(param) {
        this.router.navigate(["material-completed-list", { actionType: param }]);
    }

    materialPendingGathered() {
        this.router.navigate(["material-pending-gathered"]);
    }


    async takePhoto() {
        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {
                let options: FileUploadOptions = {
                    fileKey: "files",
                    params: {
                        AppName: "PVapp",
                        IsDirectUpload: "True",
                    },
                };
                console.log("options.params", options.params);
                this.httpClient.showLoading();
                // this.fileTransfer
                //     .upload(imageData, this.httpClient.imageUploadUrl, options)
                //     .then(
                //         (data) => {
                //             console.log("data", data);
                //             this.httpClient.dismissLoading();
                //             // success
                //             var temp = JSON.parse(data.response);
                //             this.displayImage = this.billDetails.BillImg = temp[0].data;
                //         },
                //         (err) => {
                //             // error
                //             this.httpClient.dismissLoading();
                //             this.httpClient.showToastError();
                //         }
                //     );

                // console.log("this.displayImage", this.displayImage);


            },
            (err) => {
                // Handle error
            }
        );
    }
}
