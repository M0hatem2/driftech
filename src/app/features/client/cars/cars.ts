import { Component } from '@angular/core';

@Component({
  selector: 'app-cars',
  imports: [],
  template: `
    <div class="cars">
      <h1>Our Cars</h1>
      <p>Browse our selection of quality vehicles.</p>
    </div>
  `,
  styles: [`
    .cars {
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class Cars {

}