import { Component, Input } from '@angular/core';
import { Sicknotes } from '../../../interfaces/sicknotes';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-list-item',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {
  @Input() sicknotes!: Sicknotes;
  menuOpen: boolean = false;

  openMenu($event: Event) {
    this.menuOpen = !this.menuOpen;
  }
}
