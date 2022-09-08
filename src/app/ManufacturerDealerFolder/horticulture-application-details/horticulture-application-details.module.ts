import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorticultureApplicationDetailsPageRoutingModule } from './horticulture-application-details-routing.module';

import { HorticultureApplicationDetailsPage } from './horticulture-application-details.page';
import {BillModelPageModule} from '../../bill-model/bill-model.module';
import {HortiApplicationBillModelPageModule} from '../horti-application-bill-model/horti-application-bill-model.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HorticultureApplicationDetailsPageRoutingModule,
    HortiApplicationBillModelPageModule

  ],
  declarations: [HorticultureApplicationDetailsPage]
})
export class HorticultureApplicationDetailsPageModule {}
