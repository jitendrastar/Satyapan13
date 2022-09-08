import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MicroSprinklerPostVerificationPage } from './micro-sprinkler-post-verification.page';

const routes: Routes = [
  {
    path: '',
    component: MicroSprinklerPostVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MicroSprinklerPostVerificationPageRoutingModule {}
