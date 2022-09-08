import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialCompletedDetailsPageRoutingModule } from './material-completed-details-routing.module';

import { MaterialCompletedDetailsPage } from './material-completed-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialCompletedDetailsPageRoutingModule
  ],
  declarations: [MaterialCompletedDetailsPage]
})
export class MaterialCompletedDetailsPageModule {}
