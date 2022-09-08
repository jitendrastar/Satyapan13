import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DripPostVerificationPage } from './drip-post-verification.page';

const routes: Routes = [
  {
    path: '',
    component: DripPostVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DripPostVerificationPageRoutingModule {}
