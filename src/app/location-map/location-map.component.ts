import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LocationMapService } from '../shared/services/location-map.service';
import leaflet from 'leaflet';

@Component({
    selector: 'app-location-map',
    templateUrl: './location-map.component.html',
    styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent implements OnInit, AfterViewInit {
    private map;

    constructor(private mapService: LocationMapService) {}

    private initMap() {
        this.map = leaflet.map('map').setView([37.97404469468311, 23.71933726268805], 12);
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
    }

    ngOnInit() {
        this.initMap();
        this.mapService.getMap(this.map);
    }

    ngAfterViewInit() {
    }
}
