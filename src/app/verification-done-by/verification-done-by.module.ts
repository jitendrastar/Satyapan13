import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificationDoneByPageRoutingModule } from './verification-done-by-routing.module';

import { VerificationDoneByPage } from './verification-done-by.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificationDoneByPageRoutingModule
  ],
  declarations: [VerificationDoneByPage]
})
export class VerificationDoneByPageModule {}
