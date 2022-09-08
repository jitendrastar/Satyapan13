import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialCompletedDetailsPage } from './material-completed-details.page';

const routes: Routes = [
  {
    path: '',
    component: MaterialCompletedDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialCompletedDetailsPageRoutingModule {}
