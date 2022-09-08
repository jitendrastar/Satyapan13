import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiggiPreVerificationPageRoutingModule } from './diggi-pre-verification-routing.module';

import { DiggiPreVerificationPage } from './diggi-pre-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiggiPreVerificationPageRoutingModule
  ],
  declarations: [DiggiPreVerificationPage]
})
export class DiggiPreVerificationPageModule {}
