import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MunicipalityService {
  private readonly apiUrl = 'https://geo.api.gouv.fr/communes';

  private readonly http = inject(HttpClient);

  getCommunes(nom: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?nom=${nom}&fields=nom,codesPostaux&limit=10`);
  }
}
