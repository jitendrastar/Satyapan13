import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostverificationReportPageRoutingModule } from './postverification-report-routing.module';

import { PostverificationReportPage } from './postverification-report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostverificationReportPageRoutingModule
  ],
  declarations: [PostverificationReportPage]
})
export class PostverificationReportPageModule {}
