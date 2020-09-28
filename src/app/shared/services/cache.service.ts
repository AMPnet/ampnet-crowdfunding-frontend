import { Injectable } from '@angular/core';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import Timer = NodeJS.Timer;

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    private cachedObservables: Map<string, Observable<any>> = new Map();
    private cacheTimeouts: Map<string, Timer> = new Map();

    constructor() {
    }

    setAndGet<T>(key: string, object: Observable<T>, timeout?: number): Observable<T> {
        const self = this;
        if (!this.cachedObservables.has(key)) {
            this.cachedObservables.set(key, object.pipe(
                shareReplay({bufferSize: 1, refCount: true}),
                catchError(err => {
                    self.cachedObservables.delete(key);
                    self.cacheTimeouts.delete(key);
                    return throwError(err);
                })).pipe(catchError(() => EMPTY))
            );

            if (timeout) {
                const timeoutRef = setTimeout(function () {
                    self.clear(key);
                }, timeout);
                self.cacheTimeouts.set(key, timeoutRef);
            }
        }

        return this.cachedObservables.get(key);
    }

    update(key: string, object: Observable<any>) {
        this.cachedObservables.set(key, object);
    }

    clear(key: string) {
        this.cachedObservables.delete(key);
        clearTimeout(this.cacheTimeouts.get(key));
        this.cacheTimeouts.delete(key);
    }

    clearAll() {
        this.cachedObservables.clear();
        this.cacheTimeouts.forEach((value) => clearTimeout(value));
        this.cacheTimeouts.clear();
    }
}
