import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
    @Input() type: 'inline' | 'overlay' = 'inline';
    @Input() color: 'black' | 'white' = 'black';

    constructor() {
    }
}
