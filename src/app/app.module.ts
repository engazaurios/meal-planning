import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';

import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor } from './_helpers';
import { ErrorInterceptor } from './_helpers';
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
import { PlanningDayComponent } from './planning/planning-day/planning-day.component';
import { MenuListItemComponent } from './common/menu-list-item/menu-list-item.component';
import { MenuListComponent } from './common/menu-list/menu-list.component';
import { MenuListHeaderComponent } from './common/menu-list-header/menu-list-header.component';
import { MenuCalendarComponent } from './common/menu-calendar/menu-calendar.component';
import { ManageComponent } from './manage/manage.component';
import { ManageDayComponent } from './manage/manage-day/manage-day.component';
import { ManageCalendarComponent } from './manage/manage-calendar/manage-calendar.component';
import { ManageTableComponent } from './manage/manage-table/manage-table.component';
import { MenuCreateComponent } from './common/forms/menu-forms/menu-add/menu-create.component';
import { MenuUploadComponent } from './common/forms/menu-forms/menu-upload/menu-upload.component';
import { AlertSimpleComponent } from './common/forms/common-forms/alert-simple/alert-simple.component';
import { MenuViewComponent } from './common/forms/menu-forms/menu-view/menu-view.component';

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
    ManageComponent,
    PlanningDayComponent,
    ManageDayComponent,
    MenuListComponent,
    MenuListItemComponent,
    MenuListHeaderComponent,
    MenuCalendarComponent,
    ManageCalendarComponent,
    ManageTableComponent,
    MenuCreateComponent,
    MenuUploadComponent,
    AlertSimpleComponent,
    MenuViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NotifierModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: [
    AlertSimpleComponent,
    MenuViewComponent,
    MenuCreateComponent,
    MenuUploadComponent
  ],
  providers: [
    RequestService,
    DataHelperService,
    UsersService,
    NgbActiveModal,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
