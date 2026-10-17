import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cancion {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  plainLyrics: string | null;
  syncedLyrics: string | null;
  instrumental: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MusicaService {
  private apiUrl = 'https://lrclib.net/api/search';

  constructor(private http: HttpClient) {}

  buscarCanciones(artista: string, titulo: string): Observable<Cancion[]> {
    const consulta = `${artista.trim()} ${titulo.trim()}`;

    return this.http.get<Cancion[]>(
      `${this.apiUrl}?q=${encodeURIComponent(consulta)}`
    );
  }
}
