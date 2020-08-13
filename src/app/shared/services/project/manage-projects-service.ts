import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api.service';
import { ProjectModel } from './project-service';

@Injectable({
    providedIn: 'root'
})
export class ManageProjectsService {
    private endpoint = '/api/project/project';

    constructor(private http: BackendApiService) {
    }

    deleteDocument(projectID: string, documentID: number) {
        return this.http.delete<void>(`${this.endpoint}/${projectID}/document/${documentID}`);
    }

    addNewsToProject(project: ProjectModel, newsLink: string) {
        let currentNews = project.news;
        if (currentNews !== undefined) {
            currentNews.push(newsLink);
        } else {
            currentNews = [newsLink];
        }

        return this.http.put<ProjectModel>(`${this.endpoint}/${project.uuid}`,
            <EditProjectData>{
                news: currentNews
            });
    }

    deleteNewsFromProject(project: ProjectModel, newsLink: string) {
        const currentNews = project.news.filter(news => news !== newsLink);

        return this.http.put<ProjectModel>(`${this.endpoint}/${project.uuid}`,
            <EditProjectData>{
                news: currentNews
            });
    }
}

export interface EditProjectData {
    name?: string;
    description?: string;
    location?: { lat: number, long: number };
    roi?: { from: number, to: number };
    active?: boolean;
    tags?: string[];
    news?: any;
}
