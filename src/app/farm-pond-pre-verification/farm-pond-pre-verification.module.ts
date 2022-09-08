import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FarmPondPreVerificationPageRoutingModule } from './farm-pond-pre-verification-routing.module';

import { FarmPondPreVerificationPage } from './farm-pond-pre-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FarmPondPreVerificationPageRoutingModule
  ],
  declarations: [FarmPondPreVerificationPage]
})
export class FarmPondPreVerificationPageModule {}
