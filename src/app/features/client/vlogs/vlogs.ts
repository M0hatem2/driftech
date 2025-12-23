import { Component } from '@angular/core';
import { VlogsHeader } from "./components/vlogs-header/vlogs-header";
import { OurVlogs } from "./components/our-vlogs/our-vlogs";

@Component({
  selector: 'app-vlogs',
  imports: [VlogsHeader, OurVlogs],
  templateUrl: './vlogs.html',
})
export class Vlogs {}
