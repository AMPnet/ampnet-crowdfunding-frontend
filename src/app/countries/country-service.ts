import { Http } from "@angular/http";
import { CountryModel } from "../models/countries/CountryModel";
import { Observable } from "rxjs";

export class CountryService {

    private url='http://demo.ampnet.io:8123';
    private endpoint = "country";

    constructor(
        protected httpClient: Http
    ) { }

    public getAllCountries(): Observable<CountryModel> {

    }
}