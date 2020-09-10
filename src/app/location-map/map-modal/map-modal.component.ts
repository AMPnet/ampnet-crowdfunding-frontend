import { Component, OnInit, AfterViewInit, Input, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

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
