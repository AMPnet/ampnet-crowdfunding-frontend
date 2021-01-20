import { Injectable } from '@angular/core';
import { BackendHttpClient } from './backend-http-client.service';

@Injectable({
    providedIn: 'root'
})
export class NewsPreviewService {
    constructor(private http: BackendHttpClient) {
    }

    getLinkPreview(url: string) {
        return this.http.get<LinkPreview>('/api/link/preview', {url: url});
    }
}

export interface LinkPreview {
    open_graph: {
        title: string;
        description: string;
        image: {
            url: string;
            height: string;
            width: string;
        };
    };
    url: string;
}
