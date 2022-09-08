import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignSubmissionPage } from './assign-submission.page';

const routes: Routes = [
  {
    path: '',
    component: AssignSubmissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignSubmissionPageRoutingModule {}
