import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialVerificationListPage } from './material-verification-list.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialVerificationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialVerificationListPageRoutingModule {}
