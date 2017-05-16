import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

import { UserService } from './user-service';

@Injectable()
export class ProjectService {
  headers: any;
  api: any;

  constructor(private http: Http,
              private platform: Platform,
              private userService: UserService) {
    this.headers = this.userService.headers;
    if (this.platform.is('core')) {
      this.api = '/api'
    } else {
      this.api = 'http://stage.themanhome.com/api/jsonws'
    }
  }

  findByUserId(id) {
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/tmh-project-portlet.project/find-by-user-id/userId/" + id + "?p_auth=[Fpfvhue6]";
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByInProgress() {
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/tmh-project-portlet.project/find-by-in-progress?p_auth=[kGC1Jco4]";
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByComplete() {
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/tmh-project-portlet.project/find-by-complete?p_auth=[sMXgUOR4]";
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByArchived() {
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/tmh-project-portlet.project/find-by-archived?p_auth=[sMXgUOR4]";
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByUpNext() {
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/tmh-project-portlet.project/find-by-up-next?p_auth=[Fpfvhue6]";
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  getProjectDetailType(projectId, type) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("fetching project details for type:");
      console.log(projectId);
      console.log(type);
      const endpoint = this.api + "/tmh-project-portlet.projectdetail/find-by-project-id-project-detail-type/project-id/" + projectId + "/project-detail-type-str/" + type;
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found project detail:");
        console.log(data);
        resolve(data);
      });
    });
  }

  getFileEntry(fileEntryId) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("fetching file with entry id:");
      console.log(fileEntryId);
      const endpoint = this.api + "/dlfileentry/get-file-entry/fileEntryId/" + fileEntryId;
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found file data:");
        console.log(data);
        if (!data.exception) {
          const repositoryId = data.repositoryId;
          const folderId = data.folderId;
          const title = data.title;
          const uuid = data.uuid;
          const version = data.version;
          const createDate = data.createDate;
          const url = "http://stage.themanhome.com/documents/" + repositoryId + "/" + folderId + "/" + title + "/" + uuid + "?version=" + version + "&t=" + createDate;
          data.url = url;
          resolve(data);
        } else {
          resolve(data);
        }
      });
    });
  }

  getFileEntries(ids) {
    console.log("fetching files with ids:");
    console.log(ids);
    var promises = [];
    for (var key in ids) {
      const id = ids[key];
      promises.push(this.getFileEntry(id));
    }
    return Promise.all(promises);
  }

  fetchQuestionAnswer(project, questionNum) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("fetching question answer for question num:");
      console.log(questionNum);
      const questionMap = {
        1: 20454,
        2: 20455,
        3: 20456,
        4: 20457,
        5: 20458
      }
      var questionId = questionMap[questionNum];
      const endpoint = this.api + "/tmh-project-portlet.userquestionanswer/fetch-by-user-id-question-id/userId/" + project.userId + "/questionId/" + questionId;
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found question answer:");
        console.log(data);
        resolve(data);
      });
    });
  }

  fetchQuestionAnswers(project) {
    console.log("fetching question answers for project:");
      console.log(project.projectId);
    var promises = [];
    for (var i=1;i<6;i++) {
      promises.push(this.fetchQuestionAnswer(project, i));
    }
    return Promise.all(promises);
  }

  fetchItems(project) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("fetching items for project:");
      console.log(project.projectId);
      const endpoint = this.api + "/tmh-project-portlet.projectitem/find-by-project-id/projectId/" + project.projectId;
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found project items:");
        console.log(data);
        resolve(data);
      });
    });
  }

}
