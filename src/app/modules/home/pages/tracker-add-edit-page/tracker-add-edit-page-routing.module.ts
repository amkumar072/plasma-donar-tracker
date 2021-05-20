import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackerAddEditPagePage } from './tracker-add-edit-page.page';

const routes: Routes = [
  {
    path: '',
    component: TrackerAddEditPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackerAddEditPagePageRoutingModule {}
