import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipelinePostVerificationPageRoutingModule } from './pipeline-post-verification-routing.module';

import { PipelinePostVerificationPage } from './pipeline-post-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipelinePostVerificationPageRoutingModule
  ],
  declarations: [PipelinePostVerificationPage]
})
export class PipelinePostVerificationPageModule {}
