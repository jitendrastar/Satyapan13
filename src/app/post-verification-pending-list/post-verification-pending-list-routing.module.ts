import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostVerificationPendingListPage } from './post-verification-pending-list.page';

const routes: Routes = [
  {
    path: '',
    component: PostVerificationPendingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostVerificationPendingListPageRoutingModule {}
