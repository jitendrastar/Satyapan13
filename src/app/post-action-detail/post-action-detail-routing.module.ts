import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostActionDetailPage } from './post-action-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PostActionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostActionDetailPageRoutingModule {}
