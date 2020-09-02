import { Injectable } from '@angular/core';
import { ProjectService } from './project/project.service';
import { ActivatedRoute } from '@angular/router';
import leaflet from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LocationMapService {
  map;
  mapMarker;
  mapLat: number;
  mapLong: number;

  constructor(private projectService: ProjectService,
              private route: ActivatedRoute,) { }

  getMap(map) {
    this.map = map;
  }

  getMapCords(mapLat: number, mapLong: number) {
    this.mapLat = mapLat;
    this.mapLong = mapLong;
  }

  getMapPreview(projectLat: number, projectLong: number) {
    this.map.setView([projectLat, projectLong, 12]);
    this.mapMarker = leaflet.marker([projectLat, projectLong]).addTo(this.map);
  } 

  getMapViewOnEdit(projectLat: number, projectLong: number) {
    this.getMapPreview(projectLat, projectLong)
    this.editMapCords();
  }

  editMapCords() {
    this.map.on('click', e => {
      if (this.mapMarker) {
          this.map.removeLayer(this.mapMarker);
      }
      this.mapMarker = leaflet.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
      this.mapLat = e.latlng.lat;
      this.mapLong = e.latlng.lng;
      });
    }
}
