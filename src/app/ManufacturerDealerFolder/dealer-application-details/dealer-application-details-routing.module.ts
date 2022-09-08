import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DealerApplicationDetailsPage } from './dealer-application-details.page';

const routes: Routes = [
  {
    path: '',
    component: DealerApplicationDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealerApplicationDetailsPageRoutingModule {}
