import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";

import { File } from "@ionic-native/file/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { DatabaseServiceService } from '../services/database-service.service';
import { CommonService } from '../services/common.service';
@Component({
  selector: 'app-ksk-update',
  templateUrl: './ksk-update.page.html',
  styleUrls: ['./ksk-update.page.scss']
})
export class KskUpdatePage implements OnInit {
  isRempAtEntryGate: any;
  maxYear = new Date().getFullYear();
  panchayatSamiti: any;
  isKnownFor: any = false;
  basicInfoFlag: any = false;
  officeInfoFlag: any = false;
  officeAssetInfoFlag: any = false;
  geoTaggFlag: any = false;
  kskGP: any;
  address: any;
  selectedGramPanchyatName: any;
  pincode: any;
  mobile: any;
  electricConnection: any;
  // internetConnection: any;
  waterConnection: any;
  trainingHall: any;
  toilets: any;
  kskBuilding: any;
  roomNo: any;
  internetProvider: any;
  workingComputers: any;
  nonWorkingComputers: any;
  workingPrinters: any;
  nonWorkingPrinters: any;
  aaoPosted: any;
  aaoVacant: any = 'False';
  asPosted: any;
  asVacant: any = 'False';
  otherRelativeInfo: any;
  noOfTables: any;
  noOfOfficeVisitChair: any;
  noOfMugBucket: any;
  noOfWhiteBoard: any;
  noOfBox: any;
  noOfBookSelfRack: any;
  noOfAlmirah: any;
  noOfFloor: any;
  insectPestChart: any;
  sampleContainer: any;
  displayBoard: any;
  tapAndMachine: any;
  workingComputersYearOfSupply: any;
  nonWorkingComputersYearOfSupply: any;
  nonworkingPrintersYearOfSupply: any;
  workingPrintersYearOfSupply: any;
  officeAssetsArr: any = [
    { id: 1, fieldNameHeading: 'No of Tables', type: 'Text' },
    { id: 2, fieldNameHeading: 'No of office & Visitors Chairs', type: 'Text' },
    { id: 3, fieldNameHeading: 'No of Floor', type: 'Select' },
    { id: 4, fieldNameHeading: 'No of Almirah', type: 'Text' },
    { id: 5, fieldNameHeading: 'No of Book Self/Rack', type: 'Text' },
    { id: 6, fieldNameHeading: 'No of Box', type: 'Text' },
  ];
  basicInfoFlagDetails() {
    this.basicInfoFlag = !this.basicInfoFlag;
  } officeInfoFlagDetails() {
    this.officeInfoFlag = !this.officeInfoFlag;
  }
  officeAssetInfoFlagDetails() {
    this.officeAssetInfoFlag = !this.officeAssetInfoFlag;
  }
  geoTaggDetails() {
    this.geoTaggFlag = !this.geoTaggFlag;
  }
  listOfPanchayatSamiti: any = [];
  listOfGramPanchayat: any = [];
  listOfOfficeAssets: any = [];
  listOfBuildingType: any = [];

  listOfIsp: any = [];
  userType: any;
  fileTransfer: any;
  outsidePhoto: any;
  insidePhoto: any;
  kskLocation: any;
  formDisable = false;

  firstData: any;
  secondData: any;
  thirdData: any;
  parser = new DOMParser();
  //  xmlString="

  //  "
  constructor(public photoViewer: PhotoViewer, private transfer: FileTransfer, private file: File, private camera: Camera,
    public alertCtrl: AlertController, public storage: Storage, public dbService: DatabaseServiceService, public httpClient: CommonService, public navCtrl: NavController) {
    this.fileTransfer = this.transfer.create();
    // let doc = this.parser.parseFromString(xmlString, "application/xml");
    // console.log("doc", doc);
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.getPreviousSubmittedData();
    const array1 = [1, 3, 2,4];
    console.log(Math.max(...array1));
  }

  getPreviousSubmittedData() {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      "obj":
      {
        "usrnm": "rajkisan",
        "psw": "rajkisan@123",
        "srvnm": "ksk",
        "srvmethodnm": "GetKSK_Information",
        "srvparam": JSON.stringify({ 'userid': self.httpClient.userData.userid })
      }
    }
    self.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        if (res.status == 0) {
          self.formDisable = true;
          self.firstData = res.data[0];
          self.secondData = res.data1[0];
          self.thirdData = res.data2;
          self.userType = self.firstData.userType;
          self.kskLocation = self.firstData.kskLocation;
          self.isKnownFor = self.firstData.isKnownFor;
          self.insidePhoto = self.firstData.InsideGeoTaggedPh;
          self.outsidePhoto = self.firstData.OutSideGeoTaggedPh;
          self.kskGP = self.firstData.KSKName;
          self.address = self.firstData.KSKAddress;
          self.pincode = self.firstData.KSKPincode;
          self.mobile = self.firstData.KSKTelephoneNo;
          self.isRempAtEntryGate = self.firstData.IsRempAtEntryGate;
          self.electricConnection = self.firstData.IsThereElectricConnection;
          self.waterConnection = self.firstData.IsThereWaterConnection;
          self.trainingHall = self.firstData.IsThereTrainingHall;
          self.toilets = self.firstData.IsThereToilets;
          self.aaoPosted = self.secondData.KSK_AAOPosted;
          self.aaoVacant = self.secondData.KSK_AAOVacant;
          self.asPosted = self.secondData.KSK_ASPosted;
          self.asVacant = self.secondData.KSK_ASVacant;
          self.nonWorkingComputers = self.secondData.KSK_NoOfNonWorkingComputer;
          self.nonWorkingPrinters = self.secondData.KSK_NoOfNonWorkingPrinter;
          self.roomNo = self.secondData.KSK_NoOfRooms;
          self.workingComputers = self.secondData.KSK_NoOfWorkingComputer;
          self.workingPrinters = self.secondData.KSK_NoOfWorkingPrinter;
          self.nonworkingPrintersYearOfSupply = self.secondData.NonWorkingPrinYearofSupply;
          self.nonWorkingComputersYearOfSupply = self.secondData.NonworkingCompYearofSupply;
          self.workingPrintersYearOfSupply = self.secondData.WorkingPrinYearofSupply;
          self.workingComputersYearOfSupply = self.secondData.workingCompYearofSupply;
          self.otherRelativeInfo = self.secondData.OtherInformation;
          self.listOfOfficeAssets = self.thirdData;
          self.getPanchayatSamitiList();
          self.getKSKbuildingType();
          self.getKSKISPType();
        } else {
          var str = self.httpClient.userData.PostNameEn;
          var n = str.search("AAO");
          console.log("n", n);
          if (n > -1) self.userType = 'AAO';
          var j = str.search("AS");
          if (j > -1) self.userType = 'AS';
          console.log("J", j);
          console.log("this.userType", self.userType);
          self.getPanchayatSamitiList();
          self.getKSKbuildingType();
          self.getKSKOfficeAssetsMaster();
          self.getKSKISPType();
        }
      },
      (error) => {
        var errorRequestData = {
          'obj': {
            'usrnm': 'rajkisan',
            'psw': 'rajkisan@123',
            srvresponce: error,
            userid: self.httpClient.userData.userid,
            "srvnm": "ksk",
            "srvmethodnm": "agrilovvalues",
            "srvparam": "{'AgriLovValuesCode':'KSKBuildinggtype'}"

          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  getKSKISPType() {
    var self = this;
    var sendRequestData = {
      "obj": {
        "usrnm": "rajkisan",
        "psw": "rajkisan@123",
        "srvnm": "ksk",
        "srvmethodnm": "agrilovvalues",
        "srvparam": "{'AgriLovValuesCode':'ksknameofisp'}"
      }
    }
    self.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        if (res.status == 0) {
          self.listOfIsp = res.data;

          console.log("self.listOfIsp", self.listOfIsp);
          if (self.formDisable) {
            self.internetProvider = self.secondData.KSK_NameofISP;

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
            "srvnm": "ksk",
            "srvmethodnm": "agrilovvalues",
            "srvparam": "{'AgriLovValuesCode':'KSKBuildinggtype'}"

          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  getKSKOfficeAssetsMaster() {
    var self = this;
    var sendRequestData = {
      "obj":
      {
        "usrnm": "rajkisan",
        "psw": "rajkisan@123",
        "srvnm": "ksk",
        "srvmethodnm": "GetKSK_OfficeAssetsMaster",
        "srvparam": "{}"
      }
    }

    self.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        if (res.status == 0) {
          self.listOfOfficeAssets = res.data;
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
            "srvnm": "ksk",
            "srvmethodnm": "GetKSK_OfficeAssetsMaster",
            "srvparam": "{}"

          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  getKSKbuildingType() {
    var self = this;
    var sendRequestData = {
      "obj":
      {
        "usrnm": "rajkisan",
        "psw": "rajkisan@123",
        "srvnm": "ksk",
        "srvmethodnm": "agrilovvalues",
        "srvparam": "{'AgriLovValuesCode':'KSKBuildinggtype'}"
      }
    }

    self.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        if (res.status == 0) {
          self.listOfBuildingType = res.data;
          console.log("self.listOfBuildingType", self.listOfBuildingType);
          if (self.formDisable) {
            self.kskBuilding = self.secondData.KSK_TypeOfBulding;
            console.log("self.kskBuilding", self.kskBuilding)
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
            "srvnm": "ksk",
            "srvmethodnm": "agrilovvalues",
            "srvparam": "{'AgriLovValuesCode':'KSKBuildinggtype'}"

          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  getGramPanchatayList() {
    var self = this;
    this.listOfGramPanchayat = [];
    this.selectedGramPanchyatName = "";
    console.log("self.selectedGramPanchyatName", self.selectedGramPanchyatName);
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "GetAAO_AAO_AS_PanchayatSamitiList",
        srvparam: JSON.stringify({
          userid: self.httpClient.userData.userid,
          levelid: self.httpClient.userData.LevelID,
          location: 'GP',
          blockid: self.panchayatSamiti
        }),
      },
    };

    self.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        if (res.status == 0) {
          self.listOfGramPanchayat = res.data;

          if (self.formDisable) {
            self.selectedGramPanchyatName = self.firstData.GP_CODE;
          }
          console.log("self.selectedGramPanchyatName", self.selectedGramPanchyatName);

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
            srvnm: "PreVerification",
            srvmethodnm: "GetAAO_AAO_AS_PanchayatSamitiList",
            srvparam: JSON.stringify({
              userid: self.httpClient.userData.userid,
              levelid: self.httpClient.userData.LevelID,
              location: 'GP',
              blockid: self.panchayatSamiti
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );

  }
  getPanchayatSamitiList() {
    this.panchayatSamiti = [];
    this.panchayatSamiti = "";
    var self = this;
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "GetAAO_AAO_AS_PanchayatSamitiList",
        srvparam: JSON.stringify({
          userid: self.httpClient.userData.userid,
          levelid: self.httpClient.userData.LevelID,
          location: 'PS',
          blockid: 0
        }),
      },
    };

    self.httpClient.post(sendRequestData).subscribe(
      function (temp) {
        var res: any = temp[0];
        console.log("res", res);
        self.httpClient.dismissLoading();
        if (res.status == 0) {
          self.listOfPanchayatSamiti = res.data;
          if (res.data.length == 1) {
            self.panchayatSamiti = self.firstData.PSID;
            console.log("self.panchayatSamiti", self.panchayatSamiti);
          }
          if (self.formDisable) {
            self.panchayatSamiti = self.firstData.PSID;
            self.getGramPanchatayList();
          }
          console.log("  self.listOfPanchayatSamiti", self.listOfPanchayatSamiti);
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
            srvnm: "PreVerification",
            srvmethodnm: "GetAAO_AAO_AS_PanchayatSamitiList",
            srvparam: JSON.stringify({
              userid: self.httpClient.userData.userid,
              levelid: self.httpClient.userData.userid,
              location: 'PS',
              blockid: 0
            }),
          }
        };
        console.log('errorRequestData new', errorRequestData);
        self.httpClient.getErrorMobileLogs(errorRequestData);
        self.httpClient.showToastError();
      }
    );
  }
  checkKnownFor(check) {
    console.log('check', check);
    console.log('isKnownFor', this.isKnownFor);
  }

  getElectricConnection(electricConnection) {
    console.log('electricConnection', electricConnection);
  }

  getSelectVal($event: any) {

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
        userid: self.httpClient.userData.userid,
        srvparam: JSON.stringify({ userid: self.httpClient.userData }),
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
            userid: self.httpClient.userData.userid,
            srvparam: JSON.stringify({ userid: self.httpClient.userData.userid }),
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


  submit() {
    console.log("this.selectedGramPanchyatName", this.selectedGramPanchyatName);
    var tempPs: any;
    let assetsArray = this.listOfOfficeAssets.filter(item => (item.KSK_AssetsAns).toString() == "");
    console.log("assetsArray", assetsArray);
    if (!this.panchayatSamiti) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया पंचायत समिति का चयन करें ' : 'Please select the panchayat samiti');
    }
    else if (!this.selectedGramPanchyatName && this.userType == 'AS' && this.panchayatSamiti) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया ग्राम पंचायत का चयन करें' : 'Please select the gram panchayat');
    }
    else if (!this.selectedGramPanchyatName && this.kskLocation == 'asOffice') {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया ग्राम पंचायत का चयन करें' : 'Please select the gram panchayat');
    }
    else if (!this.selectedGramPanchyatName && this.isKnownFor) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया ग्राम पंचायत का चयन करें' : 'Please select the gram panchayat');
    }
    else if (!this.kskGP) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया केएसके नाम दर्ज करें' : 'Please enter the name of KSK');
    }
    else if (!this.address) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया केएसके का पता दर्ज करें' : 'Please enter the address of KSK');
    }
    else if (!this.pincode) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया केएसके का पिनकोड दर्ज करें' : 'Please enter the pincode of KSK');
    }
    else if (!this.mobile) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया केएसके का मोबाइल नंबर दर्ज करें' : 'Please enter the mobile number of KSK');
    }
    else if (!this.isRempAtEntryGate) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया एंट्री गेट पर रेम्प विकल्प  का चयन करें' : 'Please select the Is Remp at Entry Gate option');
    }
    else if (!this.electricConnection) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया विद्युत कनेक्शन विकल्प  का चयन करें' : 'Please select the electric connection option');
    }

    else if (!this.waterConnection) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया जल कनेक्शन विकल्प  का चयन करें' : 'Please select the water connection option');
    }
    else if (!this.trainingHall) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया प्रशिक्षण हॉल विकल्प का चयन करें' : 'Please select the training hall option');
    }
    else if (!this.toilets) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया शौचालय विकल्प  का चयन करें' : 'Please select the toilets option');
    }

    else if (!this.kskBuilding) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया केएसके का भवन का चयन करें' : 'Please select the Building of KSK');
    }

    else if (!this.roomNo) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया कमरों की संख्या चयन करें' : 'Please select the No. of Rooms');
    }
    else if (!this.internetProvider) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया इंटरनेट सेवा प्रदाता का नाम दर्ज करें' : 'Please enter the name of Internet Service Provider');
    }
    else if (!this.internetProvider) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया इंटरनेट सेवा प्रदाता का नाम दर्ज करें' : 'Please enter the name of Internet Service Provider');
    }

    // else if (!this.workingComputers && this.workingComputers != 0) {
    //   this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया काम करने वाले कंप्यूटरों की संख्या दर्ज करें' : 'Please enter the number of working computers');
    // }
    // else if (!this.workingComputersYearOfSupply && this.workingComputers > 0) {
    //   this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया चालू हालत में कंप्यूटर की आपूर्ति का वर्ष दर्ज करें' : 'Please enter the Year of supply of Working Computers');
    // }
    // else if (!this.nonWorkingComputers && this.nonWorkingComputers != 0) {
    //   this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया काम नहीं कर रहे कंप्यूटर की संख्या दर्ज करें' : 'Please enter the number of non working computers');
    // }
    // else if (!this.nonWorkingComputersYearOfSupply && this.nonWorkingComputers > 0) {
    //   this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया ख़राब हालत में कंप्यूटर की आपूर्ति का वर्ष दर्ज करें' : 'Please enter the Year of supply of nonworking Computers');
    // }
    // else if (!this.workingPrinters && this.workingPrinters != 0) {
    //   this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया काम करने वाले प्रिंटर की संख्या दर्ज करें' : 'Please enter the number of working printers');
    // }
    // else if (!this.workingPrintersYearOfSupply && this.workingPrinters > 0) {
    //   this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया चालू हालत में प्रिंटर की आपूर्ति का वर्ष  दर्ज करें' : 'Please enter Year of supply of Working Printers');
    // }
    // else if (!this.nonWorkingPrinters && this.nonWorkingPrinters != 0) {
    //   this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया काम नहीं कर रहे प्रिंटर की संख्या दर्ज करें' : 'Please enter the number of non working printers');
    // }
    // else if (!this.nonworkingPrintersYearOfSupply && this.nonWorkingPrinters > 0) {
    //   this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया ख़राब हालत में प्रिंटर की आपूर्ति का वर्ष दर्ज करें' : 'Please enter Year of supply of Nonworking Printers');
    // }




    else if (!this.aaoPosted) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया एएओ पदस्थापित का चयन करें' : 'Please select the AAO Posted');
    }
    else if (!this.aaoVacant) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया एएओ रिक्त का चयन करें' : 'Please select the AAO Vacant');
    }

    else if (!this.asPosted) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया एएस पदस्थापित का चयन करें' : 'Please select the AS Posted');
    }

    else if (!this.asVacant) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया एएस रिक्त का चयन करें' : 'Please select the AS Vacant');
    }

    else if (assetsArray.length > 0) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया कार्यालय संपत्ति जानकारी दर्ज करें' : 'Please enter the Office Assets Information');
    }
    else if (!this.insidePhoto) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया अंदर जियो टैग की गई फोटो अपलोड करें' : 'Please upload Inside Geo Tagged Photo');
    }
    else if (!this.outsidePhoto) {
      this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया बाहर जियो टैग की गई फोटो अपलोड करें' : 'Please upload Outside Geo Tagged Photo');
    }
    else {
      // if (this.kskLocation == 'aaoOffice' || this.userType == 'AS') {
      //   tempPs = this.panchayatSamiti
      // }
      // else {
      //   tempPs = "";
      // }
      var self = this;
      this.httpClient.showLoading();
      var sendRequestData = {
        "obj": {
          "usrnm": "rajkisan",
          "psw": "rajkisan@123",
          "srvnm": "ksk",
          "srvmethodnm": "ksk_InsertInformation",
          "srvparam": JSON.stringify({
            'userid': self.httpClient.userData.userid,
            'KSK_BasicInformationData':
              [
                {
                  'IsAS_KSK': this.isKnownFor,
                  'kskLocation': this.kskLocation,
                  'isKnownFor': this.isKnownFor,
                  'userType': this.userType,
                  'PSID': this.panchayatSamiti,
                  'GPID': this.selectedGramPanchyatName,
                  'KSKName': this.kskGP,
                  'KSKAddress': this.address,
                  'KSKPincode': this.pincode,
                  'KSKTelephoneNo': this.mobile,
                  'IsThereElectricConnection': this.electricConnection,
                  'IsThereWaterConnection': this.waterConnection,
                  'IsThereTrainingHall': this.trainingHall,
                  'IsThereToilets': this.toilets,
                  'InsideGeoTaggedPh': this.insidePhoto,
                  'OutSideGeoTaggedPh': this.outsidePhoto,
                  'KSK_NoOfRooms': this.roomNo,
                  'KSK_TypeOfBulding': this.kskBuilding,
                  'KSK_NameofISP': this.internetProvider,
                  'KSK_NoOfWorkingComputer': this.workingComputers,
                  'KSK_NoOfNonWorkingComputer': this.nonWorkingComputers,
                  'KSK_NoOfWorkingPrinter': this.workingPrinters,
                  'KSK_NoOfNonWorkingPrinter': this.nonWorkingPrinters,
                  'KSK_AAOPosted': this.aaoPosted,
                  'KSK_AAOVacant': this.aaoVacant,
                  'KSK_ASPosted': this.asPosted,
                  'KSK_ASVacant': this.asVacant,
                  'OtherInformation': this.otherRelativeInfo,
                  workingCompYearofSupply: this.workingComputersYearOfSupply,
                  NonworkingCompYearofSupply: this.nonWorkingComputersYearOfSupply,
                  WorkingPrinYearofSupply: this.workingPrintersYearOfSupply,
                  NonWorkingPrinYearofSupply: this.nonworkingPrintersYearOfSupply,
                  IsRempAtEntryGate: this.isRempAtEntryGate,

                }],
            'KSK_OfficeAssetDatalst': self.listOfOfficeAssets
          })
        }
      }

      console.log("sendRequestData", sendRequestData);

      self.httpClient.post(sendRequestData).subscribe(
        function (temp) {
          var res: any = temp[0];
          console.log("res", res);
          self.httpClient.dismissLoading();
          if (res.status == 0) {
            self.formDisable = true;

            self.httpClient.showToast(res.message);
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
              "srvnm": "ksk",
              "srvmethodnm": "ksk_InsertInformation",
              "srvparam": JSON.stringify({
                'userid': self.httpClient.userData.userid,
                'KSK_BasicInformationData':
                  [
                    {
                      'IsAS_KSK': this.isKnownFor,
                      'PSID': this.panchayatSamiti,
                      'GPID': this.selectedGramPanchyatName,
                      'KSKName': this.kskGP,
                      'KSKAddress': this.address,
                      'KSKPincode': this.pincode,
                      'KSKTelephoneNo': this.mobile,
                      'IsThereElectricConnection': this.electricConnection,
                      'IsThereWaterConnection': this.waterConnection,
                      'IsThereTrainingHall': this.trainingHall,
                      'IsThereToilets': this.toilets,
                      // 'IsThereInternet': this.internetConnection,
                      'InsideGeoTaggedPh': this.insidePhoto,
                      'OutSideGeoTaggedPh': this.outsidePhoto,

                      'KSK_NoOfRooms': this.roomNo,
                      'KSK_TypeOfBulding': this.kskBuilding,
                      'KSK_NameofISP': this.internetProvider,
                      'KSK_NoOfWorkingComputer': this.workingComputers,
                      'KSK_NoOfNonWorkingComputer': this.nonWorkingComputers,
                      'KSK_NoOfWorkingPrinter': this.workingPrinters,
                      'KSK_NoOfNonWorkingPrinter': this.nonWorkingPrinters,
                      'KSK_AAOPosted': this.aaoPosted,
                      'KSK_AAOVacant': this.aaoVacant,
                      'KSK_ASPosted': this.asPosted,
                      'KSK_ASVacant': this.asVacant,
                      'OtherInformation': this.otherRelativeInfo
                    }],
                'KSK_OfficeAssetDatalst': self.listOfOfficeAssets
              })
            }
          }

          console.log('errorRequestData new', errorRequestData);
          self.httpClient.getErrorMobileLogs(errorRequestData);
          self.httpClient.showToastError();
        }
      );
    }
  }



  takePhoto(param) {
    if (!this.formDisable) {
      this.camera.getPicture(this.httpClient.options).then(
        (imageData) => {
          let options: FileUploadOptions = {
            fileKey: "files",
            params: {
              AppName: "PVapp",
              IsDirectUpload: "True",
            },
          };

          this.httpClient.showLoading();
          this.fileTransfer.upload(imageData, this.httpClient.imageUploadUrl, options).then(
            (data) => {
              this.httpClient.dismissLoading();
              // success
              var temp = JSON.parse(data.response);
              console.log("temp[0].data", temp[0].data);
              if (temp[0].data) {
                if (param == 0) {
                  this.insidePhoto = temp[0].data;
                } else if (param == 1) {
                  this.outsidePhoto = temp[0].data;
                }
              } else {
                this.httpClient.showToastError();
              }
            },
            (err) => {
              // error
              this.httpClient.showToastError();
              this.httpClient.dismissLoading();
              console.log("err", err);
            }
          );

        },
        (err) => {
          // Handle error
        }
      );
    }

  }
  viewPhoto(photo) {
    this.photoViewer.show(photo);
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
  IsNumeric(e, index) {
    console.log("e.target.value", e.target.value)
    var str = e.target.value.indexOf(".");
    console.log("this.listOfOfficeAssets[index].KSK_AssetsAns", this.listOfOfficeAssets[index].KSK_AssetsAns)
    if (str != -1) {
      // this.getKSKOfficeAssetsMaster();
      this.listOfOfficeAssets[index].KSK_AssetsAns = "";
      // e.target.value = "";
      this.httpClient.showToast('Only Numbers are Allow in this field')
    }

  }
  validate(e, param) {
    var str = e.target.value.indexOf(".");
    if (str != -1) {
      if (param == 0) {
        this.pincode = "";
      }
      if (param == 1) {
        this.mobile = "";
      }

      if (param == 2) {
        this.workingComputers = "";
      }

      if (param == 3) {
        this.nonWorkingComputers = "";
      }

      if (param == 4) {
        this.workingPrinters = "";
      }

      if (param == 5) {
        this.nonWorkingPrinters = "";
      }
      this.httpClient.showToast('Only Numbers are Allow in this field')
    }
    if (param == 0 && this.pincode) {
      if (this.pincode.toString().length != 6) {
        this.pincode = "";
        this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया केएसके का वैध पिनकोड दर्ज करें' : 'Please enter the valid pincode of KSK');

      }
    }
    if (param == 1 && this.mobile) {
      if (this.mobile.toString().length != 10) {
        this.mobile = "";
        this.httpClient.showToast((this.httpClient.currentLanguage == 'hindi') ? 'कृपया केएसके का वैध मोबाइल नंबर दर्ज करें' : 'Please enter the valid mobile number of KSK');

      }

    }
  }
}
