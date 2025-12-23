import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-lan-toggle',
  imports: [CommonModule],
  templateUrl: './lan-toggle.html',
  styleUrl: './lan-toggle.scss',
})
export class LanToggle implements OnInit {
  isEnglish = true;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.isEnglish = this.translationService.getCurrentLang() === 'en';
  }

  toggleLanguage(): void {
    this.translationService.toggleLanguage();
    this.isEnglish = !this.isEnglish;
  }
}
