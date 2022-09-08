import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreActionDetailPageRoutingModule } from './pre-action-detail-routing.module';

import { PreActionDetailPage } from './pre-action-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreActionDetailPageRoutingModule
  ],
  declarations: [PreActionDetailPage]
})
export class PreActionDetailPageModule {}
