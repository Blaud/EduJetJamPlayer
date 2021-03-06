import { Injectable, PipeTransform, ApplicationRef } from '@angular/core';

import {
  DatePipe,
  CurrencyPipe,
  DecimalPipe,
  PercentPipe,
} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DynamicLocaleService {
  constructor() {}

  setLocale(lang: string): void {
    // TODO: change locale without reload.
    localStorage.setItem('locale', lang);
    window.location.reload();
  }
}
