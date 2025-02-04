import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss']
})
export class PopupMessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }) {}

}
