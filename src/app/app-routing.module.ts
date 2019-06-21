import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuListComponent } from './menu-list/menu-list.component';
import { PlannedMealComponent } from './planned-meal/planned-meal.component';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';

const routes: Routes = [
  { path: '', component: MenuListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'planned-menu', component: PlannedMealComponent },

  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
