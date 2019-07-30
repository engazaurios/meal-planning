import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';
import { LoginComponent } from './login/login/login.component';
import { LoginQrComponent } from './login/login-qr/login-qr.component';
import { PlanningComponent } from './planning/planning.component';
import { PlanningDetailComponent } from './planning/planning-detail/planning-detail.component';
import { MenuListComponent } from './shared/menu-list/menu-list.component';

const routes: Routes = [
  { path: '', component: PlanningComponent, canActivate: [AuthGuard] },
  { path: 'planning/:year/:month/:day', component: PlanningDetailComponent, canActivate: [AuthGuard] },
  { path: 'menu-list', component: MenuListComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'login-qr', component: LoginQrComponent },

  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
