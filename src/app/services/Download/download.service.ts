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
    
    // Gérer correctement les valeurs qui contiennent des guillemets ou des points-virgules
    const rows = data.map(row => 
      Object.values(row)
        .map(value => {
          // Si la valeur contient déjà des guillemets, on la laisse telle quelle
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            return value;
          }
          // Sinon, on échappe les guillemets existants et on entoure de guillemets
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(';')
    );
  
    const csvContent = [headers, ...rows].join('\n');
    
    // Ajouter le BOM pour l'encodage UTF-8 correct
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
