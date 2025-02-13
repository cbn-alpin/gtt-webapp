import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models/Project';
import { APP_CONFIG } from 'src/main';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  baseUrl = APP_CONFIG.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http : HttpClient) { }
  
  getAllProjects(): Observable<any> {
    const url = `${this.baseUrl}/projects`;
    return this.http.get(url, this.httpOptions);
  }

  createProject(projectData: Project): Observable<any> {
    const url = `${this.baseUrl}/projects`; 
    return this.http.post(url, projectData, this.httpOptions);
  }

  deleteProjectById(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/projects/${projectId}`; 
    return this.http.delete(url, this.httpOptions);
  }

  getProjectById(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/projects/${projectId}`; 
    return this.http.get(url, this.httpOptions);
  }

  updateProjectById(projectId: number, projectData: any): Observable<any> {
    const url = `${this.baseUrl}/projects/${projectId}`;
    return this.http.put(url, projectData, this.httpOptions);
  }  
  
  getProjectActionsAndUsersTimesById(projectId: number): Observable<any> {
    const url = `${this.baseUrl}/project/${projectId}/actions`;
    return this.http.get(url, this.httpOptions);
  }
}
