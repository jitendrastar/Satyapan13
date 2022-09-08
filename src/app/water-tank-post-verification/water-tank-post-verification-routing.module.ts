import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaterTankPostVerificationPage } from './water-tank-post-verification.page';

const routes: Routes = [
  {
    path: '',
    component: WaterTankPostVerificationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaterTankPostVerificationPageRoutingModule {}
