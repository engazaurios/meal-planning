import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.less']
})
export class PageTitleComponent implements OnInit {
  @Input() title: string;
  @Input() actions: Array<Object>;
  @Input() centerTitle: boolean;

  constructor() { }

  ngOnInit() {
  }

}
