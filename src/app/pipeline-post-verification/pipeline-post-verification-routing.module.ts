import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PipelinePostVerificationPage } from './pipeline-post-verification.page';

const routes: Routes = [
  {
    path: '',
    component: PipelinePostVerificationPage
  },
  {
    path: 'select-brand-name',
    loadChildren: () => import('./select-brand-name/select-brand-name.module').then( m => m.SelectBrandNamePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PipelinePostVerificationPageRoutingModule {}
