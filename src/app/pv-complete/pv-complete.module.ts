import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PvCompletePageRoutingModule } from './pv-complete-routing.module';

import { PvCompletePage } from './pv-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PvCompletePageRoutingModule
  ],
  declarations: [PvCompletePage]
})
export class PvCompletePageModule {}
