
import { ChangeDetectorRef, Component, NgZone, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import {
  ClimaService,
  RespuestaClima,
  UbicacionClima
} from '../../services/clima';

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clima.html',
  styleUrl: './clima.css'
})
export class ClimaComponent implements OnInit {

  private climaService = inject(ClimaService);
  private cdr = inject(ChangeDetectorRef);

  ciudad = 'Puebla';

  ubicacion: UbicacionClima | null = null;
  clima: RespuestaClima | null = null;

  cargando = false;
  error = '';

  ngOnInit(): void {
    // Consulta el clima al entrar a la pantalla
    this.buscar();
  }



  buscar(): void {
    const nombreCiudad = this.ciudad.trim();

    if (!nombreCiudad) {
      this.error = 'Escribe el nombre de una ciudad.';
      return;
    }

    if (this.cargando) {
      return;
    }

    this.cargando = true;
    this.error = '';
    this.clima = null;
    this.ubicacion = null;

    this.climaService.buscarClima(nombreCiudad)
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: resultado => {
          this.clima = resultado.clima;
          this.ubicacion = resultado.ubicacion;

          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Error al consultar el clima:', err);

          this.error = err?.message ||
            'No se pudo consultar el clima.';

          this.clima = null;
          this.ubicacion = null;

          this.cdr.markForCheck();
        }
      });
  }



  get descripcionClima(): string {
    const codigo = this.clima?.current.weather_code;

    if (codigo === undefined) return '';

    if (codigo === 0) return 'Despejado';
    if ([1, 2, 3].includes(codigo)) return 'Parcialmente nublado o nublado';
    if ([45, 48].includes(codigo)) return 'Niebla';
    if ([51, 53, 55, 56, 57].includes(codigo)) return 'Llovizna';
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return 'Lluvia';
    if ([71, 73, 75, 77, 85, 86].includes(codigo)) return 'Nieve';
    if ([95, 96, 99].includes(codigo)) return 'Tormenta';

    return 'Condiciones variables';
  }


}
