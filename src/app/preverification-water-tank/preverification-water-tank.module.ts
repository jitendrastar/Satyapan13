import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreverificationWaterTankPageRoutingModule } from './preverification-water-tank-routing.module';

import { PreverificationWaterTankPage } from './preverification-water-tank.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PreverificationWaterTankPageRoutingModule
  ],
  declarations: [PreverificationWaterTankPage]
})
export class PreverificationWaterTankPageModule {}
