import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TranslationService } from './core/services/translation.service';
import { LoaderService } from './core/services/loader.service';
import { Preloader } from './shared/components/preloader/preloader';
import { ChatBotComponent } from "./shared/chat-bot/chat-bot.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TranslateModule, Preloader, ChatBotComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'driftech';
  isLoading = true;
  isHttpLoading = false;
  private loaderSubscription: Subscription = new Subscription();

  constructor(
    private translationService: TranslationService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    // Initial setup if needed
    this.loaderSubscription = this.loaderService.loading$.subscribe((loading) => {
      this.isHttpLoading = loading;
    });
  }

  ngAfterViewInit(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.isLoading = false;
      }, 500); // Small delay for smooth transition
    });
  }

  ngOnDestroy(): void {
    this.loaderSubscription.unsubscribe();
  }

  get currentLang(): string {
    return this.translationService.getCurrentLang();
  }

  setLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
  }
}
