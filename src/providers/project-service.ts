import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserService } from './user-service';

@Injectable()
export class ProjectService {
  headers: any;
  constructor(private http: Http,
              private userService: UserService) {
    this.headers = this.userService.headers;
  }

  findByUserId(id) {
    return new Promise((resolve, reject) => {
      const endpoint = "api/tmh-project-portlet.project/find-by-user-id/userId/" + id + "?p_auth=[Fpfvhue6]";
      this.http.get(endpoint, {headers: this.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("Found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByInProgress() {
    return new Promise((resolve, reject) => {
      const endpoint = "api/tmh-project-portlet.project/find-by-in-progress?p_auth=[kGC1Jco4]";
      this.http.get(endpoint, {headers: this.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("Found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByComplete() {
    return new Promise((resolve, reject) => {
      const endpoint = "api/tmh-project-portlet.project/find-by-complete?p_auth=[sMXgUOR4]";
      this.http.get(endpoint, {headers: this.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("Found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByArchived() {
    return new Promise((resolve, reject) => {
      const endpoint = "api/tmh-project-portlet.project/find-by-archived?p_auth=[sMXgUOR4]";
      this.http.get(endpoint, {headers: this.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("Found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByUpNext() {
    return new Promise((resolve, reject) => {
      const endpoint = "api/tmh-project-portlet.project/find-by-up-next?p_auth=[Fpfvhue6]";
      this.http.get(endpoint, {headers: this.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("Found projects:");
        console.log(data);
        resolve(data);
      });
    });
  }

}
