import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { NgSelectModule } from '@ng-select/ng-select';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';

import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { RequestService } from './_services/request.service';
import { DataHelperService } from './_services/data.helper.service';
import { UsersService } from './users/users.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login/login.component';
import { LoginQrComponent } from './login/login-qr/login-qr.component';
import { PageTitleComponent } from './common/page-title/page-title.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { PlanningComponent } from './planning/planning.component';
import { PlanningDetailComponent } from './planning/planning-detail/planning-detail.component';
import { MenuListItemComponent } from './shared/menu-list-item/menu-list-item.component';
import { MenuListComponent } from './shared/menu-list/menu-list.component';
import { MenuListHeaderComponent } from './shared/menu-list-header/menu-list-header.component';
import { PlanningCalendarComponent } from './shared/planning-calendar/planning-calendar.component';
import { ReportingComponent } from './reporting/reporting.component';

registerLocaleData (localeEs, 'es-GT', localeEsExtra);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    LoginQrComponent,
    PageTitleComponent,
    UsersComponent,
    UserEditComponent,
    PlanningComponent,
    PlanningDetailComponent,
    MenuListComponent,
    MenuListItemComponent,
    MenuListHeaderComponent,
    PlanningCalendarComponent,
    ReportingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NotifierModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
  ],
  providers: [
    RequestService,
    DataHelperService,
    UsersService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
