import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-popup',
  imports: [FormsModule],
  templateUrl: './input-popup.html',
})
export class InputPopup {
  @Input() show = false;
  @Output() closed = new EventEmitter<string | null>();

  value = '';

  confirm() {
    this.closed.emit(this.value);
    this.value = '';
  }

  cancel() {
    this.closed.emit(null);
    this.value = '';
  }
}
