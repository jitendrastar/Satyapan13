import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManufactureDashboardPage } from './manufacture-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: ManufactureDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManufactureDashboardPageRoutingModule {}
