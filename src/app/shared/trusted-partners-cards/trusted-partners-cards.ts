import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrustedPartner } from '../models/trusted-partner.interface';

@Component({
  selector: 'app-trusted-partners-cards',
  imports: [CommonModule],
  templateUrl: './trusted-partners-cards.html',
  styleUrl: './trusted-partners-cards.scss',
})
export class TrustedPartnersCards {
  @Input() partners: TrustedPartner[] = [];
  @Input() isDesktopLayout: boolean = false;

  getDesktopImageClass(index: number): string {
    // Define the desktop layout classes based on the original hardcoded HTML
    const desktopClasses = [
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:h-[271px] xl:w-[271px] xl:rounded-[27.1px]', // EG Bank
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:relative xl:top-[114px] xl:left-[34px] xl:h-[200px] xl:w-[200px] xl:rounded-[27.1px]', // Aman
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:relative xl:right-[-32px] xl:bottom-[48px] xl:h-[155px] xl:w-[155px] xl:place-self-end xl:rounded-[27.1px]', // Drive
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:h-[200px] xl:w-[200px] xl:place-self-end xl:rounded-[27.1px]', // ADIB
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:h-[271px] xl:w-[271px] xl:rounded-[27.1px]', // ABK
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:relative xl:top-[114px] xl:left-[34px] xl:h-[200px] xl:w-[200px] xl:rounded-[27.1px]', // NXT Bank
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:relative xl:right-[-32px] xl:bottom-[48px] xl:h-[155px] xl:w-[155px] xl:place-self-end xl:rounded-[27.1px]', // Rawaj
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:h-[200px] xl:w-[200px] xl:place-self-end xl:rounded-[27.1px]', // Valu
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:h-[271px] xl:w-[271px] xl:rounded-[27.1px]', // NBK
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:relative xl:top-[114px] xl:left-[34px] xl:h-[200px] xl:w-[200px] xl:rounded-[27.1px]', // FAB
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:relative xl:right-[-32px] xl:bottom-[48px] xl:h-[155px] xl:w-[155px] xl:place-self-end xl:rounded-[27.1px]', // Sohoula
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:h-[200px] xl:w-[200px] xl:place-self-end xl:rounded-[27.1px]', // Saib
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:h-[271px] xl:w-[271px] xl:rounded-[27.1px]', // بنك تنمية الصادرات
      'shadow-partner-image h-[75px] min-w-[75px] overflow-hidden rounded-full xl:relative xl:top-[114px] xl:left-[34px] xl:h-[200px] xl:w-[200px] xl:rounded-[27.1px]', // بنك الإسكان و التعمير
    ];

    return desktopClasses[index] || desktopClasses[0];
  }
}
