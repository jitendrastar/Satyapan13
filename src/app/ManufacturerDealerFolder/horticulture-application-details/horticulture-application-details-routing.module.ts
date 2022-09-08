import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorticultureApplicationDetailsPage } from './horticulture-application-details.page';

const routes: Routes = [
  {
    path: '',
    component: HorticultureApplicationDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorticultureApplicationDetailsPageRoutingModule {}
