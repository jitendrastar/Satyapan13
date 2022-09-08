import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KskUpdatePageRoutingModule } from './ksk-update-routing.module';

import { KskUpdatePage } from './ksk-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KskUpdatePageRoutingModule
  ],
  declarations: [KskUpdatePage]
})
export class KskUpdatePageModule {}
