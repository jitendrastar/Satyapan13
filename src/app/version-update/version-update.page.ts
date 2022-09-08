import { Component, OnInit } from '@angular/core';
import {Market} from '@ionic-native/market/ngx';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-version-update',
  templateUrl: './version-update.page.html',
  styleUrls: ['./version-update.page.scss'],
})
export class VersionUpdatePage implements OnInit {

  updateVersion: any;
  constructor(private market: Market,private route: ActivatedRoute, ) {
    this.route.queryParams.subscribe(params => {
      this.updateVersion = params['param'];

    });
  }

  ngOnInit() {
  }
  appUpdate() {
    // this.market.open('com.rajmandi.risl');
    this.market.open('com.fieldinspection.risl');

  }

}
