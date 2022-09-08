import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicantListCompletedPage } from './applicant-list-completed.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicantListCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantListCompletedPageRoutingModule {}
