import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiggiPostVerificationPage } from './diggi-post-verification.page';

const routes: Routes = [
  {
    path: '',
    component: DiggiPostVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiggiPostVerificationPageRoutingModule {}
