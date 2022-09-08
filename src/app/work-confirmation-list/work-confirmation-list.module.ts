import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkConfirmationListPageRoutingModule } from './work-confirmation-list-routing.module';

import { WorkConfirmationListPage } from './work-confirmation-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkConfirmationListPageRoutingModule
  ],
  declarations: [WorkConfirmationListPage]
})
export class WorkConfirmationListPageModule {}
