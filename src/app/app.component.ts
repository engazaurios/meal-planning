import { Component } from '@angular/core';
import 'reflect-metadata';
import 'es6-shim';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor() {
    moment.locale('es');
  }

}
