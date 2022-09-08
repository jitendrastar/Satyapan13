import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiggiPostVerificationPageRoutingModule } from './diggi-post-verification-routing.module';

import { DiggiPostVerificationPage } from './diggi-post-verification.page';
import { BillModelPageModule } from '../bill-model/bill-model.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiggiPostVerificationPageRoutingModule,
    BillModelPageModule
  ],
  declarations: [DiggiPostVerificationPage]
})
export class DiggiPostVerificationPageModule {}
