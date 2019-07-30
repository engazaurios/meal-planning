import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsExtra from '@angular/common/locales/extra/es';

import { NotifierModule } from 'angular-notifier';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login/login.component';
import { LoginQrComponent } from './login/login-qr/login-qr.component';
import { PlanningComponent } from './planning/planning.component';
import { PlanningDetailComponent } from './planning/planning-detail/planning-detail.component';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { RequestService } from './_services/request.service';
import { MenuListItemComponent } from './shared/menu-list-item/menu-list-item.component';
import { MenuListComponent } from './shared/menu-list/menu-list.component';
import { MenuListHeaderComponent } from './shared/menu-list-header/menu-list-header.component';
import { PlanningCalendarComponent } from './shared/planning-calendar/planning-calendar.component';

registerLocaleData (localeEs, 'es-GT', localeEsExtra);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    LoginQrComponent,

    PlanningComponent,
    PlanningDetailComponent,

    MenuListComponent,
    MenuListItemComponent,
    MenuListHeaderComponent,
    PlanningCalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NotifierModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    RequestService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
