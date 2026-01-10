import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-popup',
  imports: [FormsModule],
  templateUrl: './input-popup.html',
  styleUrl: './input-popup.css',
})
export class InputPopup {
  @Input() show = false;
  @Output() closed = new EventEmitter<string | null>();

  value = '';

  confirm() {
    this.closed.emit(this.value); // return value
    this.reset();
  }

  cancel() {
    this.closed.emit(null); // cancel
    this.reset();
  }

  private reset() {
    this.value = '';
    this.show = false;
  }
}
