import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificationDoneByPage } from './verification-done-by.page';

const routes: Routes = [
  {
    path: '',
    component: VerificationDoneByPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificationDoneByPageRoutingModule {}
