import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillModelPageRoutingModule } from './bill-model-routing.module';

import { BillModelPage } from './bill-model.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillModelPageRoutingModule
  ],
  declarations: [BillModelPage]
})
export class BillModelPageModule {}
