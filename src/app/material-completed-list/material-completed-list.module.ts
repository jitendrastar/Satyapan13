import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialCompletedListPageRoutingModule } from './material-completed-list-routing.module';

import { MaterialCompletedListPage } from './material-completed-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialCompletedListPageRoutingModule
  ],
  declarations: [MaterialCompletedListPage]
})
export class MaterialCompletedListPageModule {}
