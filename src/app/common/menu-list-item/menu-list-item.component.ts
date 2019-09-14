import {Component, Input, OnInit} from '@angular/core';
import {Constants} from '../../_helpers/constants';
import {FileUploaderService} from '../../file-uploader.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.less']
})
export class MenuListItemComponent implements OnInit {

  @Input()  public menu: any;
  @Input()  public isSelected: boolean;

  imageContainer = Constants.imageContainer;

  constructor(
    public fileUploaderService: FileUploaderService
  ) { }

  ngOnInit() {
  }
}
