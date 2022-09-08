import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DripPostVerificationPageRoutingModule } from './drip-post-verification-routing.module';

import { DripPostVerificationPage } from './drip-post-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DripPostVerificationPageRoutingModule
  ],
  declarations: [DripPostVerificationPage]
})
export class DripPostVerificationPageModule {}
