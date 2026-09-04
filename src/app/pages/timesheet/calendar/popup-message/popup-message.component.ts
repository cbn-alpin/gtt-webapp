import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-message',
  standalone: true,
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
  imports: [MatDialogModule],
})
export class PopupMessageComponent {
  readonly data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);
}
