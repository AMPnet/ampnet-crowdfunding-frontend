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

  addNewsToProject(project: ProjectModel, newsLink: string) {

    var currentNews = project.news;
    if(currentNews != undefined) {
      currentNews.push(newsLink)
    } else {
      currentNews = [newsLink]
    }

    return this.http.put(API.generateComplexRoute(this.projectEndpoint, [
      project.uuid
    ]), {
      "name" : project.name,
      "description" : project.description,
      "location" : project.location,
      "location_text": project.location_text,
      "roi": project.roi,
      "active": project.active,
      "tags": null,
      "news": currentNews
    }, API.tokenHeaders())
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
