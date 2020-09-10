import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.css'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
    @Input() projectCoords = [];
    @Input() rerenderMap;

    constructor(private bsModalRef: BsModalRef) { }

    ngOnInit() {}

    ngAfterViewInit() {}

    closeModal() {
        this.bsModalRef.hide();
    }

    getMap(e) {
        this.rerenderMap = e;
    }
}
