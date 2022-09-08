import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostVerificationShowDetailsConfirmationPageRoutingModule } from './post-verification-show-details-confirmation-routing.module';

import { PostVerificationShowDetailsConfirmationPage } from './post-verification-show-details-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostVerificationShowDetailsConfirmationPageRoutingModule
  ],
  declarations: [PostVerificationShowDetailsConfirmationPage]
})
export class PostVerificationShowDetailsConfirmationPageModule {}

