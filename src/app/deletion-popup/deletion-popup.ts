import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deletion-popup',
  imports: [FormsModule],
  templateUrl: './deletion-popup.html',
})
export class DeletionPopup {
  deletionText = input<string>('');
  show = input<boolean>(false);
  closed = output<boolean>();

  confirm() {
    this.closed.emit(true);
  }

  cancel() {
    this.closed.emit(false);
  }
}
