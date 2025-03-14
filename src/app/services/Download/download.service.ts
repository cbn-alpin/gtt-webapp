import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private readonly snackBar: MatSnackBar) { }

  downloadCSV(data: any[], exportFileName: string) {
    if (!data || data.length === 0) {
      return;
    }
  
    const headers = Object.keys(data[0]).join(';');
    
    // Correctly handle values containing quotation marks or semicolons
    const rows = data.map(row => 
      Object.values(row)
        .map(value => {
          // If the value already contains quotation marks, we leave it as is
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            return value;
          }
          // Otherwise, escape the existing quotation marks and enclose them in quotation marks.
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(';')
    );
  
    const csvContent = [headers, ...rows].join('\n');
    
    // Add BOM for correct UTF-8 encoding
    const blob = new Blob([`\uFEFF${csvContent}`], { 
      type: 'text/csv;charset=utf-8;'
    });
  
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFileName}.csv`;
  
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
