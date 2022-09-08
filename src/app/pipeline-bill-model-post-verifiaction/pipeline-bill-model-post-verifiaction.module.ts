import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PipelineBillModelPostVerifiactionPageRoutingModule } from './pipeline-bill-model-post-verifiaction-routing.module';

import { PipelineBillModelPostVerifiactionPage } from './pipeline-bill-model-post-verifiaction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipelineBillModelPostVerifiactionPageRoutingModule
  ],
  declarations: [PipelineBillModelPostVerifiactionPage]
})
export class PipelineBillModelPostVerifiactionPageModule {}
