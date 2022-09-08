import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForwardToPageRoutingModule } from './forward-to-routing.module';

import { ForwardToPage } from './forward-to.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForwardToPageRoutingModule
  ],
  declarations: [ForwardToPage]
})
export class ForwardToPageModule {}
