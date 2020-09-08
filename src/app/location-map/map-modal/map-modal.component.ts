import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LocationMapService } from 'src/app/shared/services/location-map.service';

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.css'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
    projectLat: number;
    projectLong: number;

    constructor(public bsModalRef: BsModalRef,
                private mapService: LocationMapService) { }

    ngOnInit() {}

    ngAfterViewInit() {
        /* this.mapService.getMapPreview(this.projectLat, this.projectLong);
        setTimeout(() => {
        this.mapService.map.invalidateSize();
        }, 10); */
    }
}
