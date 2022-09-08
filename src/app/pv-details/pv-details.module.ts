import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PvDetailsPageRoutingModule } from './pv-details-routing.module';

import { PvDetailsPage } from './pv-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PvDetailsPageRoutingModule
  ],
  declarations: [PvDetailsPage]
})
export class PvDetailsPageModule {}
