import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectrolePageRoutingModule } from './selectrole-routing.module';

import { SelectrolePage } from './selectrole.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectrolePageRoutingModule
  ],
  declarations: [SelectrolePage]
})
export class SelectrolePageModule {}
