import { Component } from '@angular/core';
import { ContactUsHeader } from './components/contact-us-header/contact-us-header';
import { GetInTouch } from './components/get-in-touch/get-in-touch';

@Component({
  selector: 'app-contact-us',
  imports: [ContactUsHeader,GetInTouch],
  templateUrl: './Contact.html',
})
export class ContactUs {}
