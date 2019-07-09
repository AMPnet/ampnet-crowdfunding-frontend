import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private endpoint = '/tx_broadcast';

  constructor(
    private http: HttpClient) { }
  
  broadcastSignedTx(signed: string, id: number) {
      var apiHeaders = API.tokenHeaders();
      return this.http.post(API.generateRoute(this.endpoint), { }, {
          headers: {
              "Authorization" : apiHeaders.headers.Authorization
          },
          params: {
              "tx_sig" : signed,
              "tx_id" : id.toString()
          }
      });  
  }  
}
