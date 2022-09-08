import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignmodalPageRoutingModule } from './assignmodal-routing.module';

import { AssignmodalPage } from './assignmodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignmodalPageRoutingModule
  ],
  declarations: [AssignmodalPage]
})
export class AssignmodalPageModule {}
