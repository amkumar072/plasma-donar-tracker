import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Constant } from 'src/app/constants/constant';
import { AuthService } from 'src/app/services/auth.service';
import { HelpComponent } from '../help/help.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isVisibleLogout = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.authService.userIsAuthenticated.subscribe(result => {
      if (result) {
        this.isVisibleLogout = true;
      }
    });
  }

  home() {
    this.navCtrl.navigateBack(Constant.HOME);
  }

  async logOut() {
    await this.authService.logOutService();
    window.location.reload();
  }

  async onHelp() {
    const modal = await this.modalCtrl.create({
      component: HelpComponent,
      componentProps: {},
      cssClass: Constant.MODAL_75_PERCENTAGE_SCREEN
    });

    await modal.present();
    return modal.onDidDismiss();
  }

}
