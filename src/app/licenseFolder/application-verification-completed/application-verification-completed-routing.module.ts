import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationVerificationCompletedPage } from './application-verification-completed.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicationVerificationCompletedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationVerificationCompletedPageRoutingModule {}
