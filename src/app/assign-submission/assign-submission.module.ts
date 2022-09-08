import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignSubmissionPageRoutingModule } from './assign-submission-routing.module';

import { AssignSubmissionPage } from './assign-submission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignSubmissionPageRoutingModule
  ],
  declarations: [AssignSubmissionPage]
})
export class AssignSubmissionPageModule {}
