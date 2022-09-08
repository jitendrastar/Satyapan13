import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaingunPostVerificationPageRoutingModule } from './raingun-post-verification-routing.module';

import { RaingunPostVerificationPage } from './raingun-post-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RaingunPostVerificationPageRoutingModule
  ],
  declarations: [RaingunPostVerificationPage]
})
export class RaingunPostVerificationPageModule {}
