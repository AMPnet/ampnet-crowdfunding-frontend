import { HttpClient } from "@angular/common/http";
import { API } from "../utilities/endpoint-manager";
import { Injectable } from "@angular/core";
import { UserModel } from "../models/user-model";
import { UserStatusStorage } from "../user-status-storage";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private endpoint = "/user/me";

    constructor(private http: HttpClient) {}

    public getOwnProfile() {
        let userResponse = this.http.get(API.generateRoute(this.endpoint), API.tokenHeaders())
        userResponse.subscribe((res: UserModel) => {
            UserStatusStorage.personalData = res
        })
        return userResponse
    }

}