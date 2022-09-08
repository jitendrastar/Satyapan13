import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillModelFarmImplementPageRoutingModule } from './bill-model-farm-implement-routing.module';

import { BillModelFarmImplementPage } from './bill-model-farm-implement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillModelFarmImplementPageRoutingModule
  ],
  declarations: [BillModelFarmImplementPage]
})
export class BillModelFarmImplementPageModule {}
