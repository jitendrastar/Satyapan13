import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignToDealerApplicationListPage } from './assign-to-dealer-application-list.page';

const routes: Routes = [
  {
    path: '',
    component: AssignToDealerApplicationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignToDealerApplicationListPageRoutingModule {}
