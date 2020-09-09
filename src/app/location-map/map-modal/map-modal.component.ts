import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.css'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
    constructor() { }

    ngOnInit() {}

    ngAfterViewInit() {
        /* this.mapService.getMapPreview(this.projectLat, this.projectLong);
        setTimeout(() => {
        this.mapService.map.invalidateSize();
        }, 10); */
    }
}
