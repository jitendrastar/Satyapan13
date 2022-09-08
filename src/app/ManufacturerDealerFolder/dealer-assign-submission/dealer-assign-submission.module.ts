import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealerAssignSubmissionPageRoutingModule } from './dealer-assign-submission-routing.module';

import { DealerAssignSubmissionPage } from './dealer-assign-submission.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DealerAssignSubmissionPageRoutingModule
  ],
  declarations: [DealerAssignSubmissionPage]
})
export class DealerAssignSubmissionPageModule {}
