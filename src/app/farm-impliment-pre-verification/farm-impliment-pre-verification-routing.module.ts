import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmImplimentPreVerificationPage } from './farm-impliment-pre-verification.page';

const routes: Routes = [
  {
    path: '',
    component: FarmImplimentPreVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmImplimentPreVerificationPageRoutingModule {}
