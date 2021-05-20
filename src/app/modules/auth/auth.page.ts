import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Constant } from 'src/app/constants/constant';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private loadinCtrl: LoadingController
  ) { }

  ngOnInit() {
  }



  onLoginGoogle() {
    // First pop up the google sign-in page and start the loading controller popup.
    // else it will block the G+ sign-in popup
    const googleSignCall = this.authService.googleAuth();

    this.loadinCtrl.create({ message: 'Authenticating' }).then((loadinCtrl) => {
      googleSignCall
        .then(
          (googleSign: any) => {
            this.navCtrl.navigateBack(Constant.URL_TRACKER_ADD);
            loadinCtrl.dismiss();
          })
        .catch(async (error) => {
          await this.alertCtrl.create({ message: error.message + ' Kindly try again' });
          loadinCtrl.dismiss();
        });
    });
  }

}
