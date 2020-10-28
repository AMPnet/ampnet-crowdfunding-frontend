import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { Project, ProjectService } from './project.service';

@Injectable({
    providedIn: 'root'
})
export class ManageProjectsService {
    private endpoint = '/api/project/project';

    constructor(private http: BackendHttpClient,
                private projectService: ProjectService) {
    }

    deleteDocument(projectID: string, documentID: number) {
        return this.http.delete<void>(`${this.endpoint}/${projectID}/document/${documentID}`);
    }

    addNewsToProject(project: Project, newsLink: string) {
        let currentNews = project.news;
        if (currentNews !== undefined) {
            currentNews.push(newsLink);
        } else {
            currentNews = [newsLink];
        }

        return this.projectService.updateProject(project.uuid, {news: currentNews});
    }

    deleteNewsFromProject(project: Project, newsLink: string) {
        const currentNews = project.news.filter(news => news !== newsLink);

        return this.projectService.updateProject(project.uuid, {news: currentNews});
    }
}
