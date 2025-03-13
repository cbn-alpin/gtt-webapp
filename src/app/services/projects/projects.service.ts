import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  baseUrl = environment.apiUrl;

  private getHttpOptions() {
    const token = localStorage.getItem('access_token'); 
    
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      })
    };
  }

  constructor(private http : HttpClient) { }
  
  getAllProjects(): Observable<any> {
    const url = `${this.baseUrl}/projects`;
    return this.http.get(url, this.getHttpOptions());
  }

  createProject(projectData: Project): Observable<any> {
    const url = `${this.baseUrl}/projects`; 
    return this.http.post(url, projectData, this.getHttpOptions());
  }

  deleteProjectById(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/projects/${projectId}`; 
    return this.http.delete(url, this.getHttpOptions());
  }

  getProjectById(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/projects/${projectId}`; 
    return this.http.get(url, this.getHttpOptions());
  }

  updateProjectById(projectId: number, projectData: any): Observable<any> {
    const url = `${this.baseUrl}/projects/${projectId}`;
    return this.http.put(url, projectData, this.getHttpOptions());
  }  
  
  getProjectActionsAndUsersTimesById(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/project/${projectId}/actions`;
    return this.http.get(url, this.getHttpOptions());
  }

  getGefiprojAllProjects(): Observable<any> {
    const url = `${this.baseUrl}/projects/gefiproj`;
    return this.http.get(url, this.getHttpOptions());

  }
}
