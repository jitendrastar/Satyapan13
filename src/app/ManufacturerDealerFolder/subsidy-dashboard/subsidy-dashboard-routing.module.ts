import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubsidyDashboardPage } from './subsidy-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: SubsidyDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubsidyDashboardPageRoutingModule {}
