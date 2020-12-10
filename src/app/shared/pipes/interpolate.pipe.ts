import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'interpolate'
})
export class InterpolatePipe implements PipeTransform {
    transform(value: string, ...args: [key: string, replaceValue: string][]): string {
        let newValue = value;

        args.forEach(pair => {
            const [key, replaceValue] = pair;
            const replaceRegex = new RegExp(`(\{\{\ *${key}\ *\}\})`);

            const keyMatches = newValue.match(replaceRegex);

            if (keyMatches !== null) {
                keyMatches.forEach(() => {
                    newValue = newValue.replace(replaceRegex, replaceValue);
                });
            }
        });

        return newValue;
    }
}
