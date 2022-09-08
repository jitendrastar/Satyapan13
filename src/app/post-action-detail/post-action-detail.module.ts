import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostActionDetailPageRoutingModule } from './post-action-detail-routing.module';

import { PostActionDetailPage } from './post-action-detail.page';
import { BillModelPageModule } from '../bill-model/bill-model.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostActionDetailPageRoutingModule,
    BillModelPageModule
  ],
  declarations: [PostActionDetailPage]
})
export class PostActionDetailPageModule { }
