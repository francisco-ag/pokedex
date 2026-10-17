import { Component } from '@angular/core';
import { PokemonComponent } from './components/pokemon/pokemon';
import { MusicaComponent } from './components/musica/musica';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PokemonComponent, MusicaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  vistaActual: 'pokemon' | 'musica' = 'pokemon';

  cambiarVista(vista: 'pokemon' | 'musica'): void {
    this.vistaActual = vista;
  }
}
