import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiggiPreVerificationPage } from './diggi-pre-verification.page';

const routes: Routes = [
  {
    path: '',
    component: DiggiPreVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiggiPreVerificationPageRoutingModule {}
