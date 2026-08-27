import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { UserInfos } from 'src/app/core/models/user-infos.model';
import { UserService } from 'src/app/core/services/user/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['user_first_name', 'user_last_name'];
  dataSource = new MatTableDataSource<Partial<UserInfos>>([]);
  isLoadingResults = false;
  isError = false;

  paginator!: MatPaginator;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  private readonly userService = inject(UserService);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoadingResults = true;
    this.isError = false;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        this.isLoadingResults = false;
      },
      error: () => {
        this.isLoadingResults = false;
        this.isError = true;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  selectUser(userInfo: UserInfos) {
    localStorage.setItem('user_email', userInfo.email);
    localStorage.setItem('switched_user_name', `${userInfo.first_name} ${userInfo.last_name}`);
    localStorage.setItem('isAdminChangedAccount', 'true');
    localStorage.setItem('id_user', `${userInfo.id_user}`);
    window.location.reload();
  }
}
