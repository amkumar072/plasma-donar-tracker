import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Tracker } from 'src/app/models/tracker.model';
import { TrackerService } from 'src/app/services/tracker.service';

@Component({
  selector: 'app-tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss'],
})
export class TrackerViewComponent implements OnInit {
  @Input() id: string;


  tracker: Tracker;
  phoneURL: string;

  constructor(
    private trackerService: TrackerService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.fetchTrackerById(this.id);


  }

  fetchTrackerById(id: string) {
    this.trackerService.getTrackerById(id).subscribe(res => {
      this.tracker = res[0];

      this.phoneURL = `tel:+91${this.tracker.mobile}`;

    });
  }

  dismissComp() {
    this.modalCtrl.dismiss(null, 'Cancel');
  }

}
