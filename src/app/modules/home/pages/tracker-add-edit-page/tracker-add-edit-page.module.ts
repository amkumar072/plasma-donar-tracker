import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackerAddEditPagePageRoutingModule } from './tracker-add-edit-page-routing.module';

import { TrackerAddEditPagePage } from './tracker-add-edit-page.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackerAddEditPagePageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [TrackerAddEditPagePage]
})
export class TrackerAddEditPagePageModule { }
