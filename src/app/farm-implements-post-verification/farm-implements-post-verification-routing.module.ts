import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmImplementsPostVerificationPage } from './farm-implements-post-verification.page';

const routes: Routes = [
  {
    path: '',
    component: FarmImplementsPostVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmImplementsPostVerificationPageRoutingModule {}
