import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MonthsRpmComponent } from './shared/months-rpm/months-rpm';
import { Preloader } from './shared/components/preloader/preloader';
import { LoadingService } from './core/services/loading.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MonthsRpmComponent, Preloader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(private router: Router){};
  protected readonly title = 'driftech';
  protected readonly loadingService = inject(LoadingService);
  ngOnInit() {
    

   
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // ترجع الصفحة لأعلى
      }
    });
  }
}
