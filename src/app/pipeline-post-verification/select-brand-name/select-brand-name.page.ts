import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
// import {

@Component({
  selector: 'app-select-brand-name',
  templateUrl: './select-brand-name.page.html',
  styleUrls: ['./select-brand-name.page.scss'],
})
export class SelectBrandNamePage implements OnInit {
  upcomingManufacturerList: any = [];
  selectedManufacturer: any;
  items: any = [];

  constructor(public navParams: NavParams, public httpClient: CommonService, public modalCtrl: ModalController) {
    this.items = this.upcomingManufacturerList = this.navParams.get('listOfBrandsName');

  }
  selectDealer(item) {
    this.modalCtrl.dismiss({ selectedBrand: item });
  }
  close() {
    this.modalCtrl.dismiss(null);
  }
  ngOnInit() {
  }
  getItems(ev) {
    // item.FirmNameEn
    this.items = this.upcomingManufacturerList;

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.CompanyBrandNameEn.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
