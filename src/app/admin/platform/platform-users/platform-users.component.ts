import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-platform-users',
  templateUrl: './platform-users.component.html',
  styleUrls: ['./platform-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlatformUsersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
