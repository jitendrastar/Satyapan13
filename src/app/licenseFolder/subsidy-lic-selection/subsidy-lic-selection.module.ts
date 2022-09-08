import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubsidyLicSelectionPageRoutingModule } from './subsidy-lic-selection-routing.module';

import { SubsidyLicSelectionPage } from './subsidy-lic-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubsidyLicSelectionPageRoutingModule
  ],
  declarations: [SubsidyLicSelectionPage]
})
export class SubsidyLicSelectionPageModule {}
