import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialPendingGatheredDetailsPageRoutingModule } from './material-pending-gathered-details-routing.module';

import { MaterialPendingGatheredDetailsPage } from './material-pending-gathered-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialPendingGatheredDetailsPageRoutingModule
  ],
  declarations: [MaterialPendingGatheredDetailsPage]
})
export class MaterialPendingGatheredDetailsPageModule {}
