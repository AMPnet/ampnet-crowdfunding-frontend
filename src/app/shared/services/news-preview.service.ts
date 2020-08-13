import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';

@Injectable({
    providedIn: 'root'
})
export class NewsPreviewService {

    private linkEndpoint = '/link/preview';

    constructor(private http: HttpClient) {
    }

    getLinkPreview(url: string) {
        return this.http.get(API.generateRoute(this.linkEndpoint), {
            params: {
                'url': url
            }
        });
    }
}
