import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PipelineBillModelPostVerifiactionPage } from './pipeline-bill-model-post-verifiaction.page';

const routes: Routes = [
  {
    path: '',
    component: PipelineBillModelPostVerifiactionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PipelineBillModelPostVerifiactionPageRoutingModule {}
