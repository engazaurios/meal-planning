import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader-simple',
  templateUrl: './loader-simple.component.html',
  styleUrls: ['./../loader.component.less']
})
export class LoaderSimpleComponent implements OnInit {

  @Input()  isLoading = false;
  @Input()  isSmall = false;
  @Input()  isWithMargin = true;

  constructor() { }

  ngOnInit() {
  }

}
