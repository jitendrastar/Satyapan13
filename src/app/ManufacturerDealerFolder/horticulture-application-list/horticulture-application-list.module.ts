import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorticultureApplicationListPageRoutingModule } from './horticulture-application-list-routing.module';

import { HorticultureApplicationListPage } from './horticulture-application-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorticultureApplicationListPageRoutingModule
  ],
  declarations: [HorticultureApplicationListPage]
})
export class HorticultureApplicationListPageModule {}
