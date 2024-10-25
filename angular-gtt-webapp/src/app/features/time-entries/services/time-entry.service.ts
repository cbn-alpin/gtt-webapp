import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimeEntry } from '../models/time-entry.model';

@Injectable({
  providedIn: 'root'
})
export class TimeEntryService {
  constructor(private http: HttpClient) { }

}
