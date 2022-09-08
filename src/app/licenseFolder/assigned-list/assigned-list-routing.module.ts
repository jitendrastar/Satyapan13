import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignedListPage } from './assigned-list.page';

const routes: Routes = [
  {
    path: '',
    component: AssignedListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignedListPageRoutingModule {}
