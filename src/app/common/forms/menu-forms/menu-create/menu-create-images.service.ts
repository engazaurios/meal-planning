import {Injectable} from '@angular/core';
import {RequestService} from '../../../../_services/request.service';
import {Subject} from 'rxjs';

@Injectable({ providedIn : 'root'})
export class MenuCreateImagesService {

  loading = false;
  imagesDataChanged = new Subject<any>();

  constructor(
    protected requestService: RequestService
  ) {}

  getApiServer() {
    return this.requestService.host;
  }

  getImagesFromContainer(containerName: string) {
    this.loading = true;
    this.requestService.get(`/attachments/${containerName}/files`).subscribe((response) => {
      this.loading = false;
      this.imagesDataChanged.next(response);
    });
  }

}
