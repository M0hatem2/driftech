import { Component, OnInit } from '@angular/core';
import { TrustedPartnersCards } from '../../../../../shared/trusted-partners-cards/trusted-partners-cards';
import { TrustedPartner } from '../../../../../shared/models/trusted-partner.interface';
import { TranslateModule } from '@ngx-translate/core';
import { scrollFadeUp } from '../../../../../shared/animations/scroll.animations';
import { AnimateOnScrollDirective } from '../../../../../shared/directives/animate-on-scroll.directive';

@Component({
  selector: 'app-trusted-partners',
  imports: [TrustedPartnersCards, TranslateModule, AnimateOnScrollDirective],
  templateUrl: './trusted-partners.html',
  styleUrl: './trusted-partners.scss',
  animations: [scrollFadeUp],
})
export class TrustedPartners implements OnInit {
  partners: TrustedPartner[] = [
    {
      id: '1',
      name: 'Aman',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/i9PDQ3D9jJcFaKBG5r6mi4gsM8QwN3Xw7feYOQDq.jpg',
      alt: 'Aman',
    },
    {
      id: '2',
      name: 'EG Bank',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/hsfkcHWMOGEevpaR82VazoYgMWGfDTWchzb0eyJ6.jpg',
      alt: 'EG Bank',
    },
    {
      id: '3',
      name: 'Drive',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/WmVGoHxUyIVpepjuaxL2mQgdzPUspQ7qucjbqQWo.jpg',
      alt: 'Drive',
    },
    {
      id: '4',
      name: 'ADIB',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/UKxb9aKSDxm8lvtebhOjcPSkIB5YPNSUWMMdqauH.jpg',
      alt: 'ADIB',
    },
    {
      id: '5',
      name: 'ABK',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/0Nb2kSk3nwRO5Q1TOp25LSmYoWvt5j2CEjDMRQm1.jpg',
      alt: 'ABK',
    },
    {
      id: '6',
      name: 'NXT Bank',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/3blF7JQrFQvenPAblCYLIk0qZdgtsYS7PpL8w0LS.jpg',
      alt: 'NXT Bank',
    },
    {
      id: '7',
      name: 'Rawaj',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/obZqdhFAhaHp40cS3TXwcGELwGQJe1LjOVO9d99j.jpg',
      alt: 'Rawaj',
    },
    {
      id: '8',
      name: 'Valu',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/ocxHzfqBCAs5mOA1MgxdkLQcl70ydwhPxV7UEoKz.jpg',
      alt: 'Valu',
    },
    {
      id: '9',
      name: 'NBK',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/5FL0fRvWrdLfgr4IL1GehT2fSZerHesiBqww3NOu.jpg',
      alt: 'NBK',
    },
    {
      id: '10',
      name: 'FAB',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/NKAm3Qff37zlau5sBy240ZJSCSgswqLGCL4MPxFA.jpg',
      alt: 'FAB',
    },
    {
      id: '11',
      name: 'Sohoula',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/sPDQdpK1OsAaYugbKfyWhvCmzhH3euNb2HtdO3HG.jpg',
      alt: 'Sohoula',
    },
    {
      id: '12',
      name: 'Saib',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/3Wjd2YPdjxbgv20wyBTlcP0hf59vZZ8aFW3X01p6.jpg',
      alt: 'Saib',
    },
    {
      id: '13',
      name: 'HD Bank',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/Cz06bY7vLE1iQ5F63iizZavbtu4MT9ZjdT4IR4Xr.jpg',
      alt: 'HDBank',
    },
    {
      id: '14',
      name: 'Souhoola',
      logoUrl:
        'https://driftech.tech/dashboard/public/storage/partners/pEYCXnhzUhfeD5DIwceoGqMj3IWlYMs54zZopQCO.jpg',
      alt: 'Souhoola',
    },
  ];
  animationState: 'hidden' | 'visible' = 'hidden';

  onAnimate(): void {
    this.animationState = 'visible';
  }

  constructor() {}

  ngOnInit() {
    // Static data is already assigned
  }
}
