import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillModelFarmImplementPage } from './bill-model-farm-implement.page';

const routes: Routes = [
  {
    path: '',
    component: BillModelFarmImplementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillModelFarmImplementPageRoutingModule {}
