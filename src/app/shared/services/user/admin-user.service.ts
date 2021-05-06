import { Injectable } from '@angular/core';
import { User } from './signup.service';
import { BackendHttpClient } from '../backend-http-client.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminUserService {
    constructor(private http: BackendHttpClient) {
    }

    getUsers(size = 20, page = 0): Observable<AdminUserResponse> {
        return this.http.get('/api/user/admin/user/admin', {
            size, page
        });
    }
}

export interface AdminUserResponse {
    users: User[];
    page: number;
    total_pages: number;
}
