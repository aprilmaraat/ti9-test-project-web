import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends ApiService {

  constructor(_http: HttpClient) {
    super(_http);
    this.baseUrl += 'client';
  }
  
}
