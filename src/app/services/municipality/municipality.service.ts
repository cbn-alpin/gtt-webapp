import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunicipalityService {

  // private apiUrl = 'https://nominatim.openstreetmap.org/search';

  // constructor(private http: HttpClient) {}

  // getCommunes(query: string): Observable<any[]> {
  //   const params = {
  //     q: query,
  //     format: 'json',
  //     addressdetails: '1',
  //     countrycodes: 'fr,de,it,es,gb', // Codes des pays souhaités
  //     limit: '10'
  //   };
  //   return this.http.get<any[]>(this.apiUrl, { params });
  // }

  private apiUrl = 'https://geo.api.gouv.fr/communes';

  constructor(private http: HttpClient) {}

  getCommunes(nom: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?nom=${nom}&fields=nom,codesPostaux&limit=10`);
  }

}
