import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-new-proposal',
  templateUrl: './new-proposal.component.html',
  styleUrls: ['./new-proposal.component.css']
})
export class NewProposalComponent implements OnInit {

	customHolder: JQuery;
	templateHolder: JQuery;

	templateNav: JQuery;
	customNav: JQuery;

  constructor() { }

  ngOnInit() {
  	this.customHolder = $("#custom-holder");
  	this.templateHolder = $("#template-holder");
  	this.templateNav = $("#template-nav");
  	this.customNav = $("#custom-nav");

  	this.customHolder.hide();
  }

  tabToggle(position: number) {

  	var activeClass = "active";

  	if(position === 0) {
  		this.templateHolder.show(300);
  		this.customHolder.hide(300);

  		this.templateNav.addClass(activeClass);
  		this.customNav.removeClass(activeClass);
  	} else {
  		this.customHolder.show(300);
  		this.templateHolder.hide(300);

  		this.templateNav.removeClass(activeClass);
  		this.customNav.addClass(activeClass);
  	}
  }

}
