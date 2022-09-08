import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HortiApplicationBillModelPage } from './horti-application-bill-model.page';

const routes: Routes = [
  {
    path: '',
    component: HortiApplicationBillModelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HortiApplicationBillModelPageRoutingModule {}
