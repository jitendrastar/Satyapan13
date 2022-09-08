import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialPendingGatheredDetailsPage } from './material-pending-gathered-details.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialPendingGatheredDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialPendingGatheredDetailsPageRoutingModule {}
