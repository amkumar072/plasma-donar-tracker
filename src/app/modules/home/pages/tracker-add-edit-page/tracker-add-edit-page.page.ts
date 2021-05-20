import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Constant } from 'src/app/constants/constant';
import { Tracker } from 'src/app/models/tracker.model';
import { AuthService } from 'src/app/services/auth.service';
import { TrackerService } from 'src/app/services/tracker.service';

@Component({
  selector: 'app-tracker-add-edit-page',
  templateUrl: './tracker-add-edit-page.page.html',
  styleUrls: ['./tracker-add-edit-page.page.scss'],
})
export class TrackerAddEditPagePage implements OnInit {
  @Input() id: string;

  currentUser: string;
  form: FormGroup;
  tracker: Tracker;
  isEdit = false;
  displayButtonText: string;
  lists = ['Yes', 'No'];
  bloodGroupList = [
    'A+',
    'A-',
    'B+',
    'B-',
    'O+',
    'O-',
    'AB+',
    'AB-'
  ];
  stateLists = Constant.stateList;

  constructor(
    private trackerService: TrackerService,
    private navCtrl: NavController,
    private authService: AuthService,
    private loadinCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {

    this.authService.userName.subscribe((userName) => {
      this.currentUser = userName;
    });

    if (!this.id) {
      this.tracker = new Tracker();

      this.isEdit = false;
      this.displayButtonText = 'Preview';
      this.formControl();
    } else {
      // this.customerDetailById(this.id);
      this.isEdit = true;
      this.displayButtonText = 'Update';
    }
  }

  formControl() {
    this.form = new FormGroup({
      firstName: new FormControl(this.tracker.firstName, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      lastName: new FormControl(this.tracker.lastName, {
        updateOn: 'change'
      }),
      mobile: new FormControl(this.tracker.mobile, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      otherNumber: new FormControl(this.tracker.otherNumber, {
        updateOn: 'change',
      }),
      city: new FormControl(this.tracker.city, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      state: new FormControl(this.tracker.state, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      // isCovidPositiveRecovered: new FormControl(this.tracker.isCovidPositiveRecovered, {
      //   updateOn: 'change',
      //   validators: [Validators.required]
      // }),
      isReadyDonatePlasma: new FormControl(this.tracker.isReadyDonatePlasma, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      isDonatedForPast30Days: new FormControl(this.tracker.isDonatedForPast30Days, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      bloodGroup: new FormControl(this.tracker.bloodGroup, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onCancel() {
    this.navCtrl.navigateBack(Constant.HOME);
  }

  async onClick() {


    if (this.form.invalid) {
      console.log('test');
      this.form.markAllAsTouched();
      return;
    } else if (!this.isEdit) {

      const tracker: Tracker = this.form.getRawValue();
      tracker.firstName = tracker.firstName.toLowerCase();
      if (tracker.lastName !== null) {
        tracker.lastName = tracker.lastName.toLowerCase();
      }
      tracker.city = tracker.city.toLowerCase();
      tracker.createdBy = this.currentUser;
      tracker.createdDate = new Date();

      await this.presentAlertConfirm(tracker);
    } else {
      // await this.onUpdate();
    }
  }

  async presentAlertConfirm(tracker: Tracker) {

    const message = `
    <p> Name : ${tracker.firstName}  ${tracker.lastName == null ? '' : tracker.lastName}  </p>
    <p>  Mobile : ${tracker.mobile} </p>
    <p>  OtherNumber: ${tracker.otherNumber == null ? '' : tracker.otherNumber} </p>
    <p>  City: ${tracker.city}</p>
    <p>  State: ${tracker.state}</p>
    <p>  Ready to donate Blood/Plasma? : ${tracker.isReadyDonatePlasma}</p>
    <p>  Donated Blood/Plasma in last 30 Days?: ${tracker.isDonatedForPast30Days}</p>
    <p>  Blood Group: ${tracker.bloodGroup}</p>


   <p>
${Constant.CONSENT_MESSAGE}
   </p>
    `;

    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      cssClass: 'my-custom-alert',
      backdropDismiss: false,
      message,
      buttons: [
        {
          text: 'Edit',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Submit',
          handler: () => {
            this.onAdd(tracker);
          }
        }
      ]
    });

    await alert.present();
  }


  async onAdd(tracker: Tracker) {
    const loading = await this.loadinCtrl.create({ message: 'Saving...' });

    loading.present();
    try {
      await this.trackerService.createTracker(tracker);
      await loading.dismiss();

      this.onCancel();
      await (await this.toastCtrl.create({
        message: 'Donar Details Saved Succesfully',
        duration: 8000,
        position: 'top'
      })).present();
    }
    catch (error) {
      console.log('Error While Saving Data', error);

      await (await this.toastCtrl.create({ message: 'Error While Saving Data', duration: 5000 })).present();

      await loading.dismiss();
    }

  }


}
