import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.less']
})
export class MenuListItemComponent implements OnInit {

  @Input()  public menu: any;
  @Input()  public isSelected: boolean;

  constructor() { }

  ngOnInit() {
  }

}
