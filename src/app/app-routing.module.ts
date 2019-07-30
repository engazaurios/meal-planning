import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';
import { LoginComponent } from './login/login/login.component';
import { LoginQrComponent } from './login/login-qr/login-qr.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserEditResolverService } from './users/user-edit/user-edit-resolver.service';
import { PlanningComponent } from './planning/planning.component';
import { PlanningDetailComponent } from './planning/planning-detail/planning-detail.component';
import { MenuListComponent } from './shared/menu-list/menu-list.component';

const routes: Routes = [
  {
    path: '',
    component: PlanningComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login-qr',
    component: LoginQrComponent
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/new',
    component: UserEditComponent,
    resolve: {
      model: UserEditResolverService
    }
  },
  {
    path: 'users/:id',
    component: UserEditComponent,
    resolve: {
      model: UserEditResolverService
    }
  },
  {
    path: 'planning/:year/:month/:day',
    component: PlanningDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu-list',
    component: MenuListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
