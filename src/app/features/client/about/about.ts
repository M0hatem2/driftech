import { Component } from '@angular/core';
import { AboutHeader } from "./components/about-header/about-header";
import { OurMission } from "./components/our-mission/our-mission";
import { HereToHelp } from "../../../shared/here-to-help/here-to-help";
 
@Component({
  selector: 'app-about',
  imports: [AboutHeader, OurMission, HereToHelp],
  templateUrl: "./about.html",

 
})
export class About {

}