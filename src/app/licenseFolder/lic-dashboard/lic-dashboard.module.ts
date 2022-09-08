import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicDashboardPageRoutingModule } from './lic-dashboard-routing.module';

import { LicDashboardPage } from './lic-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicDashboardPageRoutingModule
  ],
  declarations: [LicDashboardPage]
})
export class LicDashboardPageModule {}
