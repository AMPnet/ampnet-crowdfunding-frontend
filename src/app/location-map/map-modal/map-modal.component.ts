import { AfterViewInit, Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-map-modal',
    templateUrl: './map-modal.component.html',
    styleUrls: ['./map-modal.component.css'],
})
export class MapModalComponent implements AfterViewInit {
    modalShown = false;
    lat: number;
    lng: number;

    constructor(private bsModalRef: BsModalRef) {
    }

    ngAfterViewInit() {
        // Required for issue with showing leaflet map before
        // modal is completely rendered. https://stackoverflow.com/q/20400713/4636976
        this.modalShown = true;
    }

    closeModal() {
        this.bsModalRef.hide();
    }
}
