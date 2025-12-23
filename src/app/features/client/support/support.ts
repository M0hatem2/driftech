import { Component } from '@angular/core';
import { SupportHeader } from './components/support-header/support-header';
import { SupportContent } from './components/support-content/support-content';

@Component({
  selector: 'app-support',
  imports: [SupportHeader, SupportContent],
  templateUrl: './support.html',
  styleUrls: ['./support.scss'],
})
export class Support {}
