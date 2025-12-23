import { Component } from '@angular/core';
import { ContactUsCards } from "../contact-us-cards/contact-us-cards";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us',
  imports: [ContactUsCards, TranslateModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.scss',
})
export class ContactUs {

}
