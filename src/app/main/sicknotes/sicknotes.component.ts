import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { SicknotesService } from '../../services/sicknotes.service';
import { Sicknotes } from '../../interfaces/sicknotes';
import { ListItemComponent } from "../../components/list/list-item/list-item.component";
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-sicknotes',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatListModule, ListItemComponent, MatMenuModule],
  templateUrl: './sicknotes.component.html',
  styleUrl: './sicknotes.component.scss'
})
export class SicknotesComponent {
  sicknotes: Sicknotes[] = [];
  selectedFilter: string = 'Mais recentes';
  constructor(private sickService: SicknotesService) { }

  ngOnInit(): void {
    this.sickService.getSicknotes().subscribe(
      (res) => {
        this.sicknotes = res;
        console.log(this.sicknotes);
      }
    );
  }
}
