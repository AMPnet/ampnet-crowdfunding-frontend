import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class ManageProjectsService {

  private endpoint = '/countries';
  private linkEndpoint = "/link_api/preview";

  constructor(
    private http: HttpClient) { }
  
    getLinkPreview(url: string) {
        return this.http.get(API.generateRoute(this.linkEndpoint), {
            params: {
                "url": url
            }
        });
    }
}
