import { Component } from '@angular/core';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorComponent } from "../../components/list/paginator/paginator.component";


@Component({
  selector: 'app-sicknotes',
  standalone: true,
  imports: [MatDividerModule, MatFormFieldModule, MatInputModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, PaginatorComponent],
  templateUrl: './sicknotes.component.html',
  styleUrl: './sicknotes.component.scss'
})
export class SicknotesComponent {

}
