import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaterTankPostVerificationPageRoutingModule } from './water-tank-post-verification-routing.module';

import { WaterTankPostVerificationPage } from './water-tank-post-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaterTankPostVerificationPageRoutingModule
  ],
  declarations: [WaterTankPostVerificationPage]
})
export class WaterTankPostVerificationPageModule {}
