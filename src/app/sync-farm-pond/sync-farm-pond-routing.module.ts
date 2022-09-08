import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SyncFarmPondPage } from './sync-farm-pond.page';

const routes: Routes = [
  {
    path: '',
    component: SyncFarmPondPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncFarmPondPageRoutingModule {}
