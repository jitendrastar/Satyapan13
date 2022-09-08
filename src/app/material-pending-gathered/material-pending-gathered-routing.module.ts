import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialPendingGatheredPage } from './material-pending-gathered.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialPendingGatheredPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialPendingGatheredPageRoutingModule {}
