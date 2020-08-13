import { Injectable } from '@angular/core';
import { UserModel } from '../../../models/user-model';
import { UserStatusStorage } from '../../../user-status-storage';
import { BackendApiService } from '../backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: BackendApiService) {
    }

    public getOwnProfile() {
        const userResponse = this.http.get('/api/user/me');
        userResponse.subscribe((res: UserModel) => {
            UserStatusStorage.personalData = res;
        });
        return userResponse;
    }
}
