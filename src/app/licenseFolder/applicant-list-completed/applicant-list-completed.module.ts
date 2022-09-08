import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicantListCompletedPageRoutingModule } from './applicant-list-completed-routing.module';

import { ApplicantListCompletedPage } from './applicant-list-completed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicantListCompletedPageRoutingModule
  ],
  declarations: [ApplicantListCompletedPage]
})
export class ApplicantListCompletedPageModule {}
