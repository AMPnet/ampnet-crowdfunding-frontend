import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class NewsPreviewService {
    constructor(private http: BackendApiService) {
    }

    getLinkPreview(url: string) {
        return this.http.get('/api/link/preview', {url: url});
    }
}
