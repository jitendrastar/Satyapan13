import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationVerificationPage } from './application-verification.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicationVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationVerificationPageRoutingModule {}
