import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicationVerificationPageRoutingModule } from './application-verification-routing.module';

import { ApplicationVerificationPage } from './application-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicationVerificationPageRoutingModule
  ],
  declarations: [ApplicationVerificationPage]
})
export class ApplicationVerificationPageModule {}
