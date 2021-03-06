import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(updates: SwUpdate) {
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => {
        console.log('document will load');
        document.location.reload();
      });
    });
  }
}
