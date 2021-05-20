import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoadingController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Constant } from '../constants/constant';
import { Tracker } from '../models/tracker.model';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  trackerList: BehaviorSubject<Tracker[]> = new BehaviorSubject<Tracker[]>(null);

  constructor(
    private db: AngularFirestore,
    private loadinCtrl: LoadingController
  ) { }


  getTrackerAll(): Observable<Tracker[]> {
    return this.trackerList.asObservable()
      .pipe(tap((res: Tracker[]) => {
        if (res) {
          return res;
        } else {
          return this.getTrackerAllInDb();
        }
      }));
  }

  async getTrackerAllInDb(): Promise<Tracker[]> {
    const trackerList: Tracker[] = [];
    const loading = await this.loadinCtrl.create({ message: 'Loading...' });

    loading.present();
    return this.db.collection(Constant.COLLECTION_TRACKER_URL).get().pipe(
      map((res) => {
        res.docs.forEach(doc => {
          const data: any = doc.data();
          data.id = doc.id;
          trackerList.push(data);
        });
        this.trackerList.next(trackerList);
        // eslint-disable-next-line no-console
        // console.debug('trackerList :: getTrackerAllInDb ' + JSON.stringify(trackerList));
        loading.dismiss();
        return trackerList;
      }, (error) => {
        loading.dismiss();
        return error;
      })
    ).toPromise();

  }

  async createTracker(tracker: Tracker): Promise<any> {
    const result = await this.db.collection(Constant.COLLECTION_TRACKER_URL).doc().set(Object.assign({}, tracker));
    await this.getTrackerAllInDb();

    return result;
  }

  getTrackerById(id: string): Observable<Tracker[]> {
    // find the details in local cache itself
    return this.trackerList.asObservable()
      .pipe(
        map((trackerList: Tracker[]) => trackerList.filter(cust => cust.id === id))
      );
  }
}
