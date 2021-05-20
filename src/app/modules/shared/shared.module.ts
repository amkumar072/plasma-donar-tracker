import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { HelpComponent } from './components/help/help.component';



@NgModule({
  declarations: [
    HeaderComponent,
    HelpComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    HelpComponent
  ]
})
export class SharedModule { }
