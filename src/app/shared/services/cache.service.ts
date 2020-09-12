import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { multicast, publishReplay, refCount, shareReplay } from 'rxjs/operators';
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
        if (!this.cachedObservables.has(key)) {
            this.cachedObservables.set(key, object.pipe(shareReplay({bufferSize: 1, refCount: true})));

            if (timeout) {
                const timeoutRef = setTimeout(function () {
                    this.clear(key);
                }.bind(this), timeout);
                this.cacheTimeouts.set(key, timeoutRef);
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
