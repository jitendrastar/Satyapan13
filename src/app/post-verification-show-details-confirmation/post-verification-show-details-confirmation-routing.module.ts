import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostVerificationShowDetailsConfirmationPage } from './post-verification-show-details-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: PostVerificationShowDetailsConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostVerificationShowDetailsConfirmationPageRoutingModule {}
