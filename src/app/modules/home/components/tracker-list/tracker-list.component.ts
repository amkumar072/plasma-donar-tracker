import { Component, EventEmitter, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IonSearchbar, ModalController, NavController } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constant } from 'src/app/constants/constant';
import { Tracker } from 'src/app/models/tracker.model';
import { TrackerService } from 'src/app/services/tracker.service';
import { TrackerViewComponent } from '../tracker-view/tracker-view.component';

@Component({
  selector: 'app-tracker-list',
  templateUrl: './tracker-list.component.html',
  styleUrls: ['./tracker-list.component.scss'],
})
export class TrackerListComponent implements OnInit, OnDestroy {

  @Input() reloadComp: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('mySearchBar', { static: true }) searchbar: IonSearchbar;

  trackerListObserval$: ReplaySubject<boolean> = new ReplaySubject(1);

  trackerDataSource: MatTableDataSource<Tracker>;
  columnsToDisplay = ['firstName', 'mobile', 'city', 'state', 'isReadyDonatePlasma',
    'isDonatedForPast30Days', 'bloodGroup'];
  resultsLength = 0;
  isLoadingResults = false;

  constructor(
    private trackerService: TrackerService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.fetchTrakerAll();
    this.reloadCompMethod();
  }

  reloadCompMethod() {
    this.reloadComp
      .pipe(takeUntil(this.trackerListObserval$))
      .subscribe(
        (result: boolean) => {
          if (result) {
            this.fetchTrakerAll();
          }
        });
  }

  ngOnDestroy() {
    this.trackerListObserval$.next(null);
    this.trackerListObserval$.complete();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.trackerDataSource.filter = filterValue.trim().toLowerCase();
  }

  onAdd() {
    this.navCtrl.navigateForward(Constant.URL_TRACKER_ADD);
  }

  async onReload() {
    await this.trackerService.getTrackerAllInDb();
  }

  async onView(id: string) {
    const modal = await this.modalCtrl.create({
      component: TrackerViewComponent,
      componentProps: { id },
      cssClass: Constant.MODAL_FULL_SCREEN
    });

    await modal.present();
  }

  private fetchTrakerAll() {
    this.isLoadingResults = true;
    this.trackerService.getTrackerAll().subscribe((res: Tracker[]) => {
      if (res) {
        this.trackerDataSource = new MatTableDataSource(res);
        this.resultsLength = res.length;
        this.trackerDataSource.paginator = this.paginator;
        this.trackerDataSource.sort = this.sort;

        this.isLoadingResults = false;
      }
    });
  }




}
