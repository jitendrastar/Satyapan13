import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicListPageRoutingModule } from './lic-list-routing.module';

import { LicListPage } from './lic-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicListPageRoutingModule
  ],
  declarations: [LicListPage]
})
export class LicListPageModule {}
