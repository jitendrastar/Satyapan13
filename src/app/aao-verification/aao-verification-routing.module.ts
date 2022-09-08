import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AaoVerificationPage } from './aao-verification.page';

const routes: Routes = [
  {
    path: '',
    component: AaoVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AaoVerificationPageRoutingModule {}
