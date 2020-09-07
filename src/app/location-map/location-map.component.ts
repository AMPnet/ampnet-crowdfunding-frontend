import { Component, OnInit, AfterViewInit } from '@angular/core';
import leaflet from 'leaflet';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent implements OnInit, AfterViewInit {
    map;
    startingLocation = [37.97404469468311, 23.71933726268805];
    mapMarker;
    mapLat: number;
    mapLong: number;
    markerIcon = leaflet.icon({
        iconUrl: 'marker-icon.png',
        shadowUrl: '',
    })

    constructor() {}

    ngOnInit() {
        this.initMap();
    }

    ngAfterViewInit() {
    }

    private initMap() {
        this.map = leaflet.map('map').setView([this.startingLocation], 12);
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
    }

    editMapCoords(){
        this.map.on('click', e => {
            if (this.mapMarker) {
                this.map.removeLayer(this.mapMarker);
            }
        this.mapMarker = leaflet.marker([e.latlng.lat, e.latlng.lng], {
            icon: this.markerIcon
            }).addTo(this.map);
        this.mapLat = e.latlng.lat;
        this.mapLong = e.latlng.lng;
        });
    }

   

    
}
