import { HttpClient } from "@angular/common/http";
import { API } from "../utilities/endpoint-manager";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private endpoint = "/me";

    constructor(private http: HttpClient) {}

    public getOwnProfile() {
        return this.http.get(API.generateRoute(this.endpoint), API.tokenHeaders())
    }

}