import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicSubListPageRoutingModule } from './lic-sub-list-routing.module';

import { LicSubListPage } from './lic-sub-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicSubListPageRoutingModule
  ],
  declarations: [LicSubListPage]
})
export class LicSubListPageModule {}
