import { Component, OnInit } from '@angular/core';
import { LocationMapService } from '../shared/services/location-map.service';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent implements OnInit {

  constructor(private mapService: LocationMapService) {}

  ngOnInit() {
    this.mapService.getMap();
  }
}
