import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FarmImplementsPostVerificationPageRoutingModule } from './farm-implements-post-verification-routing.module';

import { FarmImplementsPostVerificationPage } from './farm-implements-post-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FarmImplementsPostVerificationPageRoutingModule
  ],
  declarations: [FarmImplementsPostVerificationPage]
})
export class FarmImplementsPostVerificationPageModule {}
