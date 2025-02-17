import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserInfos } from 'src/app/models/UserInfos';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['user_first_name', 'user_last_name'];
    dataSource = new MatTableDataSource<UserInfos>([]);
    selectedProjectData: any = null ;
    isLoadingResults = false;
    isError = false;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    constructor(private userService: UserService) {}
  
    ngOnInit(): void {
      this.fetchProjects();
    }
     
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }
  
    fetchProjects(): void {
      this.isLoadingResults = true;
      this.isError = false;
  
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          setTimeout(() => { 
            this.dataSource.data = users;
            this.isLoadingResults = false;
            
            setTimeout(() => { 
              this.dataSource.paginator = this.paginator;   
            }, 100);
          }, 1000);
        },
        error: () => {
          this.isLoadingResults = false;
          this.isError = true;
        }
      });
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    selectUser(userInfo: UserInfos) {
      localStorage.setItem('user_email', userInfo.email);
      localStorage.setItem('user_name', `${userInfo.first_name} ${userInfo.last_name}`);
      localStorage.setItem('id_user', `${userInfo.id_user}`);
      window.location.reload();
    }
}
