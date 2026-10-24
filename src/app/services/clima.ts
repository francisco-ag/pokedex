import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, switchMap, throwError } from 'rxjs';

export interface UbicacionClima {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface RespuestaGeocodificacion {
  results?: UbicacionClima[];
}

export interface RespuestaClima {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  current_units?: {
    temperature_2m?: string;
    wind_speed_10m?: string;
  };
  timezone: string;
}

@Injectable({ providedIn: 'root' })
export class ClimaService {
  private http = inject(HttpClient);

  buscarClima(ciudad: string): Observable<{
    ubicacion: UbicacionClima;
    clima: RespuestaClima;
  }> {
    const nombre = ciudad.trim();

    if (!nombre) {
      return throwError(() => new Error('Escribe el nombre de una ciudad.'));
    }

    const params = new HttpParams()
      .set('name', nombre)
      .set('count', '1')
      .set('language', 'es')
      .set('format', 'json');

    return this.http.get<RespuestaGeocodificacion>(
      'https://geocoding-api.open-meteo.com/v1/search',
      { params }
    ).pipe(
      switchMap(respuesta => {
        const ubicacion = respuesta.results?.[0];

        if (!ubicacion) {
          return throwError(
            () => new Error('No se encontró la ciudad. Prueba con otro nombre.')
          );
        }

        const climaParams = new HttpParams()
        .set('latitude', ubicacion.latitude)
        .set('longitude', ubicacion.longitude)
        .set(
          'current',
          'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m'
        )
        .set('timezone', 'auto');

        return this.http.get<RespuestaClima>(
          'https://api.open-meteo.com/v1/forecast',
          { params: climaParams }
        ).pipe(
          map(clima => ({
            ubicacion,
            clima
          }))
        );
      })
    );
  }
}
