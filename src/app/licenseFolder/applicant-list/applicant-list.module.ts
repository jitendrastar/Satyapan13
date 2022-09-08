import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicantListPageRoutingModule } from './applicant-list-routing.module';

import { ApplicantListPage } from './applicant-list.page';
import { AssignmodalPageModule } from '../assignmodal/assignmodal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicantListPageRoutingModule,
    AssignmodalPageModule
  ],
  declarations: [ApplicantListPage]
})
export class ApplicantListPageModule {}
