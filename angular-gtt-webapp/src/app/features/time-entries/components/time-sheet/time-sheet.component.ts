import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TimeStateService } from '../../services/time-state.service';

@Component({
  selector: 'app-time-sheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  template: `
    <div class="time-sheet">
      <table>
        <thead>
          <tr>
            <th class="project-col">Projets/Actions</th>
            @for (day of weekDays(); track day.date) {
              <th [class.weekend]="day.isWeekend" [class.today]="day.isToday">
                {{ day.name }}<br>
                {{ formatDate(day.date) }}
              </th>
            }
            <th class="total-col">Total Semaine</th>
            <th class="total-col">Total Année</th>
          </tr>
        </thead>
        <tbody>
          <!-- Standard rows -->
          @for (project of projects; track project.id) {
            <tr class="project-row">
              <td class="project-name" colspan="10">{{ project.name }}</td>
            </tr>
            @for (action of project.actions; track action.id) {
              <tr class="action-row">
                <td class="action-name" [matTooltip]="action.description">
                  {{ action.name }}
                </td>
                @for (day of weekDays(); track day.date) {
                  <td [class.weekend]="day.isWeekend" [class.today]="day.isToday">
                    <input 
                      type="number" 
                      [ngModel]="getTimeEntry(project.id, action.id, day.date).hours"
                      (ngModelChange)="updateTimeEntry($event, project.id, action.id, day.date)"
                      [id]="getInputId(project.id, action.id, day.date)"
                      step="0.25"
                    >
                  </td>
                }
                <td class="total-week">
                  {{ calculateWeekTotal(project.id, action.id) }}
                </td>
                <td class="total-year">
                  {{ calculateYearTotal(project.id, action.id) }}
                </td>
              </tr>
            }
          }
          <!-- Fixed rows (absence, service, formation) -->
          @for (fixedRow of fixedRows; track fixedRow.id) {
            <tr class="fixed-row">
              <td class="fixed-name">{{ fixedRow.name }}</td>
              @for (day of weekDays(); track day.date) {
                <td [class.weekend]="day.isWeekend" [class.today]="day.isToday">
                  <input 
                    type="number" 
                    [ngModel]="getTimeEntry(fixedRow.id, 0, day.date).hours"
                    (ngModelChange)="updateTimeEntry($event, fixedRow.id, 0, day.date)"
                    step="0.25"
                  >
                </td>
              }
              <td class="total-week">
                {{ calculateWeekTotal(fixedRow.id, 0) }}
              </td>
              <td class="total-year">
                {{ calculateYearTotal(fixedRow.id, 0) }}
              </td>
            </tr>
          }
          <!-- Daily totals row -->
          <tr class="daily-total-row">
            <td>Total jour</td>
            @for (day of weekDays(); track day.date) {
              <td [class.weekend]="day.isWeekend" [class.today]="day.isToday">
                {{ calculateDayTotal(day.date) }}
              </td>
            }
            <td colspan="2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .time-sheet {
      background: var(--white);
      border-radius: 4px;
      box-shadow: var(--box-shadow);
      overflow-x: auto;
      padding: var(--spacing-md);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    th, td {
      padding: var(--spacing-xs);
      border: 1px solid var(--light-grey);
      text-align: center;
      height: 40px;
    }

    th {
      background-color: var(--light-color);
      font-weight: 500;
    }

    .weekend {
      background-color: var(--light-grey);
    }

    .today {
      background-color: rgba(18, 86, 153, 0.1);
    }

    .project-col {
      width: 200px;
      text-align: left;
    }

    .project-row {
      background-color: var(--light-grey);
    }

    .project-name {
      font-weight: 500;
      text-align: left;
      padding: var(--spacing-xs) var(--spacing-sm);
    }

    .action-name {
      text-align: left;
      padding-left: var(--spacing-md);
    }

    input {
      width: 50px;
      padding: 4px;
      border: 1px solid var(--grey);
      border-radius: 4px;
      text-align: center;
      
      &:focus {
        outline: none;
        border-color: var(--primary);
        background-color: var(--light-color);
      }
    }

    .daily-total-row {
      font-weight: 500;
      background-color: var(--light-color);
    }

    .total-week, .total-year {
      background-color: var(--light-grey);
      font-weight: 500;
    }

    .fixed-row {
      background-color: var(--light-grey);
    }

    .fixed-name {
      text-align: left;
      padding-left: var(--spacing-sm);
      font-weight: 500;
    }
  `]
})
export class TimeSheetComponent {
  weekDays = computed(() => this.timeStateService.currentWeek());

  // Fixed rows as per specifications
  fixedRows = [
    { id: 'absence', name: 'Absence' },
    { id: 'service', name: 'Service' },
    { id: 'formation', name: 'Formation' }
  ];

  // Mock projects data
  projects = [
    {
      id: 1,
      name: "Projet 1",
      actions: [
        { id: 1, name: "Action 1.1", description: "Description de l'action 1.1" },
        { id: 2, name: "Action 1.2", description: "Description de l'action 1.2" }
      ]
    },
    {
      id: 2,
      name: "Projet 2",
      actions: [
        { id: 3, name: "Action 2.1", description: "Description de l'action 2.1" }
      ]
    }
  ];

  private timeEntries: Map<string, number> = new Map();

  constructor(private timeStateService: TimeStateService) { }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  getTimeEntry(projectId: number | string, actionId: number, date: Date): { hours: number } {
    const key = `${projectId}-${actionId}-${date.toISOString()}`;
    return { hours: this.timeEntries.get(key) || 0 };
  }

  updateTimeEntry(hours: number, projectId: number | string, actionId: number, date: Date) {
    const key = `${projectId}-${actionId}-${date.toISOString()}`;
    this.timeEntries.set(key, hours);
    // Auto-save triggered here
    this.autoSave(projectId, actionId, date, hours);
  }

  calculateWeekTotal(projectId: number | string, actionId: number): number {
    let total = 0;
    this.weekDays().forEach(day => {
      total += this.getTimeEntry(projectId, actionId, day.date).hours;
    });
    return total;
  }

  calculateYearTotal(projectId: number | string, actionId: number): number {
    // This would normally fetch the year total from the backend
    return this.calculateWeekTotal(projectId, actionId) * 4; // Mock
  }

  calculateDayTotal(date: Date): number {
    let total = 0;
    // Sum project actions
    this.projects.forEach(project => {
      project.actions.forEach(action => {
        total += this.getTimeEntry(project.id, action.id, date).hours;
      });
    });
    // Sum fixed rows
    this.fixedRows.forEach(row => {
      total += this.getTimeEntry(row.id, 0, date).hours;
    });
    return total;
  }

  getInputId(projectId: number | string, actionId: number, date: Date): string {
    return `input-${projectId}-${actionId}-${date.toISOString()}`;
  }

  private autoSave(projectId: number | string, actionId: number, date: Date, hours: number) {
    console.log('Auto-saving:', { projectId, actionId, date, hours });
  }
}
