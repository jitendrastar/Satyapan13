import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubsidyDetailPageRoutingModule } from './subsidy-detail-routing.module';

import { SubsidyDetailPage } from './subsidy-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubsidyDetailPageRoutingModule
  ],
  declarations: [SubsidyDetailPage]
})
export class SubsidyDetailPageModule {}
