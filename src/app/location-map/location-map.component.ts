import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import leaflet from 'leaflet';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent implements OnInit, AfterViewInit {
    map;
    startingLocation = [37.97404469468311, 23.71933726268805];
    @Input() mapCoords = [];
    mapMarker;
    mapLat: number;
    mapLong: number;
    markerIcon = leaflet.icon({
        iconUrl: 'marker-icon.png',
        shadowUrl: '',
    })

    constructor() {}

    ngOnInit() {
        
    }

    ngAfterViewInit() {
        this.initMap();
        /* setTimeout(() =>{
            this.map.invalidateSize();
        }, 10) */
        
    }

    private initMap() {
        this.map = leaflet.map('map').setView(this.startingLocation, 12);
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
        this.mapCoords = [e.latlng.lat, e.latlng.lng];
        console.log(this.mapCoords);
        this.mapMarker = leaflet.marker(this.mapCoords, {
            icon: this.markerIcon
        }).addTo(this.map);
        });
    }

   

    
}
