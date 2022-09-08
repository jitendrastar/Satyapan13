import {Component, OnInit} from '@angular/core';

import {AlertController, NavController, Platform, ModalController, NavParams} from '@ionic/angular';
import {CommonService} from 'src/app/services/common.service';

@Component({
    selector: 'app-assignmodal',
    templateUrl: './assignmodal.page.html',
    styleUrls: ['./assignmodal.page.scss'],
})
export class AssignmodalPage implements OnInit {
    upcomingIds: any;
    selectedAao: any;
    selectedAs: any;
    aaoList: any = [];
    asList: any = [];
    tempSelectedId: any;

    constructor(public navparams: NavParams, public httpClient: CommonService, public alertCtrl: AlertController, public viewCtrl: ModalController) {
        this.upcomingIds = this.navparams.get('value');
        console.log('this.upcomingIds', this.upcomingIds);
    }

    getASList() {
        console.log('this.selectedAao', this.selectedAao);
        this.tempSelectedId = this.selectedAao;
        var test = this.aaoList.filter((x) => x.Agri_UserId == this.selectedAao);
        var self = this;
        this.httpClient.showLoading();
        var sendRequestData = {
            'obj': {
                'usrnm': 'rajkisan',
                'psw': 'rajkisan@123',
                'srvnm': 'PreVerification',
                'srvmethodnm': 'GetAAOASDataUser',
                'srvparam': JSON.stringify({'userid': self.httpClient.userData.userid, AAOCircleId: test[0].AAOCircle_Id})
            }
        };

        self.httpClient.post(sendRequestData).subscribe(
            function(temp) {
                var res: any = temp[0];
                console.log('res', res);
                self.httpClient.dismissLoading();
                if (res.status == 0) {
                    self.asList = res.data;

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
                        'srvnm': 'PreVerification',
                        'srvmethodnm': 'GetAAOASDataUser',
                        'srvparam': JSON.stringify({'userid': self.httpClient.userData.userid})
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );

    }

    ionViewWillEnter() {
        var self = this;
        this.httpClient.showLoading();
        var sendRequestData = {
            'obj': {
                'usrnm': 'rajkisan',
                'psw': 'rajkisan@123',
                'srvnm': 'PreVerification',
                'srvmethodnm': 'GetAAOASDataUser',
                'srvparam': JSON.stringify({'userid': self.httpClient.userData.userid})
            }
        };

        self.httpClient.post(sendRequestData).subscribe(
            function(temp) {
                var res: any = temp[0];
                console.log('res', res);
                self.httpClient.dismissLoading();
                if (res.status == 0) {
                    self.aaoList = res.data;
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
                        'srvnm': 'PreVerification',
                        'srvmethodnm': 'GetAAOASDataUser',
                        'srvparam': JSON.stringify({'userid': self.httpClient.userData.userid})
                    }
                };
                console.log('errorRequestData new', errorRequestData);
                self.httpClient.getErrorMobileLogs(errorRequestData);
                self.httpClient.showToastError();
            }
        );
    }

    setValueAs() {
        this.tempSelectedId = this.selectedAs;
    }

    ngOnInit() {

    }

    modalClose() {
        this.viewCtrl.dismiss({data: null});
    }

    submit() {
        if (this.tempSelectedId) {
            var self = this;
            this.httpClient.showLoading();
            var sendRequestData = {
                'obj': {
                    'usrnm': 'rajkisan',
                    'psw': 'rajkisan@123',
                    'srvnm': 'PreVerification',
                    'srvmethodnm': 'ReAssignPVByAD',
                    'srvparam': JSON.stringify({
                        userid: self.httpClient.userData.userid,
                        NextUserId: self.tempSelectedId,
                        ApplicationId: self.upcomingIds,
                        // AppType: this.upcomingData.ApplicationType,

                    })
                }
            };
            self.httpClient.post(sendRequestData).subscribe(
                function(temp) {
                    var res: any = temp[0];
                    console.log('res', res);
                    self.httpClient.dismissLoading();
                    if (res.status == 0) {
                        self.showToast(res.message);

                    } else {
                        self.showToast(res.message);
                    }
                },
                (error) => {
                    var errorRequestData = {
                        'obj': {
                            'usrnm': 'rajkisan',
                            'psw': 'rajkisan@123',
                            srvresponce: error,
                            userid: self.httpClient.userData.userid,
                            'srvnm': 'PreVerification',
                            'srvmethodnm': 'ReAssignPVByAD',
                            'srvparam': JSON.stringify({
                                'userid': self.httpClient.userData.userid,
                                NextUserId: self.tempSelectedId,
                                ApplicationId: self.upcomingIds,
                                // AppType: this.upcomingData.ApplicationType,

                            })
                        }
                    };
                    console.log('errorRequestData new', errorRequestData);
                    self.httpClient.getErrorMobileLogs(errorRequestData);
                    self.httpClient.showToastError();
                }
            );
        } else {
            this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया AAO का चयन करें ' : 'Please select AAO');

        }


    }

    async showToast(message) {
        this.httpClient.dismissLoading();
        if (this.httpClient.currentLanguage == "hindi") {
            const alert = await this.alertCtrl.create({
                header: "अलर्ट!",
                message: message,
                backdropDismiss: false,
                buttons: [
                    {
                        text: "ठीक है",
                        role: "cancel",
                        handler: () => {
                            console.log("Cancel clicked");
                            this.modalClose();
                        },
                    },
                ],            });
            await alert.present();
        } else {
            const alert = await this.alertCtrl.create({
                header: "Alert!",
                message: message,
                backdropDismiss: false,
                buttons: [
                    {
                        text: "Ok",
                        role: "cancel",
                        handler: () => {
                            console.log("Ok clicked");
                            this.modalClose();

                        },
                    },
                ],            });
            await alert.present();
        }
    }
}
