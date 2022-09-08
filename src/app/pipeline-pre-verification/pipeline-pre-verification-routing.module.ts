import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PipelinePreVerificationPage } from './pipeline-pre-verification.page';

const routes: Routes = [
  {
    path: '',
    component: PipelinePreVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PipelinePreVerificationPageRoutingModule {}
