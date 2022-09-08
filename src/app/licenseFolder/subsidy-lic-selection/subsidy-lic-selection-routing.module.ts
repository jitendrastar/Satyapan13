import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubsidyLicSelectionPage } from './subsidy-lic-selection.page';

const routes: Routes = [
  {
    path: '',
    component: SubsidyLicSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubsidyLicSelectionPageRoutingModule {}
