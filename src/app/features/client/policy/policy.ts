import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-policy',
  imports: [CommonModule, TranslateModule],
  templateUrl: './policy.html',
  styleUrls: ['./policy.scss'],
})
export class Policy {
  currentDate = new Date();
}
