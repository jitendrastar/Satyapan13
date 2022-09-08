import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncFarmPondPageRoutingModule } from './sync-farm-pond-routing.module';

import { SyncFarmPondPage } from './sync-farm-pond.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SyncFarmPondPageRoutingModule
  ],
  declarations: [SyncFarmPondPage]
})
export class SyncFarmPondPageModule {}
