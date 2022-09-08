import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VersionUpdatePageRoutingModule } from './version-update-routing.module';

import { VersionUpdatePage } from './version-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VersionUpdatePageRoutingModule
  ],
  declarations: [VersionUpdatePage]
})
export class VersionUpdatePageModule {}
