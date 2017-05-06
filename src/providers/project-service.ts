import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProjectService {

  constructor(private http: Http) {
  }

  findByUserId(id, headers, callback) {
    const endpoint = "api/tmh-project-portlet.project/find-by-user-id/userId/" + id + "?p_auth=[Fpfvhue6]";
    this.http.get(endpoint, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("Found projects:");
      console.log(data);
      callback(data);
    })
  }

  findByUpNext(headers, callback) {
    const endpoint = "api/tmh-project-portlet.project/find-by-up-next?p_auth=[Fpfvhue6]";
    this.http.get(endpoint, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("Found projects:");
      console.log(data);
      callback(data);
    })
  }

  findByInProgress(headers, callback) {
    const endpoint = "api/tmh-project-portlet.project/find-by-in-progress?p_auth=[kGC1Jco4]";
    this.http.get(endpoint, {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log("Found projects:");
      console.log(data);
      callback(data);
    })
  }

}
