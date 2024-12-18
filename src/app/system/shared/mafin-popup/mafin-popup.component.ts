import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-mafin-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mafin-popup.component.html',
  styleUrl: './mafin-popup.component.scss'
})
export class MafinPopupComponent {
  @Input() isOpen = false;  // Управление открытием/закрытием
  @Output() close = new EventEmitter<void>();  // Событие для закрытия попапа

  closePopup() {
    this.isOpen = false;  // Закрываем попап
    this.close.emit();  // Отправляем событие о закрытии
  }
}
