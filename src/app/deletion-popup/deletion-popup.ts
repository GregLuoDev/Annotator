import { Component, Input, Output, EventEmitter, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deletion-popup',
  imports: [FormsModule],
  templateUrl: './deletion-popup.html',
})
export class DeletionPopup {
  @Input() deletionText = '';
  @Input() show = false;
  @Output() closed = new EventEmitter<boolean>();

  confirm() {
    this.closed.emit(true);
  }

  cancel() {
    this.closed.emit(false);
  }
}
