import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LicApplicationListPageRoutingModule } from './lic-application-list-routing.module';

import { LicApplicationListPage } from './lic-application-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LicApplicationListPageRoutingModule
  ],
  declarations: [LicApplicationListPage]
})
export class LicApplicationListPageModule {}
