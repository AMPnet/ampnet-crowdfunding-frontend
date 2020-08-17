import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { Injectable } from '@angular/core';
import { UserStatusStorage } from '../user-status-storage';
import { tap } from 'rxjs/operators';
import { UserModel } from '../models/user-model';

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
}
