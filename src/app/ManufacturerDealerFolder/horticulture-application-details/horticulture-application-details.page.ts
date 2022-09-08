import {HttpClient} from '@angular/common/http';
import {Component, NgZone, OnInit} from '@angular/core';
import {
    AlertController,
    ModalController,
    NavController,
} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {Storage} from '@ionic/storage';
import {CommonService} from '../../services/common.service';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {HortiApplicationBillModelPage} from '../horti-application-bill-model/horti-application-bill-model.page';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {
    FileTransfer,
    FileUploadOptions,
    FileTransferObject,
} from '@ionic-native/file-transfer/ngx';

import {File} from '@ionic-native/file/ngx';
import {DatabaseServiceService} from '../../services/database-service.service';

@Component({
    selector: 'app-horticulture-application-details',
    templateUrl: './horticulture-application-details.page.html',
    styleUrls: ['./horticulture-application-details.page.scss'],
})
export class HorticultureApplicationDetailsPage {
    remarks: any = '';

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
    oldDocImgUrl: any = 'weqwdasd';

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
    year: any;
    oneYearFromNow: any;

    listOfPipeType: any = [];
    listOfISIMarks: any = [];
    capacitySizeData: any = [];
    unitCost: any;
    selectedPipe: any;
    selectedPipeName: any;

    optionalItemNameValue: any;
    capacitySizeDataValue: any;
    optionalArray: any = [];
    unitCostValue: any;
    multiUserArray: any = [];
    subsidyList: any = [
        {
            id: '2',
            name: 'Raingun'
        }, {
            id: '3',
            name: 'Sprinkler'
        }, {
            id: '10',
            name: 'Micro Sprinkler'
        }, {
            id: '11',
            name: 'Drip Irrigation'
        }, {
            id: '16',
            name: 'Mini Sprinkler'
        },
    ];
    getCouplerSizeHectareModelAmountOffline: any = [
        {CouplerSizeId: 1, HectareModelId: 1, Amount: 11930, SubsidyId: 3},
        {CouplerSizeId: 2, HectareModelId: 1, Amount: 0, SubsidyId: 3},
        {CouplerSizeId: 3, HectareModelId: 1, Amount: 0, SubsidyId: 3},
        {CouplerSizeId: 1, HectareModelId: 2, Amount: 19542, SubsidyId: 3},
        {CouplerSizeId: 2, HectareModelId: 2, Amount: 21901, SubsidyId: 3},
        {CouplerSizeId: 3, HectareModelId: 2, Amount: 21901, SubsidyId: 3},
        {CouplerSizeId: 1, HectareModelId: 3, Amount: 28213, SubsidyId: 3},
        {CouplerSizeId: 2, HectareModelId: 3, Amount: 31372, SubsidyId: 3},
        {CouplerSizeId: 3, HectareModelId: 3, Amount: 31372, SubsidyId: 3},
        {CouplerSizeId: 1, HectareModelId: 4, Amount: 0, SubsidyId: 3},
        {CouplerSizeId: 2, HectareModelId: 4, Amount: 0, SubsidyId: 3},
        {CouplerSizeId: 3, HectareModelId: 4, Amount: 42345, SubsidyId: 3},
        {CouplerSizeId: 1, HectareModelId: 5, Amount: 0, SubsidyId: 3},
        {CouplerSizeId: 2, HectareModelId: 5, Amount: 0, SubsidyId: 3},
        {CouplerSizeId: 3, HectareModelId: 5, Amount: 53404, SubsidyId: 3},
        {CouplerSizeId: 1, HectareModelId: 6, Amount: 0, SubsidyId: 3},
        {CouplerSizeId: 2, HectareModelId: 6, Amount: 0, SubsidyId: 3},
        {CouplerSizeId: 3, HectareModelId: 6, Amount: 60459, SubsidyId: 3},
        {CouplerSizeId: 1, HectareModelId: 1, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 2, HectareModelId: 1, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 3, HectareModelId: 1, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 1, HectareModelId: 2, Amount: 28681, SubsidyId: 2},
        {CouplerSizeId: 2, HectareModelId: 2, Amount: 34513, SubsidyId: 2},
        {CouplerSizeId: 3, HectareModelId: 2, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 1, HectareModelId: 3, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 2, HectareModelId: 3, Amount: 43786, SubsidyId: 2},
        {CouplerSizeId: 3, HectareModelId: 3, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 1, HectareModelId: 4, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 2, HectareModelId: 4, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 3, HectareModelId: 4, Amount: 56818, SubsidyId: 2},
        {CouplerSizeId: 1, HectareModelId: 5, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 2, HectareModelId: 5, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 3, HectareModelId: 5, Amount: 65856, SubsidyId: 2},
        {CouplerSizeId: 1, HectareModelId: 6, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 2, HectareModelId: 6, Amount: 0, SubsidyId: 2},
        {CouplerSizeId: 3, HectareModelId: 6, Amount: 72322, SubsidyId: 2}
    ];

    toggleMultiuserClose = false;

    toggleMultiuser() {
        this.toggleMultiuserClose = !this.toggleMultiuserClose;
    }

    arr = [];
    landArea: any;
    amt: any;
    docUrl: any;
    subsidyId: any;


    showLoader: boolean = false;
    p_bar_value: number = 0;
    uploadPercent: any = 0;

    IsFarmerAcceptance: any = 'Yes';
    isFarmerAcceptanceRemark: any = '';
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
        private route: ActivatedRoute, private ngZone: NgZone,
        public zone: NgZone, public httpClient: CommonService,
        public dbService: DatabaseServiceService
    ) {
        console.log('Sprinkler');
        this.fileTransfer = this.transfer.create();
        this.data = JSON.parse(this.route.snapshot.paramMap.get('data'));
        if (this.data.MultiApplicant) {


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

        this.oneYearFromNow = new Date().getFullYear() - 7;
        console.log('oneYearFromNow', this.oneYearFromNow);

        for (let i = 0.20; i < parseFloat("4.99") + 0.01; i = i + 0.01) {
            this.arr.push({
                value: i.toFixed(2)
            });
        }
        console.log('arr ', this.arr);

        // console.log('coming Data', this.data);
        // console.log('coming HectareModel', this.data.HectareModel);
        // console.log('coming pipesize', this.data.PipeSize);


        // console.log('coming brandData', this.brandData);
        this.getVerificationChecklistData(this.data.ApplicationId);
        this.getHorticultureManufactureListData();

        this.getGetHortiHectareModelRangelist();
        this.GetHortiCouplerSizelist();
        // this.getGetPVOptionalItemList();
        // this.getHorticultureCouplerComponentList();
        // this.getHorticultureCouplerComponentList(
        //   this.data.HectareModel,
        //   this.data.PipeId
        // );


        if (!this.httpClient.isOffline) {
            this.brandData = JSON.parse(this.route.snapshot.paramMap.get('brandData'));

            if (parseInt(this.data.PostVerificationId) > 0) {
                this.basicDataSubmitFlag = false;
                this.billandPhotoFlag = true;
                this.postVerificationId = this.data.PostVerificationId;
                if (this.data.ImgFarmerWithOfficer != '' && this.data.ImgFarmerWithOfficer != null) {
                    this.imgSprinklerWithFarmeDateTime = new Date();
                }
                if (this.data.ImgSourceOfIrrigation != '' && this.data.ImgSourceOfIrrigation != null) {
                    this.imgSourceOfIrrigationDateTime = new Date();
                }

                this.getBills();
            }
        } else {
            if (this.data.basicDataSubmission) {
                this.basicDataSubmitFlag = false;
                this.billandPhotoFlag = true;
                if (this.data.ImgFarmerWithOfficer) {
                    this.imgSprinklerWithFarmeDateTime = this.data.imgSprinklerWithFarmeDateTime;
                }
                if (this.data.ImgSourceOfIrrigation) {
                    this.imgSourceOfIrrigationDateTime = this.data.imgSourceOfIrrigationDateTime;
                }


                if (this.data.billDetails) {
                    this.billArray = this.data.billDetails;

                }
                //
            }
        }


        this.getHorticultureCouplerComponentList();
        this.getISILIST();
    }

    /*
    getCML(i, ComponentName) {
      var self = this;
      if (!this.manufacturerValue) {
        if (this.httpClient.currentLanguage == "hindi") {
          this.httpClient.showToast("कृपया निर्माता का चयन करें");
        } else {
          this.httpClient.showToast("Please select the manufacturer");
        }
      } else {
        self.httpClient.showLoading();

        var sendRequestData = {
          obj: {
            usrnm: "rajkisan",
            psw: "rajkisan@123",
            srvnm: "PostVerification",
            srvmethodnm: "GetIsiAndCMLList",
            srvparam: JSON.stringify({
              HorticultureManufactureId: this.manufacturerValue,
              ComponentName: ComponentName,
              schemeid: "3",
              ISI_Mark: this.getHorticultureCouplerComponentListData[i]
                .ISI_MarkID,
            }),
          },
        };
        var sendRequestData2 = {
          obj: {
            usrnm: "rajkisan",
            psw: "rajkisan@123",
            srvnm: "PostVerification",
            srvmethodnm: "GetIsiAndCMLList",
            srvparam: {
              HorticultureManufactureId: this.manufacturerValue,
              ComponentName: ComponentName,
              schemeid: "3",
              ISI_Mark: this.getHorticultureCouplerComponentListData[i]
                .ISI_MarkID,
            },
          },
        };
        console.log("sendRequestData2", JSON.stringify(sendRequestData2));
        this.httpClient.post(sendRequestData).subscribe(
          function (res: any) {
            console.log("res", res);
            self.httpClient.dismissLoading();
            if (res[0].status == 0) {
              self.getHorticultureCouplerComponentListData[
                i
              ].cmlData = res[0].data[0].CML_No.split(",");
              // self.listOfISIMarks = res[0].data;
              console.log(
                "self.getHorticultureCouplerComponentListData[i].cmlData",
                self.getHorticultureCouplerComponentListData[i].cmlData
              );
            } else {
              self.httpClient.showToast(res[0].data);
            }
            // self.httpClient.(res[0].message);
          },
          (error) => {
            // self.httpClient.dismissLoading();
            self.httpClient.showToastError();
          }
        );
      }
    }
  */
    getISILIST() {
        if (this.httpClient.isOffline) {
            this.listOfISIMarks = this.data.listOfISIMarks;
        } else {
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
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log('res', res);
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
    }

    reflactSelectedPipeInCOmponentTable(ev) {
        console.log('EV', ev.target.value);
        console.log('this.selectedPipe', this.selectedPipe);
        for (
            var i = 0;
            i < this.getHorticultureCouplerComponentListData.length;
            i++
        ) {
            for (var k = 0; k < this.listOfPipeType.length; k++) {
                if (
                    this.getHorticultureCouplerComponentListData[i].ComponentId ==
                    this.listOfPipeType[k].ComponentId
                ) {
                    this.getHorticultureCouplerComponentListData[i].IsTempRemove = '1';
                }
            }

            if (
                this.getHorticultureCouplerComponentListData[i].ComponentId ==
                ev.target.value
            ) {
                this.getHorticultureCouplerComponentListData[i].IsTempRemove = '0';
            }
        }

        var test = this.listOfPipeType.filter((x) => x.ComponentId == this.selectedPipe);
        this.selectedPipeName = test[0].ComponentName;
        console.log('this.selectedPipeName', this.selectedPipeName);
        // if (ev.target.value ==this.getHorticultureCouplerComponentListData[i].ComponentId) {
        //   this.getHorticultureCouplerComponentListData[i].IsTempRemove = "0";
        // }
        // else if (this.getHorticultureCouplerComponentListData[i].IsTempRemove == "0") {

        // }
    }

    getBills() {
        var self = this;
        // self.httpClient.showLoading();
        var sendRequestData = {
            obj: {
                usrnm: 'rajkisan',
                psw: 'rajkisan@123',
                srvnm: 'PostVerification',
                srvmethodnm: 'GetPostVerificationBillDetails',
                srvparam: JSON.stringify({
                    ApplicationId: this.data.ApplicationId,
                    SubsidySchemeId: this.data.SubsidySchemeId,
                }),
            },
        };
        this.httpClient.post(sendRequestData).subscribe(
            function(res: any) {
                console.log('res', res);
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
                        srvnm: 'PostVerification',
                        srvmethodnm: 'GetPostVerificationBillDetails',
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
        console.log('ionViewDidLoad AaoVerificationPage');
    }

    ionViewWillEnter() {
        console.log('ionViewWillEnter AaoVerificationPage');
        this.getLoc();
    }

    getVerificationChecklistData(hortiSubsidyApplicationId) {
        if (this.httpClient.isOffline) {
            this.getVerificationCheckData = this.data.getVerificationCheckData;
        } else {
            var self = this;
            self.httpClient.showLoadingImage();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'VerificationChecklist',
                    srvparam: JSON.stringify({
                        schemeid: this.data.SubsidySchemeId,
                        StepName: 'Post Verification',
                        ApplicationId: this.data.ApplicationId,
                    }),
                },
            };
            console.log('VerificationChecklistt - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log(' VerificationChecklist res', res);
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
                            srvnm: 'PostVerification',
                            srvmethodnm: 'VerificationChecklist',
                            srvparam: JSON.stringify({
                                schemeid: self.data.SubsidySchemeId,
                                StepName: 'Post Verification',
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

    /*

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
                console.log('getPVOptionalItemListData ---RS----', self.getPVOptionalItemListData);

                var optionalItemGroupId1 = this.getPVOptionalItemListData.filter((x) => x.OptionalItemGroupId=='1');
                var optionalItemGroupId2 = this.getPVOptionalItemListData.filter((x) => x.OptionalItemGroupId=='2');
                var optionalItemGroupId3 = this.getPVOptionalItemListData.filter((x) => x.OptionalItemGroupId=='3');
                console.log('optionalItemGroupId1',optionalItemGroupId1);
                console.log('optionalItemGroupId2',optionalItemGroupId2);
                console.log('optionalItemGroupId3',optionalItemGroupId3);
                // this.httpClient.post(sendRequestData).subscribe(
                //     function(res: any) {
                //         console.log(' GetPVOptionalItemList res', res);
                //         self.httpClient.dismissLoading();
                //
                //         if (res[0].status == 0) {
                //             self.getPVOptionalItemListData = res[0].data;
                //         } else {
                //             self.showPrompt(res[0].data);
                //         }
                //     },
                //     (error) => {
                //         // self.httpClient.dismissLoading();
                //         self.httpClient.showToastError();
                //     }
                // );
            }
        }
        getCapacitySizeData(optionalItemNameValue) {
            console.log('optionalItemNameValue',optionalItemNameValue);
            this.capacitySizeDataValue='';
            this.unitCost='';
            var capacitySizeData = this.getPVOptionalItemListData.filter((x) => x.OptionalItemGroupId==optionalItemNameValue);
            console.log('capacitySizeData - ',capacitySizeData);
            this.capacitySizeData=capacitySizeData;
            // for(let i=0;i<capacitySizeData.length;i++) {
            //     this.capacitySizeData.push({
            //         HortiOptionalItemId: capacitySizeData[i].HortiOptionalItemId,
            //         CapacitySize:capacitySizeData[i].CapacitySize,
            //     });
            // }
        }
    */

    getUnitCostValueData(HortiOptionalItemId) {

        console.log('capacitySizeDataValue', HortiOptionalItemId);
        var unitCostData = this.capacitySizeData.filter((x) => x.HortiOptionalItemId == HortiOptionalItemId);
        console.log('unitCostData - ', unitCostData);
        this.unitCost = unitCostData[0].UnitCost;


    }

    /*
        getOptionalArray(){
                var optionalItemNameValue;
                var capacitySizeDataValue;
            for(let i = 0 ;i<this.optionalItemName.length;i++)
            {
                if(this.optionalItemNameValue==this.optionalItemName[i].optionalItemId){
                    optionalItemNameValue=this.optionalItemName[i].optionalItemName
                }
            }

            for(let j = 0 ;j<this.capacitySizeData.length;j++)
            {
                if(this.capacitySizeDataValue==this.capacitySizeData[j].HortiOptionalItemId){
                    capacitySizeDataValue=this.capacitySizeData[j].CapacitySize
                }
            }

              this.optionalArray.push({
                  optionalItemNameValue:optionalItemNameValue,
                  HortiOptionalItemId:this.capacitySizeDataValue,
                  capacitySizeDataValue:capacitySizeDataValue,
                  unitCost:this.unitCost,
               });
            console.log('optionalArray',this.optionalArray);
        }
    */

    deleteOptional(index) {
        this.optionalArray.splice(index, 1);
        console.log('this.optionalArray in deleteOptional', this.optionalArray);
    }

    getHorticultureManufactureListData() {
        if (this.httpClient.isOffline) {
            this.getHorticultureManufactureData = this.data.getHorticultureManufactureData;
        } else {
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
            console.log('HorticultureManufactureList - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log(' HorticultureManufactureList res', res);
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
    }

    getHorticultureManufactureDealerList(manufacturerId, protoTypeId) {
        if (this.httpClient.isOffline) {
            this.getHorticultureManufactureDealerListData = this.data.getHorticultureManufactureDealerListData;
        } else {
            var self = this;
            self.dealerValue = '';
            self.httpClient.showLoadingImage();
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'GetHorticultureManufactureDealerList',
                    srvparam:
                        '{\'HorticultureManufactureId\':\'' +
                        manufacturerId +
                        '\',\'ProductTypeId\':\'' +
                        1 +
                        '\'}',
                },
            };
            console.log('GetHorticultureManufactureDealerList - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    console.log(' GetHorticultureManufactureDealerList res', res);
                    self.httpClient.dismissLoadingImage();

                    if (res[0].status == 0) {
                        self.getHorticultureManufactureDealerListData = res[0].data;
                    } else {
                        self.showPrompt(res[0].data);
                        self.getHorticultureManufactureDealerListData = '';
                        self.dealerValue = '';

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
                                manufacturerId +
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
                            // this.navCtrl.pop();
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
                    ' getting  location',
                    resp.coords.latitude + '-----' + resp.coords.longitude
                );
                this.latitude = resp.coords.latitude;
                this.longitude = resp.coords.longitude;
            })
            .catch((error) => {
                this.showPrompt('Error getting Source Of Irrigation location');
            });
    }

    getAddSprinklerPostVerification() {
        this.getLoc();

        // var test = this.getHorticultureCouplerComponentListData.filter((x) => x.BatchNo == '' && x.StandardQuantity != '0');
        // var test2 = this.getHorticultureCouplerComponentListData.filter((x) => x.CML_NoID == '' && x.StandardQuantity != '0');
        // var test3 = this.getHorticultureCouplerComponentListData.filter((x) => x.ISI_MarkID == '0' && x.StandardQuantity != '0');
        // var test4 = this.getHorticultureCouplerComponentListData.filter((x) => x.InstalledQty == '0' && x.StandardQuantity != '0');
        // var test5 = this.getHorticultureCouplerComponentListData.filter((x) => x.EstimatedQty == '0' && x.StandardQuantity != '0');

        var self = this;
        console.log(this.hortiHectareModelRange, this.hortiCouplerSize, this.getCouplerSizeHectareModelAmount);
        if (this.hortiHectareModelRange == null || this.hortiHectareModelRange == '') {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया हेक्टेयर मॉडल का चयन करें');
            } else {
                this.httpClient.showToast('Please select Hectare Model');
            }
        } else if (this.hortiCouplerSize == null || this.hortiCouplerSize == '') {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया कपलर साइज का चयन करें');
            } else {
                this.httpClient.showToast('Please select Coupler Size');
            }
        } else if (this.getCouplerSizeHectareModelAmount == null || this.getCouplerSizeHectareModelAmount <= 0) {
            if (this.httpClient.currentLanguage == 'english') {
                this.httpClient.showToast('Coupler Amount Should not be 0!!!');
            } else {
                this.httpClient.showToast('कपलर राशि 0 नहीं होनी चाहिए');

            }
        } else if (this.manufacturerValue == null) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया निर्माता का चयन करें');
            } else {
                this.httpClient.showToast('Please select the manufacturer');
            }
        } else if (this.dealerValue == null || this.dealerValue == '') {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया विक्रेता का चयन करें');
            } else {
                this.httpClient.showToast('Please select the dealer');
            }
        } else if (this.selectedPipe == null) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया पाइप के प्रकार का चयन करें');
            } else {
                this.httpClient.showToast('Please select the pipe type');
            }
        } else if (this.brandValue == null) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया ब्रांड का चयन करें');
            } else {
                this.httpClient.showToast('Please select the brand');
            }
        } else if (
            this.getVerificationCheckData.length != self.ChecklistDetailList.length
        ) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया चेकलिस्ट को पूरा करें');
            } else {
                this.httpClient.showToast('Please complete the checklist');
            }
        }
            // else if (
            //     test.length > 2 ||
            //     test2.length > 2 ||
            //     test3.length > 2 ||
            //     test4.length > 2 ||
            //     test5.length > 2
            // ) {
            //     if (this.httpClient.currentLanguage == 'hindi') {
            //         this.httpClient.showToast('कृपया घटक तालिका को पूरा करें');
            //     } else {
            //         this.httpClient.showToast('Please complete the component table');
            //     }
        // }
        else {

            if (this.httpClient.isOffline) {
                // var tempTable = [];
                // for (var j = 0; j < this.getHorticultureCouplerComponentListData.length; j++) {
                //     if (
                //         this.getHorticultureCouplerComponentListData[j].IsTempRemove == '0' ||
                //         this.getHorticultureCouplerComponentListData[j].IsTempRemove == '2'
                //     ) {
                //         tempTable.push({
                //             BatchNo: this.getHorticultureCouplerComponentListData[j].BatchNo,
                //             CML_NoID: this.getHorticultureCouplerComponentListData[j].CML_NoID,
                //             ComponentId: this.getHorticultureCouplerComponentListData[j]
                //                 .ComponentId,
                //             ComponentName: this.getHorticultureCouplerComponentListData[j]
                //                 .ComponentName,
                //             EstimatedQty: this.getHorticultureCouplerComponentListData[j]
                //                 .EstimatedQty,
                //             Ha: this.getHorticultureCouplerComponentListData[j].Ha,
                //             ISI_MarkID: this.getHorticultureCouplerComponentListData[j]
                //                 .ISI_MarkID,
                //             InstalledQty: this.getHorticultureCouplerComponentListData[j]
                //                 .InstalledQty,
                //             IsTempRemove: this.getHorticultureCouplerComponentListData[j]
                //                 .IsTempRemove,
                //             StandardQuantity: this.getHorticultureCouplerComponentListData[j]
                //                 .StandardQuantity,
                //         });
                //     }
                // }
                console.log('tempTable', tempTable);
                this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfSprinkler WHERE ApplicationId = ?',
                    [this.data.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    temp.basicDataSubmission = {
                        IsFarmerAcceptance: 'Yes',
                        ApplicationId: this.data.ApplicationId,
                        SubsidySchemeId: self.data.SubsidySchemeId,
                        mobilToVerify: '',
                        latitude: self.latitude,
                        longitude: self.longitude,
                        ChecklistDetailList: self.ChecklistDetailList,
                        HectareModelId: self.hortiHectareModelRange,
                        CouplerSizeId: self.hortiCouplerSize,

                        SprinklerComponentinfo: this.getHorticultureCouplerComponentListData,
                        UserId: self.httpClient.userData.userid,
                        RoleId: self.httpClient.userData.roleid,
                        AppVersion: self.httpClient.currentAppVersion,
                        Step: '1',
                        IsOnline_Offline: '1',
                        BrandId: this.manufacturerValue,
                        dealerid: this.dealerValue,
                        manufactureid: this.manufacturerValue,
                    };
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                        .then(() => {
                            self.basicDataSubmitFlag = false;
                            self.billandPhotoFlag = true;
                            self.httpClient.showToast('Basic data is save now upload the required photos and bills');


                        })
                        .catch((e) => {
                            console.log('error ' + JSON.stringify(e));
                        });

                })
                    .catch((e) => {
                        alert('error ' + JSON.stringify(e));
                    });
            } else {


                var tempTable = [];
                for (var j = 0; j < this.getHorticultureCouplerComponentListData.length; j++) {
                    if (
                        this.getHorticultureCouplerComponentListData[j].IsTempRemove == '0' ||
                        this.getHorticultureCouplerComponentListData[j].IsTempRemove == '2'
                    ) {
                        tempTable.push({
                            BatchNo: this.getHorticultureCouplerComponentListData[j].BatchNo,
                            CML_NoID: this.getHorticultureCouplerComponentListData[j].CML_NoID,
                            ComponentId: this.getHorticultureCouplerComponentListData[j]
                                .ComponentId,
                            ComponentName: this.getHorticultureCouplerComponentListData[j]
                                .ComponentName,
                            EstimatedQty: this.getHorticultureCouplerComponentListData[j]
                                .EstimatedQty,
                            Ha: this.getHorticultureCouplerComponentListData[j].Ha,
                            ISI_MarkID: this.getHorticultureCouplerComponentListData[j]
                                .ISI_MarkID,
                            InstalledQty: this.getHorticultureCouplerComponentListData[j]
                                .InstalledQty,
                            IsTempRemove: this.getHorticultureCouplerComponentListData[j]
                                .IsTempRemove,
                            StandardQuantity: this.getHorticultureCouplerComponentListData[j]
                                .StandardQuantity,
                        });
                    }
                }
                console.log('tempTable', tempTable);
                console.log('getHorticultureCouplerComponentListData', this.getHorticultureCouplerComponentListData);
                self.httpClient.showLoading();
                var sendRequestData = {
                    obj: {
                        usrnm: 'rajkisan',
                        psw: 'rajkisan@123',
                        srvnm: 'PostVerification',
                        srvmethodnm: 'AddSprinklerPostVerification',
                        srvparam: JSON.stringify({
                            IsFarmerAcceptance: 'Yes',
                            ApplicationId: this.data.ApplicationId,
                            SubsidySchemeId: self.data.SubsidySchemeId,
                            mobilToVerify: '',
                            latitude: self.latitude,
                            longitude: self.longitude,
                            ChecklistDetailList: self.ChecklistDetailList,
                            HectareModelId: self.hortiHectareModelRange,
                            CouplerSizeId: self.hortiCouplerSize,
                            SprinklerComponentinfo: this.getHorticultureCouplerComponentListData,
                            UserId: self.httpClient.userData.userid,
                            RoleId: self.httpClient.userData.roleid,
                            AppVersion: self.httpClient.currentAppVersion,
                            Step: '1',
                            IsOnline_Offline: '1',
                            BrandId: this.manufacturerValue,
                            dealerid: this.dealerValue,
                            manufactureid: this.manufacturerValue,
                        }),
                    },
                };
                console.log('AddSprinklerPostVerification - ', sendRequestData);
                this.httpClient.post(sendRequestData).subscribe(
                    function(res: any) {
                        console.log(' AddSprinklerPostVerification res', res);
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
                        var errorRequestData = {
                            'obj': {
                                'usrnm': 'rajkisan',
                                'psw': 'rajkisan@123',
                                srvresponce: error,
                                userid: self.httpClient.userData.userid,
                                srvnm: 'PostVerification',
                                srvmethodnm: 'AddSprinklerPostVerification',
                                srvparam: JSON.stringify({
                                    IsFarmerAcceptance: 'Yes',
                                    ApplicationId: self.data.ApplicationId,
                                    SubsidySchemeId: self.data.SubsidySchemeId,
                                    mobilToVerify: '',
                                    latitude: self.latitude,
                                    longitude: self.longitude,
                                    ChecklistDetailList: self.ChecklistDetailList,
                                    HectareModelId: self.hortiHectareModelRange,
                                    CouplerSizeId: self.hortiCouplerSize,
                                    SprinklerComponentinfo: tempTable,
                                    UserId: self.httpClient.userData.userid,
                                    RoleId: self.httpClient.userData.roleid,
                                    AppVersion: self.httpClient.currentAppVersion,
                                    Step: '1',
                                    IsOnline_Offline: '1',
                                    BrandId: self.manufacturerValue,
                                    dealerid: self.dealerValue,
                                    manufactureid: self.manufacturerValue,
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
                    fileKey: 'files',
                    params: {
                        AppName: 'PVapp',
                        IsDirectUpload: 'True',
                    },
                };
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfSprinkler WHERE ApplicationId = ?', [this.data.ApplicationId]).then((res) => {
                        console.log('second');
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        console.log('third');
                        if (param == 1) {
                            temp.photoFarmerWithOfficerNoCase = imageData;
                            temp.optionOfphotoFarmerWithOfficerNoCase = options;
                        } else if (param == 4) {
                            temp.photoFarmerApprovalCertificateNoCase = imageData;
                            temp.optionOfphotoFarmerApprovalCertificateNoCase = options;
                        }

                        let data = temp;
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfSprinkler
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
                                console.log('err one');
                                console.log('error ' + e + JSON.stringify(e));
                            });

                    })
                        .catch((e) => {
                            console.log('err two', e);
                            alert('error ' + e + JSON.stringify(e));
                        });
                } else {
                    this.httpClient.showLoading();
                    this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then((data) => {
                            this.httpClient.dismissLoading();
                            // success
                            var temp = JSON.parse(data.response);
                            console.log('temp[0].data', temp[0].data);
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
                            console.log('err', err);
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
        console.log('isFarmerAcceptanceRemark', this.isFarmerAcceptanceRemark);
        console.log('photoFarmerApprovalCertificate', this.photoFarmerApprovalCertificate);
        console.log('noCaseDateOfImgLetter', this.noCaseDateOfImgLetter);
        console.log('photoFarmerWithOfficer', this.photoFarmerWithOfficer);
        console.log('noCaseDateOfImgFarmer', this.noCaseDateOfImgFarmer);
        if (this.httpClient.latitude == null) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast(
                    'कृपया इस एप्लिकेशन के लिए लोकेशन सक्षम करें फिर सबमिट करें'
                );
            } else {
                this.httpClient.showToast(
                    'Please enable the location for this application then submit'
                );
            }
        } else if (this.httpClient.longitude == null) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast(
                    'कृपया इस एप्लिकेशन के लिए लोकेशन सक्षम करें फिर सबमिट करें'
                );
            } else {
                this.httpClient.showToast(
                    'Please enable the location for this application then submit'
                );
            }
        } else if (this.photoFarmerWithOfficer == null) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया कृषक व कार्मिक का फोटो लेंवे');
            } else {
                this.httpClient.showToast(
                    'Please Upload the photo of Farmer and Officer'
                );
            }
        } else if (this.photoFarmerApprovalCertificate == null) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया असहमति पत्र का फोटो अपलोड करें');
            } else {
                this.httpClient.showToast(
                    'Please Upload the photo of not acceptance later'
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
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'AddSprinklerPostVerification',
                    srvparam: JSON.stringify({
                        ApplicationId: this.data.ApplicationId,
                        userid: self.httpClient.userData.userid,
                        WaterStorageType: '0',
                        SubsidySchemeId: this.data.SubsidySchemeId,
                        latitude: this.lat,
                        longitude: this.lng,
                        roleid: self.httpClient.userData.roleid,
                        radius: '0',
                        Length: '0',
                        Width: '0',
                        LengthUpper: '0',
                        LengthBottom: '0',
                        WidthUpper: '0',
                        WidthBottom: '0',

                        Height: '0',
                        AppVersion: 'V.' + this.httpClient.currentAppVersion,
                        IsOnline_Offline: tempOfflineFlag,
                        mobilToVerify: '1',
                        IsFarmerAcceptance: 'No',
                        Remarks: this.isFarmerAcceptanceRemark,
                        // MicroIrrPlantOnWaterStorage: "0",
                        IrrigationTypeId: '0',
                        MicroIrrigationId: '0',
                        NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                        NotAcceptanceDocPathDateTime: this.noCaseDateOfImgLetter,
                        ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                        ImgFarmerWithOfficerDateTime: this.noCaseDateOfImgFarmer,
                    }),
                },
            };

            console.log('sendRequestData', sendRequestData);
            if (this.httpClient.isOffline == true) {
                var noDataOffline = {
                    ApplicationId: this.data.ApplicationId,
                    userid: self.httpClient.userData.userid,
                    WaterStorageType: '0',
                    SubsidySchemeId: this.data.SubsidySchemeId,
                    latitude: this.lat,
                    longitude: this.lng,
                    roleid: self.httpClient.userData.roleid,
                    radius: '0',
                    Length: '0',
                    Width: '0',
                    LengthUpper: '0',
                    LengthBottom: '0',
                    WidthUpper: '0',
                    WidthBottom: '0',
                    Height: '0',
                    AppVersion: 'V.' + this.httpClient.currentAppVersion,
                    IsOnline_Offline: tempOfflineFlag,
                    mobilToVerify: '1',
                    IsFarmerAcceptance: 'No',
                    Remarks: this.isFarmerAcceptanceRemark,

                    // MicroIrrPlantOnWaterStorage: "0",
                    IrrigationTypeId: '0',
                    MicroIrrigationId: '0',
                    NotAcceptanceDocPath: this.photoFarmerApprovalCertificate,
                    NotAcceptanceDocPathDateTime: this.noCaseDateOfImgLetter,
                    ImgFarmerWithOfficer: this.photoFarmerWithOfficer,
                    ImgFarmerWithOfficerDateTime: this.noCaseDateOfImgFarmer,
                };
                this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfSprinkler WHERE ApplicationId = ?', [this.data.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);

                    temp.finalSubmission = noDataOffline;

                    console.log('temp', temp);
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                        .then(() => {
                            this.successAlertFinalSubmission();
                        })
                        .catch((e) => {
                            console.log('error ' + JSON.stringify(e));
                        });

                })
                    .catch((e) => {
                        alert('error ' + JSON.stringify(e));
                    });


            } else {
                self.httpClient.showLoading();
                this.httpClient.post(sendRequestData).subscribe(
                    function(res: any) {
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
                                srvnm: 'PostVerification',
                                srvmethodnm: 'AddSprinklerPostVerification',
                                srvparam: JSON.stringify({
                                    ApplicationId: self.data.ApplicationId,
                                    userid: self.httpClient.userData.userid,
                                    WaterStorageType: '0',
                                    SubsidySchemeId: self.data.SubsidySchemeId,
                                    latitude: self.lat,
                                    longitude: self.lng,
                                    roleid: self.httpClient.userData.roleid,
                                    radius: '0',
                                    Length: '0',
                                    Width: '0',
                                    LengthUpper: '0',
                                    LengthBottom: '0',
                                    WidthUpper: '0',
                                    WidthBottom: '0',
                                    Height: '0',
                                    AppVersion: 'V.' + self.httpClient.currentAppVersion,
                                    IsOnline_Offline: tempOfflineFlag,
                                    mobilToVerify: '1',
                                    IsFarmerAcceptance: 'No',
                                    Remarks: this.isFarmerAcceptanceRemark,
                                    // MicroIrrPlantOnWaterStorage: "0",
                                    IrrigationTypeId: '0',
                                    MicroIrrigationId: '0',
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


    getHorticultureCouplerComponentList() {
        if (this.httpClient.isOffline) {
            this.getHorticultureCouplerComponentListData = this.data.getHorticultureCouplerComponentListData;
            this.listOfPipeType = this.data.listOfPipeType;
        } else {

            var self = this;
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'GeHorticultureCouplerComponentList',
                    srvparam: JSON.stringify({
                        HectareModel: this.data.HectareModel,
                        PipeSize: this.data.PipeId,
                        SubsidySchemeId: this.data.SubsidySchemeId,
                    }),
                },
            };
            console.log('GeHorticultureCouplerComponentList - ', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
                    if (res[0].status == 0) {
                        console.log(' GeHorticultureCouplerComponentList res', res);
                        self.getHorticultureCouplerComponentListData = res[0].data;
                        self.listOfPipeType = res[0].data.filter((x) => x.IsTempRemove == '1');
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
    }

    selectImage(param, columnName) {
        var self = this;
        console.log('test1');

        this.camera.getPicture(this.httpClient.options).then(
            (imageData) => {
                let options: FileUploadOptions = {
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
                if (this.httpClient.isOffline) {
                    this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfSprinkler WHERE ApplicationId = ?',
                        [this.data.ApplicationId]).then((res) => {
                        var temp = JSON.parse(res.rows.item(0).applicationData);
                        if (param == 2) {
                            temp.imgSourceOfIrrigationDateTime = imageData;
                            temp.optionOfimgSourceOfIrrigationDateTime = options;

                        } else if (param == 1) {
                            temp.imgSprinklerWithFarmeDateTime = imageData;
                            temp.optionOfimgSprinklerWithFarmeDateTime = options;

                        }


                        let data = [JSON.stringify(temp)];
                        this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                            .then(() => {
                                if (param == 2) {
                                    this.imgSourceOfIrrigationDateTime = imageData;
                                } else if (param == 1) {
                                    this.imgSprinklerWithFarmeDateTime = imageData;
                                }
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
                    this.fileTransfer
                        .upload(imageData, this.httpClient.imageUploadUrl, options)
                        .then(
                            (data) => {
                                this.httpClient.dismissLoading();
                                // success
                                var temp = JSON.parse(data.response);
                                console.log('temp[0].data', temp[0].data);
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
                                console.log('err', err);
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
                    ' getting Sprinkler With Fatrmer location',
                    resp.coords.latitude + '-----' + resp.coords.longitude
                );
                this.sprinklerWithFarmerLatitude = resp.coords.latitude;
                this.sprinklerWithFarmerLongitude = resp.coords.longitude;
            })
            .catch((error) => {
                this.showPrompt('Error getting Source Of Irrigation location');
            });
    }

    getLocForSourceOfIrrigation() {
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                console.log(
                    ' getting Source Of Irrigation location',
                    resp.coords.latitude + '-----' + resp.coords.longitude
                );
                this.sourceOfIrrigationLatitude = resp.coords.latitude;
                this.sourceOfIrrigationLongitude = resp.coords.longitude;
                console.log(
                    'sourceOfIrrigationLatitude ' + this.sourceOfIrrigationLatitude
                );
                console.log(
                    'sourceOfIrrigationLongitude ' + this.sourceOfIrrigationLongitude
                );
            })
            .catch((error) => {
                this.showPrompt('Error getting Source Of Irrigation location');
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
                Remarks: '',
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
        console.log('isSelectedClose', isSelectedClose);
        if (isSelectedClose == false) {
            const prompt = await this.alertCtrl.create({
                header: 'Remarks',
                backdropDismiss: false,
                inputs: [
                    {
                        placeholder: 'remarks',
                    },
                ],
                buttons: [
                    {
                        text: 'Cancel',
                        handler: (data) => {
                            console.log('Cancel clicked');
                            this.getVerificationCheckData[i].isSelectedClose = false;
                        },
                    },
                    {
                        text: 'Save',
                        handler: (data) => {
                            this.remarks = data[0];
                            console.log('Saved clicked', this.remarks);
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
        if (this.httpClient.isOffline) {
            this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfSprinkler WHERE ApplicationId = ?',
                [this.data.ApplicationId]).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);

                console.log('temp', temp);
                temp.billDetails.splice(index, 1);
                console.log('temp', temp);
                let data = [JSON.stringify(temp)];
                this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                    .then(() => {
                        this.billArray.splice(index, 1);
                        this.calculateTheTotalBillAmount();
                    })
                    .catch((e) => {

                        console.log('error ' + JSON.stringify(e));
                    });

            })
                .catch((e) => {
                    alert('error ' + JSON.stringify(e));
                });
        } else {
            var self = this;
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'DeleteBillDetails',
                    srvparam: JSON.stringify({
                        PostVerificationBillsId: this.billArray[index]
                            .PostVerificationBillsId,
                    }),
                },
            };
            self.httpClient.showLoading();
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
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
                            srvnm: 'PostVerification',
                            srvmethodnm: 'DeleteBillDetails',
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
            this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfSprinkler WHERE ApplicationId = ?',
                [this.data.ApplicationId]).then((res) => {
                var temp = JSON.parse(res.rows.item(0).applicationData);
                if (!temp.billDetails) {
                    temp.billDetails = [];
                }
                console.log('temp', temp);
                temp.billDetails.push(enteredBillDetails);
                console.log('temp', temp);
                let data = [JSON.stringify(temp)];
                this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
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

                        console.log('error ' + JSON.stringify(e));
                    });

            })
                .catch((e) => {
                    alert('error ' + JSON.stringify(e));
                });
        } else {
            var self = this;
            self.httpClient.showLoading();
            console.log('enteredBillDetails', enteredBillDetails);
            var sendRequestData = {
                obj: {
                    usrnm: 'rajkisan',
                    psw: 'rajkisan@123',
                    srvnm: 'PostVerification',
                    srvmethodnm: 'AddPostVerificationBillOneByOne',
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
            console.log('sendRequestData', sendRequestData);
            this.httpClient.post(sendRequestData).subscribe(
                function(res: any) {
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
                            srvnm: 'PostVerification',
                            srvmethodnm: 'AddPostVerificationBillOneByOne',
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
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast('कृपया बिल अपलोड करें ');
            } else {
                this.httpClient.showToast('Please upload bills');
            }
        } else if (this.imgSprinklerWithFarmeDateTime == null) {
            if (this.httpClient.currentLanguage == 'hindi') {
                this.httpClient.showToast(
                    'कृपया किसान के साथ स्प्रिंकलर की तस्वीर लें '
                );
            } else {
                this.httpClient.showToast(
                    'Please take  Picture of sprinkler with farmer'
                );
            }
        } else if (this.imgSourceOfIrrigationDateTime == null) {
            if (this.httpClient.currentLanguage == 'english') {
                this.httpClient.showToast(
                    'Please take  Picture of source of irrigation'
                );
            } else {
                this.httpClient.showToast('सिंचाई के स्रोत की तस्वीर लें ');
            }
        } else {


            if (this.httpClient.isOffline) {
                this.dbService.storage.executeSql('SELECT * FROM postVerificationOfflineOfSprinkler WHERE ApplicationId = ?',
                    [this.data.ApplicationId]).then((res) => {
                    var temp = JSON.parse(res.rows.item(0).applicationData);
                    temp.finalSubmission = {
                        obj: {
                            usrnm: 'rajkisan',
                            psw: 'rajkisan@123',
                            srvnm: 'PostVerification',
                            srvmethodnm: 'FinalSubmissionPostVerification',
                            srvparam: JSON.stringify({
                                ApplicationId: this.data.ApplicationId,
                                UserId: self.httpClient.userData.userid,
                                RoleId: self.httpClient.userData.roleid,
                                SubsidySchemeId: this.data.SubsidySchemeId,
                            }),
                        },
                    };
                    let data = [JSON.stringify(temp)];
                    this.dbService.storage.executeSql(`UPDATE postVerificationOfflineOfSprinkler SET applicationData = ? WHERE ApplicationId = ${this.data.ApplicationId}`, data)
                        .then(() => {
                            self.successAlertFinalSubmission();
                        })
                        .catch((e) => {
                            console.log('error ' + JSON.stringify(e));
                        });

                })
                    .catch((e) => {
                        alert('error ' + JSON.stringify(e));
                    });
            } else {
                self.httpClient.showLoading();
                var sendRequestData = {
                    obj: {
                        usrnm: 'rajkisan',
                        psw: 'rajkisan@123',
                        srvnm: 'PostVerification',
                        srvmethodnm: 'FinalSubmissionPostVerification',
                        srvparam: JSON.stringify({
                            ApplicationId: this.data.ApplicationId,
                            UserId: self.httpClient.userData.userid,
                            RoleId: self.httpClient.userData.roleid,
                            SubsidySchemeId: this.data.SubsidySchemeId,
                        }),
                    },
                };

                console.log('sendRequestData', sendRequestData);
                this.httpClient.post(sendRequestData).subscribe(
                    function(res: any) {
                        self.httpClient.dismissLoading();
                        if (res[0].status == 0) {
                            console.log(res);
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
                                srvmethodnm: 'FinalSubmissionPostVerification',
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

    validateInstalledQty(index) {
        if (
            this.getHorticultureCouplerComponentListData[index].InstalledQty != '0'
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

    test(ev) {
        console.log(ev.detail.value);
        this.year = new Date(ev.detail.value).getFullYear().toString();
        console.log(this.year);


    }

    getLand(landArea) {
        console.log('landArea', landArea);
    }

    uploadDoc() {
        this.camera.getPicture(this.httpClient.options).then((imageData) => {// this.httpClient.showLoading();

                let options: FileUploadOptions = {
                    fileKey: 'files',
                    params: {
                        AppName: 'capitalinvestment',
                        IsDirectUpload: 'True',
                    },
                };

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
                    this.oldDocImgUrl = temp[0].data;
                    console.log('oldDocImgUrl', this.oldDocImgUrl);

                }, (err) => {
                    // error

                    this.httpClient.dismissLoading();
                    console.log('err', err);
                });

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

    getGetHortiHectareModelRangelist() {
        if (this.httpClient.isOffline) {
            this.getGetHortiHectareModelRangelistData = this.data.getGetHortiHectareModelRangelistData;
        } else {
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
                        self.getGetHortiHectareModelRangelistData = res[0].data;
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

    GetHortiCouplerSizelist() {
        if (this.httpClient.isOffline) {
            this.GetHortiCouplerSizelistData = this.data.GetHortiCouplerSizelistData;
        } else {
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
                        self.GetHortiCouplerSizelistData = res[0].data;
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

    getCouplerSizeHectareModelAmountData(HectareModelId, CouplerSizeId) {
        console.log('HectareModelId,CouplerSizeId', HectareModelId, CouplerSizeId);
        if(this.httpClient.isOffline)
        {
            if(HectareModelId != undefined && CouplerSizeId != undefined){

                for(let i=0;i<this.getCouplerSizeHectareModelAmountOffline.length;i++)
                {
                    console.log('condition log ',this.getCouplerSizeHectareModelAmountOffline[i].CouplerSizeId==CouplerSizeId ,
                        this.getCouplerSizeHectareModelAmountOffline[i].HectareModelId==HectareModelId ,
                        this.getCouplerSizeHectareModelAmountOffline[i].SubsidyId==this.data.SubsidySchemeId);
                    if(this.getCouplerSizeHectareModelAmountOffline[i].CouplerSizeId==CouplerSizeId &&
                        this.getCouplerSizeHectareModelAmountOffline[i].HectareModelId==HectareModelId &&
                        this.getCouplerSizeHectareModelAmountOffline[i].SubsidyId==this.data.SubsidySchemeId)
                    {
                        var amount=this.getCouplerSizeHectareModelAmountOffline[i].Amount;
                        this.getCouplerSizeHectareModelAmount=amount;
                        console.log(' var offline amount',amount);
                        if (parseInt(amount) <= 0) {
                            if (this.httpClient.currentLanguage == 'english') {
                                this.showPrompt('Coupler Amount Should not be 0');
                            } else {
                                this.showPrompt('कपलर राशि 0 नहीं होनी चाहिए');

                            }
                        }

                    }
                }



            }
        }else{
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
                            if (self.httpClient.currentLanguage == 'english') {
                                self.showPrompt('Coupler Amount Should not be 0');
                            } else {
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


}
