import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD

=======
import { HeaderComponent } from "./components/header/header.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
>>>>>>> 49d414c9943ea931e13253d18937bb9e2f62ef45

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet],
=======
  imports: [RouterOutlet, HeaderComponent, NavbarComponent],
>>>>>>> 49d414c9943ea931e13253d18937bb9e2f62ef45
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sonda';
}
