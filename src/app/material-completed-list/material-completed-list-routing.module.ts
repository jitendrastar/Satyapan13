import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialCompletedListPage } from './material-completed-list.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialCompletedListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialCompletedListPageRoutingModule {}
