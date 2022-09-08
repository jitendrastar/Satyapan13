import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreVerificationPageRoutingModule } from './pre-verification-routing.module';

import { PreVerificationPage } from './pre-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreVerificationPageRoutingModule
  ],
  declarations: [PreVerificationPage]
})
export class PreVerificationPageModule {}
