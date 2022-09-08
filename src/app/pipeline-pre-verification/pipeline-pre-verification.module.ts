import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipelinePreVerificationPageRoutingModule } from './pipeline-pre-verification-routing.module';

import { PipelinePreVerificationPage } from './pipeline-pre-verification.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipelinePreVerificationPageRoutingModule
  ],
  declarations: [PipelinePreVerificationPage]
})
export class PipelinePreVerificationPageModule {}
