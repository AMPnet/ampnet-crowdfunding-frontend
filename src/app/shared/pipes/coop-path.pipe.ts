import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from '../services/app-config.service';

@Pipe({
    name: 'coopPath'
})
export class CoopPathPipe implements PipeTransform {
    constructor(private appConfig: AppConfigService) {
    }

    public transform(value: any): any {
        let path: string;
        if (value === null || value === undefined) {
            return '';
        }

        path = Array.isArray(value) ? value.join('/') : String(value);

        if (path.startsWith('/')) {
            const identifier = this.appConfig.config.identifier;

            if (identifier) {
                path = `/${identifier}${path}`;
            }
        }

        return path;
    }
}
