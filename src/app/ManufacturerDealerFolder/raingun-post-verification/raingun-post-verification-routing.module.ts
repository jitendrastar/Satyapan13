import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaingunPostVerificationPage } from './raingun-post-verification.page';

const routes: Routes = [
  {
    path: '',
    component: RaingunPostVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaingunPostVerificationPageRoutingModule {}
