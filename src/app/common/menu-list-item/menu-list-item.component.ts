import {Component, Input, OnInit} from '@angular/core';
import {MenuCreateImagesService} from '../forms/menu-forms/menu-create/menu-create-images.service';
import {Constants} from '../../_helpers/constants';

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

  imageContainer = Constants.imageContainer;

  constructor(
    private menuImages: MenuCreateImagesService
  ) { }

  ngOnInit() {
  }
}
