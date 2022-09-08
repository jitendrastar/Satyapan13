import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreverificationWaterTankPage } from './preverification-water-tank.page';

const routes: Routes = [
  {
    path: '',
    component: PreverificationWaterTankPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreverificationWaterTankPageRoutingModule {}
