import { Injectable } from '@angular/core';
import { BackendHttpClient } from '../backend-http-client.service';
import { Project } from './project.service';

@Injectable({
    providedIn: 'root'
})
export class ManageProjectsService {
    private endpoint = '/api/project/project';

    constructor(private http: BackendHttpClient) {
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

        return this.http.put<Project>(`${this.endpoint}/${project.uuid}`,
            <EditProjectData>{
                news: currentNews
            });
    }

    deleteNewsFromProject(project: Project, newsLink: string) {
        const currentNews = project.news.filter(news => news !== newsLink);

        return this.http.put<Project>(`${this.endpoint}/${project.uuid}`,
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
