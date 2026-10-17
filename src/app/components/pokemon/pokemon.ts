import { ChangeDetectorRef, Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { afterNextRender } from '@angular/core';

import {
  Pokemon,
  PokemonService
} from '../../services/pokemon';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [
    FormsModule,
    TitleCasePipe,

  ],
  templateUrl: './pokemon.html',
  styleUrl: './pokemon.css'
})
export class PokemonComponent {
  nombrePokemon = 'pikachu';

  pokemon: Pokemon | null = null;
  cargando = false;
  error = '';

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef

  ) {
    afterNextRender(() => {
      this.cargarPokemonGuardado();
      this.cdr.detectChanges();
    });
  }

  buscarPokemon(): void {
    const nombre = this.nombrePokemon.trim();

    if (!nombre) {
      this.error = 'Escribe el nombre o número de un Pokémon.';
      this.pokemon = null;
      return;
    }

    this.cargando = true;
    this.error = '';
    this.pokemon = null;

    this.pokemonService.buscarPokemon(nombre).subscribe({
      next: (datos) => {
        this.pokemon = datos;

        try {
          window.localStorage.setItem(
            'pokeMusicPokemon',
            JSON.stringify(datos)
          );
          this.nombrePokemon = ""
        } catch (error) {
          console.error('No se pudo guardar el Pokémon:', error);
          this.nombrePokemon = ""

        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se encontró ese Pokémon.';
        this.cargando = false;
        this.cdr.detectChanges();
        this.nombrePokemon = ""

      }
    });
  }

  private cargarPokemonGuardado(): void {
    const guardado = localStorage.getItem('pokeMusicPokemon');

    if (guardado) {
      try {
        this.pokemon = JSON.parse(guardado) as Pokemon;
      } catch {
        localStorage.removeItem('pokeMusicPokemon');
      }
    }
  }
}
