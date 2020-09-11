import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import leaflet from 'leaflet';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent implements AfterViewInit {
    @Input() lat: number;
    @Input() lng: number;
    @Output() latChange = new EventEmitter<number>();
    @Output() lngChange = new EventEmitter<number>();
    @Input() editable: boolean;

    @ViewChild('mapEl') mapEl;

    map: leaflet.Map;
    latLngDefault: leaflet.LatLngTuple = [37.97404469468311, 23.71933726268805];
    mapMarker: leaflet.Marker;
    icon: leaflet.Icon.Default;

    constructor() {
        this.icon = new leaflet.Icon.Default({
            iconUrl: 'assets/leaflet/marker-icon.png',
            shadowUrl: 'assets/leaflet/marker-shadow.png'
        });
    }

    ngAfterViewInit() {
        this.map = leaflet.map(this.mapEl.nativeElement);

        if (this.lat === undefined || this.lng === undefined) {
            this.lat = this.latLngDefault[0];
            this.lng = this.latLngDefault[1];
        }

        const latLng: leaflet.LatLngTuple = [this.lat, this.lng];
        this.map.setView(latLng, 12);
        this.mapMarker = this.newMarker(latLng).addTo(this.map);
        this.map.addLayer(leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }));

        if (this.editable) {
            this.enableMapEdit();
        }
    }

    private enableMapEdit() {
        this.map.on('click', function (e: leaflet.LeafletMouseEvent) {
            if (this.mapMarker) {
                this.map.removeLayer(this.mapMarker);
            }

            this.lat = e.latlng.lat;
            this.lng = e.latlng.lng;
            this.latChange.next(this.lat);
            this.lngChange.next(this.lng);

            this.mapMarker = this.newMarker(e.latlng).addTo(this.map);
        }.bind(this));
    }

    private newMarker(latLng: leaflet.LatLngTuple) {
        return leaflet.marker(latLng, {icon: this.icon});
    }
}
