import { ElementRef } from '@angular/core';

declare var M;
// TODO: make i18n support for tost msgs
export interface MaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

export class MaterialService {
  static toast(message: string) {
    M.toast({ html: message });
  }
  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static initializeSelect(ref: ElementRef) {
    M.FormSelect.init(ref.nativeElement);
  }

  static updateTextInputs() {
    M.updateTextFields();
  }
  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }
}
