import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    constructor(private http: HttpClient) {
    }

    get<T>(path: string, params?: object): Observable<T> {
        const httpOptions = this.setHttpOptions();
        if (params !== undefined) {
            httpOptions['params'] = params;
        }

        return this.http.get<T>(path, httpOptions);
    }

    post<T>(path: string, body: object): Observable<T> {
        return this.http.post<T>(path, body, this.setHttpOptions());
    }

    put<T>(path: string, body: object): Observable<T> {
        return this.http.put<T>(path, body, this.setHttpOptions());
    }

    delete<T>(path: string, params?: object): Observable<T> {
        const httpOptions = this.setHttpOptions();
        if (params !== undefined) {
            httpOptions['params'] = params;
        }

        return this.http.delete<T>(path, httpOptions);
    }

    setHttpOptions() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        const accessToken = localStorage.getItem('access_token');
        if (accessToken !== null) {
            httpOptions.headers = httpOptions
                .headers.append('Authorization', `Bearer ${accessToken}`);
        }

        return httpOptions;
    }
}
