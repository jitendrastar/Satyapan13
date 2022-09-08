import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicSubListPage } from './lic-sub-list.page';

const routes: Routes = [
  {
    path: '',
    component: LicSubListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicSubListPageRoutingModule {}
