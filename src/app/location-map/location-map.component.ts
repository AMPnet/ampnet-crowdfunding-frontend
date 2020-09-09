import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import leaflet from 'leaflet';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent implements OnInit, AfterViewInit {
    @Output() getMapCoords = new EventEmitter();
    @Input() movableMarker: boolean;
    @Input() coordsSet = [];
    map;
    startingLocation = [37.97404469468311, 23.71933726268805];
    mapMarker;
    /* markerIcon = leaflet.icon({
        iconRetinaUrl: 'marker-icon-2x.png',
        iconUrl: 'marker-icon.png',
        shadowUrl: 'marker-shadow.png',
    }) */

    constructor() {}

    ngOnInit() {
        
    }

    ngAfterViewInit() {
        this.initMap();
        setTimeout(() =>{
            this.map.invalidateSize();
        }, 10)
        console.log(this.coordsSet[0]);
    }

    private initMap() {
        this.map = leaflet.map('map');
        if ((this.coordsSet[0] != this.startingLocation[0]) && 
            (this.coordsSet[1] != this.startingLocation[1])) {
                this.map.setView(this.coordsSet, 12);
                this.mapMarker = leaflet.marker(this.coordsSet).addTo(this.map);
        } else {
            this.map.setView(this.startingLocation, 12);
            this.mapMarker = leaflet.marker(this.startingLocation).addTo(this.map);
        }
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        this.getMapCoords.emit(this.startingLocation);
        if (this.movableMarker) {
            this.editMapCoords();
        }
    }

    editMapCoords(){
        this.map.on('click', e => {
            if (this.mapMarker) {
                this.map.removeLayer(this.mapMarker);
            }
        this.getMapCoords.emit([e.latlng.lat, e.latlng.lng]);
        this.mapMarker = leaflet.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
        });
    }
}
