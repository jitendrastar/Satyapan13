import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkConfirmationListPage } from './work-confirmation-list.page';

const routes: Routes = [
  {
    path: '',
    component: WorkConfirmationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkConfirmationListPageRoutingModule {}
