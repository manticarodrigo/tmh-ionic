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
        console.log("Found projects:");
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
        console.log("Found projects:");
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
        console.log("Found projects:");
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
        console.log("Found projects:");
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
        console.log("Found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  getProjectDetailType(projectId, type) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("Fetching project details for type:");
      console.log(projectId);
      console.log(type);
      const endpoint = this.api + "/tmh-project-portlet.projectdetail/find-by-project-id-project-detail-type/project-id/" + projectId + "/project-detail-type-str/" + type;
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("Found project detail:");
        console.log(data);
        resolve(data);
      });
    });
  }

}
