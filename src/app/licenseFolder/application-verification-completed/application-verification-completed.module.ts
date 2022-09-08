import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicationVerificationCompletedPageRoutingModule } from './application-verification-completed-routing.module';

import { ApplicationVerificationCompletedPage } from './application-verification-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicationVerificationCompletedPageRoutingModule
  ],
  declarations: [ApplicationVerificationCompletedPage]
})
export class ApplicationVerificationCompletedPageModule {}
