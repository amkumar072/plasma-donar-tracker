import { Component, EventEmitter } from '@angular/core';
import { Constant } from 'src/app/constants/constant';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  footerMessage: string = Constant.FOOOTER_MESSAGE;

  reloadComp: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ionViewWillEnter() {
    this.reloadComp.emit(true);
  }

}
