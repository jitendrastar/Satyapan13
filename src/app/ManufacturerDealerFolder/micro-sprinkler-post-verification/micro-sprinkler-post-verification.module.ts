import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MicroSprinklerPostVerificationPageRoutingModule } from './micro-sprinkler-post-verification-routing.module';

import { MicroSprinklerPostVerificationPage } from './micro-sprinkler-post-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MicroSprinklerPostVerificationPageRoutingModule
  ],
  declarations: [MicroSprinklerPostVerificationPage]
})
export class MicroSprinklerPostVerificationPageModule {}
