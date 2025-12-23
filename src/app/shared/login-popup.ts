import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginPopupService {
  private showPopupSubject = new Subject<boolean>();
  showPopup$ = this.showPopupSubject.asObservable();

  showPopup() {
    this.showPopupSubject.next(true);
  }

  hidePopup() {
    this.showPopupSubject.next(false);
  }
}
