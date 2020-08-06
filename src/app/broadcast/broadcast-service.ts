import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {

  private endpoint = '/wallet/tx_broadcast';

  constructor(
    private http: HttpClient) {
  }

  broadcastSignedTx(signed: string, id: number) {
    const apiHeaders = API.tokenHeaders();
    return this.http.post(API.generateRoute(this.endpoint), {
      'tx_sig': signed,
      'tx_id': id.toString()
    }, {
      headers: {
        'Authorization': apiHeaders.headers.Authorization
      },


    });
  }
}
