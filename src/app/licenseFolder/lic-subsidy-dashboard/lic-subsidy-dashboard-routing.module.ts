import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicSubsidyDashboardPage } from './lic-subsidy-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: LicSubsidyDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicSubsidyDashboardPageRoutingModule {}
