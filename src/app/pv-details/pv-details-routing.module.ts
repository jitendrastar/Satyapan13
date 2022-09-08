import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PvDetailsPage } from './pv-details.page';

const routes: Routes = [
  {
    path: '',
    component: PvDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PvDetailsPageRoutingModule {}
