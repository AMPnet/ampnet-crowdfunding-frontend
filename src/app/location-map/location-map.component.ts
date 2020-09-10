import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import leaflet from 'leaflet';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent implements AfterViewInit {
    @Output() getMapCoords = new EventEmitter();
    @Input() movableMarker: boolean;
    @Input() coordsSet = [];
    map;
    startingLocation = [37.97404469468311, 23.71933726268805];
    mapMarker;
    constructor() {}

    ngAfterViewInit() {
        this.initMap();
        setTimeout( () => {
            this.map.invalidateSize();
        }, 10);
       /*  this.map.invalidateSize(); */
    }

    private initMap() {
        leaflet.Icon.Default.prototype.options.shadowUrl = 'leaflet/marker-shadow.png';
        this.map = leaflet.map('map').setView(this.startingLocation, 12);
        this.mapMarker = leaflet.marker(this.startingLocation).addTo(this.map);
        if (!(this.coordsSet.length === 0)) {
            this.map.removeLayer(this.mapMarker);
            this.map.setView(this.coordsSet, 12);
            this.mapMarker = leaflet.marker(this.coordsSet).addTo(this.map);
        } else {
            this.getMapCoords.emit(this.startingLocation);
        }
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        if (this.movableMarker) {
            this.editMapCoords();
        }
    }

    editMapCoords() {
        this.map.on('click', e => {
            if (this.mapMarker) {
                this.map.removeLayer(this.mapMarker);
            }
        this.getMapCoords.emit([e.latlng.lat, e.latlng.lng]);
        this.mapMarker = leaflet.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
        });
    }
}
