import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicDashboardPage } from './lic-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: LicDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicDashboardPageRoutingModule {}
