import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private endpoint = '/wallet/tx_broadcast';

  constructor(
    private http: HttpClient) { }
  
  broadcastSignedTx(signed: string, id: number) {
      var apiHeaders = API.tokenHeaders();
      alert("In function sig: " + signed)
      return this.http.post(API.generateRoute(this.endpoint), { }, {
          headers: {
              "Authorization" : apiHeaders.headers.Authorization
          },
          params: {
              "tx_sig" : encodeURIComponent(signed),
              "tx_id" : id.toString()
          }
      });  
  }  
}
