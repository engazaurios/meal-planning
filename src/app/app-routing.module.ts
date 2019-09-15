import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers';
import { LoginComponent } from './login/login/login.component';
import { LoginQrComponent } from './login/login-qr/login-qr.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserEditResolverService } from './users/user-edit/user-edit-resolver.service';
import { PlanningComponent } from './planning/planning.component';
import { PlanningDayComponent } from './planning/planning-day/planning-day.component';
import { MenuListComponent } from './common/menu-list/menu-list.component';
import { ManageDayComponent } from './manage/manage-day/manage-day.component';
import { ManageTableComponent } from './manage/manage-table/manage-table.component';
import { ManageComponent } from './manage/manage.component';
import { RoleGuard } from './_helpers/role.guard';
import { Constants } from './_helpers/constants';
import { CostCentersComponent } from './cost-centers/cost-centers.component';
import { ReportingComponent } from './reporting/reporting.component';
import { AttendanceComponent } from './login/attendance/attendance.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login-qr',
    component: LoginQrComponent
  },
  {
    path: 'attendance',
    component: AttendanceComponent
  },
  {
    path: '',
    component: PlanningComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.nonAdminUserTypes }
  },
  {
    path: 'menu-list',
    component: MenuListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.nonAdminUserTypes }
  },
  {
    path: 'planning/:year/:month/:day',
    component: PlanningDayComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.nonAdminUserTypes }
  },
  {
    path: 'manage',
    component: ManageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.adminUserTypes }
  },
  {
    path: 'manage/table',
    component: ManageTableComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.adminUserTypes }
  },
  {
    path: 'manage/:year/:month/:day',
    component: ManageDayComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.adminUserTypes }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.adminUserTypes }
  },
  {
    path: 'users/new',
    component: UserEditComponent,
    resolve: {
      model: UserEditResolverService
    },
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.adminUserTypes }
  },
  {
    path: 'users/:id',
    component: UserEditComponent,
    resolve: {
      model: UserEditResolverService
    },
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: Constants.adminUserTypes }
  },
  {
    path: 'cost-centers',
    component: CostCentersComponent,
  },
  {
    path: 'reporting',
    component: ReportingComponent,
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
