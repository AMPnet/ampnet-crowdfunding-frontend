import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../user-status-storage';
import { tap } from 'rxjs/operators';
import { UserModel } from '../models/user-model';
import { TokenModel } from '../models/auth/TokenModel';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private endpoint = '/user/me';

    constructor(private http: HttpClient) {
    }

    public getOwnProfile() {
        return this.http.get<UserModel>(API.generateRoute(this.endpoint), API.tokenHeaders())
            .pipe(
                tap(res => {
                    UserStatusStorage.personalData = res;
                }));
    }

    refreshUserToken() {
        return this.http.post<TokenModel>(API.generateRoute('/user/token/refresh'),
            {'refresh_token': localStorage.getItem('refresh_token')}, API.tokenHeaders())
            .pipe(
                tap(data => {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                }));
    }
}
