import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkConfirmationPageRoutingModule } from './work-confirmation-routing.module';

import { WorkConfirmationPage } from './work-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkConfirmationPageRoutingModule
  ],
  declarations: [WorkConfirmationPage]
})
export class WorkConfirmationPageModule {}
