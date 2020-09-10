import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.css'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
    @Input() projectCoords = [];

    constructor(bsModalRef: BsModalRef) { }

    ngOnInit() {}

    ngAfterViewInit() {
    }
}
