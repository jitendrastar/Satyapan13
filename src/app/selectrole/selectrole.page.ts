import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import {
    AlertController,
    NavController,
    NavParams,
    Platform,
} from "@ionic/angular";
import { CommonService } from "../services/common.service";
import { Storage } from "@ionic/storage";
import { DatabaseServiceService } from "../services/database-service.service";

@Component({
    selector: "app-selectrole",
    templateUrl: "./selectrole.page.html",
    styleUrls: ["./selectrole.page.scss"],
})
export class SelectrolePage {
    ssoLoginData: any;
    ssoID: any;
    roleId: any;
    userid: any;
    officerNameEn: any;
    roleName_EN: any;
    userData: any;
    userType: any;

    constructor(
        public dbService: DatabaseServiceService,
        public navCtrl: NavController,
        public storage: Storage,
        public router: Router,
        public route: ActivatedRoute,
        public httpClient: CommonService,
        public alertCtrl: AlertController,
        public platform: Platform
    ) {
        // this.userData = JSON.parse(this.route.snapshot.paramMap.get("userData"));
        // this.userType = this.route.snapshot.paramMap.get("userType");
        // console.log("this.userData", this.userData);
    }

    ionViewWillEnter() {
        this.storage.get('roleList').then(value => {
            // this.httpClient.userList = JSON.parse(value);
            this.httpClient.userList = value;
        })
    }
    home() {
        this.navCtrl.navigateRoot([
            "subsidy-lic-selection",
            { userData: JSON.stringify(this.httpClient.userList) },
        ]);
    }
    roleSelectedRow(data) {
        if (data.userType == "subsidy") {
            console.log("data", data);
            data.userType = "subsidy";
            this.httpClient.userData = data;
            this.httpClient.login(data);
            this.navCtrl.navigateRoot([
                "dashboard",
                { userDataDashboard: JSON.stringify(data) },
            ]);
        } else if (data.userType == "license") {

            this.httpClient.userData = data;

            console.log("data", data);
            this.httpClient.login(data);
            this.navCtrl.navigateRoot([
                "lic-sub-list",
                { userDataDashboard: JSON.stringify(data) },
            ]);
        }
        else if (data.userType == "ksk-update") {
            this.httpClient.userData = data;
            console.log("data", data);
            this.httpClient.login(data);
            this.navCtrl.navigateRoot([
                "ksk-update",
                { userDataDashboard: JSON.stringify(data) },
            ]);
        }
    }
}
