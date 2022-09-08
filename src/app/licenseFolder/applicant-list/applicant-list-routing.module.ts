import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicantListPage } from './applicant-list.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicantListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantListPageRoutingModule {}
