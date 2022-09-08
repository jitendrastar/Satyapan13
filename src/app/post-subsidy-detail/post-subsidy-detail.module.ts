import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostSubsidyDetailPageRoutingModule } from './post-subsidy-detail-routing.module';

import { PostSubsidyDetailPage } from './post-subsidy-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostSubsidyDetailPageRoutingModule
  ],
  declarations: [PostSubsidyDetailPage]
})
export class PostSubsidyDetailPageModule {}
