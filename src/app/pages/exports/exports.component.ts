import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

import { ExpensesExportComponent } from './expenses-export/expenses-export.component';
import { ProjectsExportComponent } from './projects-export/projects-export.component';

@Component({
  selector: 'app-exports',
  standalone: true,
  templateUrl: './exports.component.html',
  styleUrls: ['./exports.component.scss'],
  imports: [ProjectsExportComponent, MatDividerModule, ExpensesExportComponent],
})
export class ExportsComponent {}
