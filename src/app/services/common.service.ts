import { Injectable } from "@angular/core";
import {
  AlertController,
  LoadingController,
  PopoverController,
  ToastController,
} from "@ionic/angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as CryptoJS from "crypto-js";
import { Storage } from "@ionic/storage";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  currentAppVersion: any = "34";
  currentAppVersionShow: any = "v3.04";
  currentLanguage = "hindi";
  userData: any;
  ssoLoginData: any;
  isOffline = false;
  userList: any = []

  /*Staging URL */
  baseURL: string ="https://apitest.sewadwaar.rajasthan.gov.in/app/live/Agriculture/Staging/ifarm/Service/MobileApp/Service?";
  client_id = "client_id=9d97bf19-e21c-4e85-a036-1cc5d48dec6b";
  imageUploadUrl ="http://103.203.138.116/agricultureifarm/Service/ImageUploader";
  mobileAppLogs = "http://103.203.138.116/agricultureifarm/Service/MobileAppLogs";
  imageUploadUrlForJamaBandi="http://103.203.138.116/agricultureifarm/Service/UploadJamabandiDocInPostPV";
  /*Live URL */
  // baseURL: string ="https://api.sewadwaar.rajasthan.gov.in/app/live/Agriculture/Prod/ifarm/Service/Mobile/App?";
  // client_id = "client_id=f6de7747-60d3-4cf0-a0ae-71488abd6e95";
  // imageUploadUrl ="https://api.sewadwaar.rajasthan.gov.in/app/live/Agriculture/Prod/ImageUploader/Service?client_id=f6de7747-60d3-4cf0-a0ae-71488abd6e95";
  // mobileAppLogs = 'https://apitest.sewadwaar.rajasthan.gov.in/app/live/Agriculture/Staging/agricultureifarm/Service/MobileAppLogs?client_id=9d97bf19-e21c-4e85-a036-1cc5d48dec6b';
  // imageUploadUrlForJamaBandi="https://api.sewadwaar.rajasthan.gov.in/app/live/Agriculture/Prod/ImageUploader/Service?client_id=f6de7747-60d3-4cf0-a0ae-71488abd6e95";
// /*RJPA198529029776*/

  latitude: any = "";
  longitude: any = "";
  loading: any;
  loadingFlag: any = false;
  private key: string;
  private iv: string;
  public errorMessage: string = "Server is not reachable. Please try again.";
  selectedId: any;
  options: CameraOptions;

  constructor(
    public storage: Storage,
    public alertCtrl: AlertController,
    public popoverCtrl: PopoverController,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public camera: Camera
  ) {
    this.options = {
      quality: 20,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // allowEdit: true,
      correctOrientation: true,
      saveToPhotoAlbum: false,
      targetWidth: 1500,
      targetHeight: 2000,
    };
    this.key = CryptoJS.enc.Utf8.parse("8080808080808080");
    this.iv = CryptoJS.enc.Utf8.parse("8080808080808080");
  }
  changeLanguage() {
    if (this.currentLanguage == "hindi") {
      this.currentLanguage = "english";
    } else if (this.currentLanguage == "english") {
      this.currentLanguage = "hindi";
    }
  }

  encryptData(encstr) {
    return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(encstr), this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    headers.append("Accesstoken", "!@#123APP");
    headers.append("Content-Type", "application/json");
    headers.append("Content-Type", "json");
    headers.append("Accept", "application/json");
    headers.append("Access-Control-Allow-Origin", "*");
    headers.append("Access-Control-Allow-Credentials", "true");
    headers.append("Referer", "http://localhost/");
  }

  async showToast(message) {
    this.dismissLoading();
    if (this.currentLanguage == "hindi") {
      const alert = await this.alertCtrl.create({
        header: "अलर्ट!",
        message: message,
        backdropDismiss: false,
        buttons: ["ठीक है"],
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: "Alert!",
        message: message,
        backdropDismiss: false,
        buttons: ["OK"],
      });
      await alert.present();
    }
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: "Please wait...",
      backdropDismiss: true,
    });
    await this.loading.present();
  }

  dismissLoading() {
    if (this.loading) {
      try {
        this.loading.dismissAll();
      } catch (err) {
        try {
          this.loading.dismiss();
        } catch (err) { }
      }
    }
  }

  showLoadingImage() {
    this.loadingFlag = true;
  }

  dismissLoadingImage() {
    this.loadingFlag = false;
    // if (this.loading) {
    //   try {
    //     this.loading.dismissAll();
    //   }
    //   catch (err) {
    //     try {
    //       this.loading.dismiss();
    //     }
    //     catch (err) {
    //     }
    //   }
    // }
  }

  get(url) {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.get(this.baseURL + url, {
      headers: headers,
    });
  }

  post(data) {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post(this.baseURL + this.client_id, data, {
      headers: headers,
    });
  }

  postLogin(data) {
    // console.log("data", data);
    // let headers = new HttpHeaders();
    // this.createAuthorizationHeader(headers);
    // return this.http.post(this.baseURLLogin + this.client_idLogin, data, {
    //   headers: headers,
    // });
  }

  login(data) {
    this.userData = data;
    this.storage.set("userData", data);
  }

  logMethod(applicationId, subsidySchemeId, errorMsg, methodName, requestbody) {
    var self = this;
    self.dismissLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "PreVerification",
        srvmethodnm: "InsertVerificationErrorLog",
        srvparam: JSON.stringify({
          userid: this.userData.userid,
          ApplicationId: applicationId,
          SubsidySchemeId: subsidySchemeId,
          ErrorLogMsg: errorMsg,
          ModuleName: methodName,
          requestbody: requestbody,
        }),
      },
    };

    this.post(sendRequestData).subscribe(
      function (res: any) {
        console.log("res", res);
        if (res[0].status == 0) {
          console.log("error printed");
        } else {
        }
      },
      (error) => { }
    );
  }
  mobileAppLogsPost(data) {
    let headers = new HttpHeaders();
    this.createAuthorizationHeader(headers);
    return this.http.post(this.mobileAppLogs, data, {
      headers: headers
    });
  }
  getErrorMobileLogs(requestData) {
    var self = this;
    var sendRequestData = requestData
    this.mobileAppLogsPost(sendRequestData).subscribe(function (temp) {
      var res: any = temp[0];
      // console.log('res', res);
      if (res.status == 0) {
        console.log('Mobile Log Api - ', res);

      } else {
        console.log(res.message);
      }
      // self.httpClient.showToast(res.message);

    }
      , error => {
        self.dismissLoading();
        // self.showToast(self.errorMessage);
        // self.showToastError();


      });

  }
  async showToastError() {
    this.dismissLoading();

    if (this.currentLanguage == "hindi") {
      const toast = await this.alertCtrl.create({
        header: "कनेक्ट नहीं हो सका !",
        message: "कृपया पुनः प्रयास करें।",
        backdropDismiss: false,
        buttons: [
          {
            text: "ठीक है",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            },
          },
        ],
      });
      toast.present();
    } else {
      const toast = await this.alertCtrl.create({
        header: "Could Not Connect !",
        message: "Please try again later.",
        backdropDismiss: false,
        buttons: [
          {
            text: "Ok",
            role: "cancel",
            handler: () => {
              console.log("Ok clicked");
            },
          },
        ],
      });
      toast.present();
    }
  }
}
