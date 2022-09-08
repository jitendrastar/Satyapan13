import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HorticultureApplicationListPage } from './horticulture-application-list.page';

const routes: Routes = [
  {
    path: '',
    component: HorticultureApplicationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorticultureApplicationListPageRoutingModule {}
