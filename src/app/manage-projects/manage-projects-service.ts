import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../utilities/endpoint-manager';
import { ProjectModel } from '../projects/create-new-project/project-model';

@Injectable({
  providedIn: 'root'
})
export class ManageProjectsService {

  private endpoint = '/countries';
  private projectEndpoint = "/project"

  constructor(
    private http: HttpClient) { }
  

  deleteDocument(projectID: string, documentID: number) {
    return this.http.delete(API.generateComplexRoute(this.projectEndpoint, [
      projectID.toString(), "document", documentID.toString()
    ]), API.tokenHeaders());
  }

  updateProject(projectModel: ProjectModel, orgID: number) {

  }

  addNewsToProject(projectID: string, newsLink: string) {
    return this.http.post(API.generateComplexRoute(this.projectEndpoint, [
      projectID.toString(), "news"
    ]), { "link" : newsLink }, API.tokenHeaders())
  }

  deleteNewsFromProject(projectID: string, newsLink: string) {
    return this.http.request('delete', API.generateComplexRoute(this.projectEndpoint, [
      projectID.toString(), "news"
    ]), {
      body: {
        "link" : newsLink
      },
      headers: {
        "Authorization" : API.tokenHeaders().headers["Authorization"]
      }
    });
  }

}
