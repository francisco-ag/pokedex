
import { Component, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

import { PokemonComponent } from './components/pokemon/pokemon';
import { MusicaComponent } from './components/musica/musica';
import { ClimaComponent } from './components/clima/clima';

interface Vista {
  id: string;
  nombre: string;
  componente: Type<unknown>;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgComponentOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Registro central de las vistas disponibles.
  // Aquí añadiremos los futuros componentes.
  vistas: Vista[] = [
    {
      id: 'pokemon',
      nombre: 'POKÉDEX',
      componente: PokemonComponent
    },
    {
      id: 'musica',
      nombre: 'MÚSICA',
      componente: MusicaComponent
    },
    {
      id: 'clima',
      nombre: 'CLIMA',
      componente: ClimaComponent
    }
  ];

  vistaActual = 'pokemon';
  indiceSeleccionado = 0;
  menuAbierto = false;

  get vistaSeleccionada(): Vista {
    return this.vistas[this.indiceSeleccionado];
  }

  get componenteActual(): Type<unknown> {
    return this.vistas.find(
      vista => vista.id === this.vistaActual
    )!.componente;
  }

  get nombreVistaActual(): string {
    return this.vistas.find(
      vista => vista.id === this.vistaActual
    )!.nombre;
  }

  // Mostrar u ocultar el menú.
  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;

    if (this.menuAbierto) {
      this.indiceSeleccionado = this.vistas.findIndex(
        vista => vista.id === this.vistaActual
      );
    }
  }

  // Mover la selección o cambiar de vista.
  moverSeleccion(direccion: number): void {
    if (this.menuAbierto) {
      this.indiceSeleccionado =
        (this.indiceSeleccionado + direccion + this.vistas.length)
        % this.vistas.length;
    } else {
      const indiceActual = this.vistas.findIndex(
        vista => vista.id === this.vistaActual
      );

      const nuevoIndice =
        (indiceActual + direccion + this.vistas.length)
        % this.vistas.length;

      this.vistaActual = this.vistas[nuevoIndice].id;
    }
  }

  // Abrir la vista que esté seleccionada.
  confirmarSeleccion(): void {
    if (!this.menuAbierto) {
      this.alternarMenu();
      return;
    }

    this.vistaActual = this.vistaSeleccionada.id;
    this.menuAbierto = false;
  }

  // Regresar a la pantalla principal del reproductor.
  irAlMenu(): void {
    this.menuAbierto = true;

    this.indiceSeleccionado = this.vistas.findIndex(
      vista => vista.id === this.vistaActual
    );
  }
}
