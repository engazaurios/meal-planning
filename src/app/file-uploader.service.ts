import { Injectable } from '@angular/core';
import { RequestService } from './_services/request.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {
  downloadUrl: string;

  constructor(private request: RequestService) {
    this.downloadUrl = request.host + '/Attachments/users/download/';
  }

  uploadFile(file: File) {
    const formData = new FormData();

    formData.append('file', file);

    return this.request.post('/Attachments/users/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getImages(containerName: string) {
    return this.request.get(`/attachments/${containerName}/files`);
  }

  public getImage(containerName: string, imageName: string) {
    return `${this.request.host}/attachments/${containerName}/download/${imageName}`;
  }
}
