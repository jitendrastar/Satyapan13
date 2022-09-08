import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineModePageRoutingModule } from './offline-mode-routing.module';

import { OfflineModePage } from './offline-mode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfflineModePageRoutingModule
  ],
  declarations: [OfflineModePage]
})
export class OfflineModePageModule {}
