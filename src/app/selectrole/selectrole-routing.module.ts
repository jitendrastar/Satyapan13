import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectrolePage } from './selectrole.page';

const routes: Routes = [
  {
    path: '',
    component: SelectrolePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectrolePageRoutingModule {}
