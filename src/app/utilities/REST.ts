import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Resource {
    id: number;
}

export interface RESTSerializer {
    fromJson(json: any): Resource;
    toJson(resource: Resource): any;
}

export class Country extends Resource {
    iso: string;
    name: string;
    nicename: string;
    iso3: string;
    numcode: number;
    phonecode: number;
}

class CountrySerializer implements RESTSerializer {
    
    fromJson(json: any): Resource  {

    }

    toJson() {

    }

}

export class ResourceService<T extends Resource> {

    private url: string;

    constructor(
        private httpClient: HttpClient,
        private endpoint: string,
        private serializer: RESTSerializer
    ) { 
        this.url = "demo.ampnet.io:8123";
    }

    public post(item: T): Observable<T> {
        return this.httpClient
            .post<T>(`${this.url}/${this.endpoint}`, this.serializer.toJson(item))
    }
    
    public get(id: number): Observable<T> {
        return this.httpClient
            .get<T>(`${this.url}/${this.endpoint}/${id}`)
    }
}

export class CountryService extends ResourceService<Country> {
    constructor(httpClient: HttpClient) {
        super(httpClient, "countries", new CountrySerializer())
    }
}