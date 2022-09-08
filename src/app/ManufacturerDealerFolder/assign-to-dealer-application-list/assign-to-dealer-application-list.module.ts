import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignToDealerApplicationListPageRoutingModule } from './assign-to-dealer-application-list-routing.module';

import { AssignToDealerApplicationListPage } from './assign-to-dealer-application-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignToDealerApplicationListPageRoutingModule
  ],
  declarations: [AssignToDealerApplicationListPage]
})
export class AssignToDealerApplicationListPageModule {}
