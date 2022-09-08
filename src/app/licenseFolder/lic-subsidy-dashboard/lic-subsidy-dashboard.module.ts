import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicSubsidyDashboardPageRoutingModule } from './lic-subsidy-dashboard-routing.module';

import { LicSubsidyDashboardPage } from './lic-subsidy-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicSubsidyDashboardPageRoutingModule
  ],
  declarations: [LicSubsidyDashboardPage]
})
export class LicSubsidyDashboardPageModule {}
