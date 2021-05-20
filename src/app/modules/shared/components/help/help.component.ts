/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Constant } from 'src/app/constants/constant';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

  CONSENT_MESSAGE: string = Constant.CONSENT_MESSAGE;
  FOOOTER_MESSAGE: string = Constant.FOOOTER_MESSAGE;


  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() { }

  dismissComp() {
    this.modalCtrl.dismiss(null, 'Cancel');
  }

}
