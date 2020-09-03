import { Injectable } from '@angular/core';
import leaflet from 'leaflet';

@Injectable({
    providedIn: 'root'
})
export class LocationMapService {
    map;
    mapMarker;
    mapLat: number;
    mapLong: number;
    markerIcon = leaflet.icon({
        iconUrl: 'marker-icon.png',
        shadowUrl: '',
    })

    constructor() {}

    getMap(map) {
        this.map = map;
        console.log(this.map)
    }

    getMapCords(mapLat: number, mapLong: number) {
        this.mapLat = mapLat;
        this.mapLong = mapLong;
    }

    getMapPreview(projectLat: number, projectLong: number) {
        this.map.setView([projectLat, projectLong, 12]);
        this.mapMarker = leaflet.marker([projectLat, projectLong], {
            icon: this.markerIcon
        }).addTo(this.map);
    }

    getMapViewOnEdit(projectLat: number, projectLong: number) {
        this.getMapPreview(projectLat, projectLong);
        this.editMapCords();
    }

    editMapCords() {
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
