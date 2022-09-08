import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmPondPreVerificationPage } from './farm-pond-pre-verification.page';

const routes: Routes = [
  {
    path: '',
    component: FarmPondPreVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmPondPreVerificationPageRoutingModule {}
