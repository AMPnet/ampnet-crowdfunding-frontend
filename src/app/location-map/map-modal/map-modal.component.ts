import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.css'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
    rerenderMap = new Observable();

    constructor(private bsModalRef: BsModalRef) { }

    ngOnInit() {}

    ngAfterViewInit() {
    }
}
