import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class RequestService {
  host: string;

  constructor(private http: HttpClient) {
    this.host = environment.host;
  }

  get(url: string, options = {}) {
    return this.http.get(this.host + url, options);
  }

  post(url: string, data = {}, options = {}) {
    return this.http.post(this.host + url, data, options);
  }

  put(url: string, data = {}, options = {}) {
    return this.http.put(this.host + url, data, options);
  }
}
