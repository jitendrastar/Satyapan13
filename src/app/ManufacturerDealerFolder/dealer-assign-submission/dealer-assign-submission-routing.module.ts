import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DealerAssignSubmissionPage } from './dealer-assign-submission.page';

const routes: Routes = [
  {
    path: '',
    component: DealerAssignSubmissionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DealerAssignSubmissionPageRoutingModule {}
