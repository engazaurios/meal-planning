import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RequestService {
  host: string;

  constructor(private http: HttpClient) {
    this.host = 'http://localhost:3000/api';
  }

  get(url: string, options = {}) {
    return this.http.get(this.host + url, options);
  }

  post(url: string, data = {}, options = {}) {
    return this.http.post(this.host + url, data, options);
  }
}