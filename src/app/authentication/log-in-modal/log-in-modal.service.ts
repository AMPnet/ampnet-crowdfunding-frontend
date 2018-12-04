import { Injectable } from '@angular/core';
import { API } from '../../utilities/endpoint-manager';
import { HttpClient } from '@angular/common/http';
import { TokenModel } from 'src/app/models/auth/TokenModel';


@Injectable({
  providedIn: 'root'
})
export class LogInModalService {

  private endpoint = '/token'

  constructor(private http: HttpClient) { }

  performEmailLogin(
    email: string,
    password: string
  ) {
    return this.http.post<TokenModel>(API.generateRoute(this.endpoint), {
      'login_method': 'EMAIL',
      'credentials': {
        'email' : email,
        'password' : password
      }
    });
  }
}
