import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DealerApplicationDetailsPageRoutingModule } from './dealer-application-details-routing.module';

import { DealerApplicationDetailsPage } from './dealer-application-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DealerApplicationDetailsPageRoutingModule
  ],
  declarations: [DealerApplicationDetailsPage]
})
export class DealerApplicationDetailsPageModule {}
