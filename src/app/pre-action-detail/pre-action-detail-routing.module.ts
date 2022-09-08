import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreActionDetailPage } from './pre-action-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PreActionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreActionDetailPageRoutingModule {}
