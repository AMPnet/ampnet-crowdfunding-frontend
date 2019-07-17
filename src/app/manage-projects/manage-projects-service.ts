import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class ManageProjectsService {

  private endpoint = '/countries';

  constructor(
    private http: HttpClient) { }
  

}
