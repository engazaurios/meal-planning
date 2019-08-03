import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.less']
})
export class MenuListItemComponent implements OnInit {

  @Input()  public menu: any;
  @Input()  public isSelected: boolean;

  // TODO : delete index
  @Input()  public index: any;

  constructor() { }

  ngOnInit() {
  }

  // TODO : get expected image.
  getRandomImage() {
    const pictures = [
      'https://image.flaticon.com/icons/svg/1046/1046835.svg',
      'https://image.flaticon.com/icons/svg/1046/1046820.svg',
      'https://image.flaticon.com/icons/svg/1046/1046843.svg',
      'https://image.flaticon.com/icons/svg/1046/1046823.svg',
      'https://image.flaticon.com/icons/svg/1046/1046836.svg',
      'https://image.flaticon.com/icons/svg/1046/1046828.svg',
      'https://image.flaticon.com/icons/svg/1046/1046825.svg',
      'https://image.flaticon.com/icons/svg/1046/1046815.svg',
      'https://image.flaticon.com/icons/svg/1046/1046810.svg'
    ];
    return pictures[this.index % pictures.length];
  }

}
