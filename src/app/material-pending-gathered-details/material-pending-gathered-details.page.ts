import { Component, OnInit } from "@angular/core";
import { AlertController, NavController, Platform } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";
import { DatabaseServiceService } from "../services/database-service.service";
@Component({
  selector: "app-material-pending-gathered-details",
  templateUrl: "./material-pending-gathered-details.page.html",
  styleUrls: ["./material-pending-gathered-details.page.scss"],
})
export class MaterialPendingGatheredDetailsPage implements OnInit {
  preVerificationChecklistData: any = [];
  createdChecklist: any = [];
  getPreVerificationData: any;
  constructor(
    public alertController: AlertController,
    public dbService: DatabaseServiceService,
    public router: Router,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    private storage: Storage,
    public alertCtrl: AlertController,
    public httpClient: CommonService,
    private callNumber: CallNumber
  ) {
    this.getPreVerificationData = JSON.parse(
      this.route.snapshot.paramMap.get("obj")
    );
  }

  submit() {
    var self = this;
    self.httpClient.showLoading();
    var sendRequestData = {
      obj: {
        usrnm: "rajkisan",
        psw: "rajkisan@123",
        srvnm: "HortiSubsidy",
        srvmethodnm: "HortiMaterialGatheringConfirmByAO",
        srvparam: JSON.stringify({
          ApplicationId: this.getPreVerificationData.ApplicationId,
          userid: this.httpClient.userData.userid,
          schemeid: this.getPreVerificationData.SubsidySchemeId,
          roleid: this.httpClient.userData.roleid,
        }),
      },
    };
    this.httpClient.post(sendRequestData).subscribe(
      function (res: any) {
        self.httpClient.dismissLoading();
        if (res[0].status == 0) {
          self.navCtrl.back();
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
            srvnm: "HortiSubsidy",
            srvmethodnm: "HortiMaterialGatheringConfirmByAO",
            srvparam: JSON.stringify({
              ApplicationId: self.getPreVerificationData.ApplicationId,
              userid: self.httpClient.userData.userid,
              schemeid: self.getPreVerificationData.SubsidySchemeId,
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
  ngOnInit() {}
}
