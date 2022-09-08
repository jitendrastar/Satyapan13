import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostVerificationPendingListPageRoutingModule } from './post-verification-pending-list-routing.module';

import { PostVerificationPendingListPage } from './post-verification-pending-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostVerificationPendingListPageRoutingModule
  ],
  declarations: [PostVerificationPendingListPage]
})
export class PostVerificationPendingListPageModule {}
