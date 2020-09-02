import { Component, OnInit } from '@angular/core';
import leaflet from 'leaflet';
import { Project } from 'src/app/shared/services/project/project.service';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.css']
})
export class MapModalComponent implements OnInit {
  offerModel: Project;
  private map;
  mapMarker;
  mapLat: number;
  mapLong: number;
  mapFetched = false;

  constructor() { }

  ngOnInit() {
    this.fetchMap();
    console.log(this.offerModel)
  }

  fetchMap() {
    console.log(this.offerModel.location.lat);
    if (!this.mapFetched) {
        
        setTimeout(() => {
            this.map = leaflet.map('display-map').setView(
                [this.offerModel.location.lat, this.offerModel.location.long], 12);
            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            { attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
            this.mapMarker = leaflet.marker([this.offerModel.location.lat, this.offerModel.location.long]).addTo(this.map);
        }, 500);
        this.mapFetched = true;
    }
}

}
