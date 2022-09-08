import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialPendingGatheredPageRoutingModule } from './material-pending-gathered-routing.module';

import { MaterialPendingGatheredPage } from './material-pending-gathered.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialPendingGatheredPageRoutingModule
  ],
  declarations: [MaterialPendingGatheredPage]
})
export class MaterialPendingGatheredPageModule {}
