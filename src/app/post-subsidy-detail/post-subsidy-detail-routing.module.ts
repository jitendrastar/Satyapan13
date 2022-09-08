import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostSubsidyDetailPage } from './post-subsidy-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PostSubsidyDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostSubsidyDetailPageRoutingModule {}
