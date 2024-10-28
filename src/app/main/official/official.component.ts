import { Component, } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-official',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './official.component.html',
  styleUrl: './official.component.scss'
})
export class OfficialComponent {
  public innerWidth: any;

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }
}
