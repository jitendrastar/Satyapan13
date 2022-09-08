import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForwardToPage } from './forward-to.page';

const routes: Routes = [
  {
    path: '',
    component: ForwardToPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForwardToPageRoutingModule {}
