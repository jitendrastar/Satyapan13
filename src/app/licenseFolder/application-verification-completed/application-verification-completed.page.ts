import { Component, OnInit } from '@angular/core';
import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {DatabaseServiceService} from '../../services/database-service.service';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {Storage} from '@ionic/storage';
import {File} from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";
import { Downloader, DownloadRequest, NotificationVisibility } from '@ionic-native/downloader/ngx';


@Component({
  selector: 'app-application-verification-completed',
  templateUrl: './application-verification-completed.page.html',
  styleUrls: ['./application-verification-completed.page.scss'],
})
export class ApplicationVerificationCompletedPage implements OnInit {
  ssp: any = [];
  straight: any = [];
  npk: any = [];
  checkList: any = [];
  createdChecklist: any = [];
  createdVChecklist: any = [];
  createdChecklistSSP: any = [];
  createdChecklistStraight: any = [];
  createdChecklistNPK: any = [];
  upcomingData: any;
  siteMap: any;
  docIsChecked: any;
  docRemarkCompleted: any;
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
  docRemark: any;

  toggleCheckList() {
    this.checkListClose = !this.checkListClose;
  }

  constructor(
      public photoViewer: PhotoViewer,
      private camera: Camera,
      private transfer: FileTransfer,
      public dbServices: DatabaseServiceService,
      public navCtrl: NavController,
      public router: Router,
      public route: ActivatedRoute,
      public alertCtrl: AlertController,
      public httpClient: CommonService,
      public storage: Storage,
      public platform: Platform,
      private downloader: Downloader,
      public file: File,
      private fileOpener: FileOpener,
      public modalController: ModalController,
      public androidPermissions: AndroidPermissions,
      public geolocation: Geolocation,
      public locationAccuracy: LocationAccuracy    ) {
    this.fileTransfer = this.transfer.create();
    this.upcomingData = JSON.parse(this.route.snapshot.paramMap.get('data'));
    console.log('this.upcomingData', this.upcomingData);
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


            self.docIsChecked = res.data[0].DocIsChecked;
            self.docRemarkCompleted = res.data[0].DocRemark;
            self.docId = res.data[0].DocumentId;
            for (var i = 0; i < self.checkList.length; i++) {
              if(self.checkList[i].PVFilePathInner ||self.checkList[i].PVFilePath)
              {
                self.checkList[i].isSelectedClose = false;
                self.checkList[i].isSelectedCheck = true;
              }
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
    console.log(extension);

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

      }
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

    } else {
      this.isSelectedCheckDoc = !this.isSelectedCheckDoc;
      if (this.isSelectedCloseDoc == true) {
        this.isSelectedCloseDoc = !this.isSelectedCloseDoc;

      }
      console.log('this.isSelectedCheckDoc', this.isSelectedCheckDoc);
      console.log('this.isSelectedCloseDoc', this.isSelectedCloseDoc);

    }

  }

  checkRadioChange(menufType) {
    console.log(menufType);
  }

  showImg(url) {
    this.photoViewer.show(url);

  }
}

