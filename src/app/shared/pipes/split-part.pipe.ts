import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitPart'
})
export class SplitPartPipe implements PipeTransform {
    transform(value: string, ...args: [partIndex?: any, splitBy?: string]): string {
        const [index, splitBy] = [Number(args[0]), args[1] || '|'];
        const shouldJoinAll = index !== args[0];

        const parts = value.split(splitBy)
            .map(part => part.trim());

        if (shouldJoinAll) {
            return parts.join(' ');
        }

        return parts[index] || '';
    }
}
