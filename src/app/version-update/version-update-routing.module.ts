import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VersionUpdatePage } from './version-update.page';

const routes: Routes = [
  {
    path: '',
    component: VersionUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VersionUpdatePageRoutingModule {}
