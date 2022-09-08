import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignmodalPage } from './assignmodal.page';

const routes: Routes = [
  {
    path: '',
    component: AssignmodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignmodalPageRoutingModule {}
