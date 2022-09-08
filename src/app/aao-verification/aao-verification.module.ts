import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AaoVerificationPageRoutingModule } from './aao-verification-routing.module';

import { AaoVerificationPage } from './aao-verification.page';
import {ForwardToPageModule} from '../forward-to/forward-to.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AaoVerificationPageRoutingModule,
    ForwardToPageModule,
  ],
  declarations: [AaoVerificationPage]
})
export class AaoVerificationPageModule {}
