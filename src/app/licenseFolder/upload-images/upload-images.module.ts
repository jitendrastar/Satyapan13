import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadImagesPageRoutingModule } from './upload-images-routing.module';

import { UploadImagesPage } from './upload-images.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadImagesPageRoutingModule
  ],
  declarations: [UploadImagesPage]
})
export class UploadImagesPageModule {}
