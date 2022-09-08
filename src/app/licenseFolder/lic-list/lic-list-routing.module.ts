import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LicListPage } from './lic-list.page';

const routes: Routes = [
  {
    path: '',
    component: LicListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicListPageRoutingModule {}
