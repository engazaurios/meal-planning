import { Injectable } from '@angular/core';
import { RequestService } from '../_services/request.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportingServie {
  constructor(private request: RequestService) {}

  downloadReport(filters: Object): Observable<Blob> {
    return <Observable<Blob>>this.request.get('/get-report', {
      responseType: 'blob',
      params: filters
    });
  }
}