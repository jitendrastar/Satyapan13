import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectBrandNamePageRoutingModule } from './select-brand-name-routing.module';

import { SelectBrandNamePage } from './select-brand-name.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectBrandNamePageRoutingModule
  ],
  declarations: [SelectBrandNamePage]
})
export class SelectBrandNamePageModule {}
