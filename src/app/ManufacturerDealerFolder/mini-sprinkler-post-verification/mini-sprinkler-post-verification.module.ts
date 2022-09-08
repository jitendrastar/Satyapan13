import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiniSprinklerPostVerificationPageRoutingModule } from './mini-sprinkler-post-verification-routing.module';

import { MiniSprinklerPostVerificationPage } from './mini-sprinkler-post-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiniSprinklerPostVerificationPageRoutingModule
  ],
  declarations: [MiniSprinklerPostVerificationPage]
})
export class MiniSprinklerPostVerificationPageModule {}
