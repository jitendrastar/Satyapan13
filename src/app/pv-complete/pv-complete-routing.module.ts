import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PvCompletePage } from './pv-complete.page';

const routes: Routes = [
  {
    path: '',
    component: PvCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PvCompletePageRoutingModule {}
