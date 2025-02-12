import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor() { }

  downloadCSV(data: any[], exportFileName : string) {
    if (!data || data.length === 0) {
      console.error('No data provided');
      return;
    }

    const headers = Object.keys(data[0]).join(';'); 
    const rows = data.map(row => Object.values(row).join(';'));
    const csvContent = [headers, ...rows].join('\n'); 

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = exportFileName; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); 
  }
}
