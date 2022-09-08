import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectBrandNamePage } from './select-brand-name.page';

const routes: Routes = [
  {
    path: '',
    component: SelectBrandNamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectBrandNamePageRoutingModule {}
