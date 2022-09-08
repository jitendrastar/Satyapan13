import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreVerificationPage } from './pre-verification.page';

const routes: Routes = [
  {
    path: '',
    component: PreVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreVerificationPageRoutingModule {}
