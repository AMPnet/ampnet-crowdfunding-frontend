import { animate, style, transition, trigger } from '@angular/animations';

export const enterTrigger = trigger('enterTrigger', [
    transition(':enter', [
        style({opacity: 0}),
        animate('100ms', style({opacity: 1})),
    ]),
]);
