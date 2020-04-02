import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

declare var H: any;

@Component({
  selector: 'here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.css']
})
export class HereMapComponent implements OnInit {

  @ViewChild("map")
  public mapElement: ElementRef;

  @Input()
  public lat: string;

  @Input()
  public lng: string;

  @Input()
  public width: any;

  @Input()
  public height: any;

  @Input()
  public isForEditing: string;

  public constructor() { }

  public ngOnInit() {

  }

  private currentMarker: any;

  public ngAfterViewInit() {
    let platform = new H.service.Platform({
      "app_id": "hLqmOCs9lxzF2dIZY7uq",
      "app_code": "HryzJmUzRz05laLO_c71sA"
    });
    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
      tileSize: pixelRatio === 1 ? 256 : 512,
      ppi: pixelRatio === 1 ? undefined : 320
    });

    var map = new H.Map(this.mapElement.nativeElement,
      defaultLayers.normal.map, { pixelRatio: pixelRatio });

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    var ui = H.ui.UI.createDefault(map, defaultLayers);

    var svgMarkup = `<svg width="50" height="45" viewBox="0 0 50 45" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.0649 21.8264C6.64547 12.0223 13.7367 0 24.939 0V0C36.169 0 43.2574 12.0761 37.7826 21.8813L24.8744 45L12.0649 21.8264Z" fill="#E96F68"/>
    <ellipse cx="25.1255" cy="13.6286" rx="3.76884" ry="3.85714" fill="white"/>
    </svg>`;

    map.setCenter({ lat: parseFloat(this.lat), lng: parseFloat(this.lng) });
    map.setZoom(3);

    let shouldEdit = (this.isForEditing == "true")

    if(!shouldEdit) {
      var icon = new H.map.Icon(svgMarkup);
      this.setCurrentMarker(icon, map)
    }

    if (shouldEdit) {
        map.addEventListener('tap', function (evt) {
        var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
        var coords = { lat: coord.lat, lng: coord.lng };
        if (this.currentMarker != undefined) {
          map.removeObject(this.currentMarker);
        }
        this.currentMarker = new H.map.Marker(coords, { icon: icon });
        map.addObject(this.currentMarker);
      });
    } 
  }

  setCurrentMarker(icon: any, map: any) {
    var lat = parseFloat(this.lat)
    var lng = parseFloat(this.lng)
    let coords = { lat: lat, lng: lng };
    this.currentMarker = new H.map.Marker(coords, { icon: icon });
    setTimeout(() => {
      map.addObject(this.currentMarker);
    }, 500);
  }


}