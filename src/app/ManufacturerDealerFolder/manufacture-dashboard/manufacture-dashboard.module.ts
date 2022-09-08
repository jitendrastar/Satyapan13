import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManufactureDashboardPageRoutingModule } from './manufacture-dashboard-routing.module';

import { ManufactureDashboardPage } from './manufacture-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManufactureDashboardPageRoutingModule
  ],
  declarations: [ManufactureDashboardPage]
})
export class ManufactureDashboardPageModule {}
