import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRole } from 'src/app/enum/user-role.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'add',
    loadChildren: () => import('./pages/tracker-add-edit-page/tracker-add-edit-page.module').then(m => m.TrackerAddEditPagePageModule),
    canActivate: [AuthGuard],
    data: { roles: [UserRole.ADMIN, UserRole.USER] }
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./pages/tracker-add-edit-page/tracker-add-edit-page.module').then(m => m.TrackerAddEditPagePageModule),
    canActivate: [AuthGuard],
    data: { roles: [UserRole.ADMIN, UserRole.USER] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
