import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FarmImplimentPreVerificationPageRoutingModule } from './farm-impliment-pre-verification-routing.module';

import { FarmImplimentPreVerificationPage } from './farm-impliment-pre-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FarmImplimentPreVerificationPageRoutingModule
  ],
  declarations: [FarmImplimentPreVerificationPage]
})
export class FarmImplimentPreVerificationPageModule {}
