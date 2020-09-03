import { Component, OnInit } from '@angular/core';
import leaflet from 'leaflet'
import { Project } from '../shared/services/project/project.service';
import { LocationMapService } from '../shared/services/location-map.service';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent implements OnInit {
  project: Project;
  private map;

  constructor(private mapService: LocationMapService){}

  ngOnInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = leaflet.map('map').setView([37.97404469468311, 23.71933726268805], 12);
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.mapService.getMap(this.map);
    this.mapService.editMapCords();
  }
}
