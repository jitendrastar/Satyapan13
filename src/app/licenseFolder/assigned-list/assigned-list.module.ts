import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignedListPageRoutingModule } from './assigned-list-routing.module';

import { AssignedListPage } from './assigned-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignedListPageRoutingModule
  ],
  declarations: [AssignedListPage]
})
export class AssignedListPageModule {}
