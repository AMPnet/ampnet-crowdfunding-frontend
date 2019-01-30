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
  public lat: any;

  @Input()
  public lng: any;

  @Input()
  public width: any;

  @Input()
  public height: any;

  public constructor() { }

  public ngOnInit() { 

  }

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

    map.addEventListener('tap', function(evt) {
      var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      alert('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
      ((coord.lat > 0) ? 'N' : 'S') +
      ' ' + Math.abs(coord.lng.toFixed(4)) +
       ((coord.lng > 0) ? 'E' : 'W'));
    });
  }

}