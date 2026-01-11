import { Component, Input, Output, EventEmitter, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-popup',
  imports: [FormsModule],
  templateUrl: './input-popup.html',
})
export class InputPopup {
  show = input<boolean>(false);
  closed = output<string | null>();
  text = signal('');

  confirm() {
    this.closed.emit(this.text());
    this.text.set('');
  }

  cancel() {
    this.closed.emit(null);
    this.text.set('');
  }
}
