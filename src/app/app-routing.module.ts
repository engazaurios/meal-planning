import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuListComponent } from './menu-list/menu-list.component';
import { PlannedMealComponent } from './planned-meal/planned-meal.component';
import { AuthGuard } from './_helpers';
import {LoginComponent} from './login/login/login.component';
import {LoginQrComponent} from './login/login-qr/login-qr.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';

const routes: Routes = [
  { path: '', component: MenuListComponent, canActivate: [AuthGuard] },
  { path: 'planned-menu', component: PlannedMealComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'login-qr', component: LoginQrComponent },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/new',
    component: UserEditComponent
  },
  {
    path: 'users/:id',
    component: UserEditComponent
  },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
