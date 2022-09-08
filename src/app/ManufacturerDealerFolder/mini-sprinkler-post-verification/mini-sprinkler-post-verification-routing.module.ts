import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiniSprinklerPostVerificationPage } from './mini-sprinkler-post-verification.page';

const routes: Routes = [
  {
    path: '',
    component: MiniSprinklerPostVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiniSprinklerPostVerificationPageRoutingModule {}
