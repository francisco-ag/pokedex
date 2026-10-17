import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { afterNextRender } from '@angular/core';
import {
  Cancion,
  MusicaService
} from '../../services/musica';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-musica',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './musica.html',
  styleUrl: './musica.css'
})
export class MusicaComponent implements OnInit {
  artista = '';
  tituloCancion = '';

  letra = '';
  cargando = false;
  error = '';

  constructor(
    private musicaService: MusicaService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.cargarMusicaGuardada();
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.cargarMusicaGuardada();
  }

  buscarLetra(): void {
    const artista = this.artista.trim();
    const titulo = this.tituloCancion.trim();

    if (!artista || !titulo) {
      this.error = 'Escribe el artista y el título de la canción.';
      this.letra = '';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.letra = '';

    this.musicaService.buscarCanciones(artista, titulo)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (canciones) => {
          const artistaBuscado = artista.toLowerCase();
          const tituloBuscado = titulo.toLowerCase();

          const cancion = canciones.find((item) =>
            item.plainLyrics?.trim() &&
            item.artistName.toLowerCase().includes(artistaBuscado) &&
            item.trackName.toLowerCase().includes(tituloBuscado)
          );

          if (cancion?.plainLyrics) {
            this.letra = cancion.plainLyrics;
            window.localStorage.setItem(
              'pokeMusicCancion',
              JSON.stringify({
                artista: this.artista,
                tituloCancion: this.tituloCancion,
                letra: this.letra
              })
            );
          } else {
            this.error = 'No encontramos la letra. Prueba con otro artista o título.';
            this.artista = ""
          }
        },

        error: (err) => {
          console.error('Error consultando LRCLIB:', err);

          this.error =
            'No se pudo consultar LRCLIB. Revisa tu conexión e inténtalo de nuevo.';
        },

        complete: () => {
          this.cdr.detectChanges();
        }
      });
  }

  private cargarMusicaGuardada(): void {
    try {
      const guardado = window.localStorage.getItem('pokeMusicCancion');

      if (guardado) {
        const datos = JSON.parse(guardado);

        this.artista = datos.artista;
        this.tituloCancion = datos.tituloCancion;
        this.letra = datos.letra;
      }
    } catch (error) {
      console.error('No se pudo recuperar la canción:', error);
    }
  }
}
