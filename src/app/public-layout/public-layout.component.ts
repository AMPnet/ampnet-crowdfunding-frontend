import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../authentication/auth.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.css']
})
export class PublicLayoutComponent implements OnInit {

  constructor(private router: Router) { 
    if(AuthGuard.checkLogin()) {
      router.navigate(['dash']);
    }
  }

  ngOnInit() {
  }

}
