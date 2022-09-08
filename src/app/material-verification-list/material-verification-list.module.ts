import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialVerificationListPageRoutingModule } from './material-verification-list-routing.module';

import { MaterialVerificationListPage } from './material-verification-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialVerificationListPageRoutingModule
  ],
  declarations: [MaterialVerificationListPage]
})
export class MaterialVerificationListPageModule {}
