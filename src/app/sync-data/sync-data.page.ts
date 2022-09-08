import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sync-data',
  templateUrl: './sync-data.page.html',
  styleUrls: ['./sync-data.page.scss'],
})
export class SyncDataPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  syncFarmPond() {
    this.router.navigate(['sync-farm-pond']);
  }
}
