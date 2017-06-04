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
    if (this.platform.is('cordova')) {
      this.api = 'http://stage.themanhome.com/api/jsonws';
    } else {
      this.api = '/api';
    }
  }

  findByUserId(uid) {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$project[projectId,createDate,endDate,modifiedDate,startDate,initChat,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-user-id": {
          "userId": uid,
          "$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id": {
            "@userId": "$project.userId"
          }
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(projects => {
        console.log("found projects:");
        console.log(projects);
        resolve(projects);
      });
    });
  }

  findByInProgress() {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$project[projectId,createDate,endDate,modifiedDate,startDate,initChat,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-in-progress": {
          "$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id": {
            "@userId": "$project.userId"
          }
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(projects => {
        console.log("found projects:");
        console.log(projects);
        resolve(projects);
      });
    });
  }

  findByComplete() {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$project[projectId,createDate,endDate,modifiedDate,startDate,initChat,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-complete": {
          "$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id": {
            "@userId": "$project.userId"
          }
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(projects => {
        console.log("found projects:");
        console.log(projects);
        resolve(projects);
      });
    });
  }

  findByArchived() {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$project[projectId,createDate,endDate,modifiedDate,startDate,initChat,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-archived": {
          "$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id": {
            "@userId": "$project.userId"
          }
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(projects => {
        console.log("found projects:");
        console.log(projects);
        resolve(projects);
      });
    });
  }

  findByUpNext() {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$project[projectId,createDate,endDate,modifiedDate,startDate,initChat,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-up-next": {
          "$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id": {
            "@userId": "$project.userId"
          }
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(projects => {
        console.log("found projects:");
        console.log(projects);
        resolve(projects);
      });
    });
  }

  fetchProjectDetail(projectId, type) {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$detail[fileEntryId] = /tmh-project-portlet.projectdetail/find-by-project-id-project-detail-type": {
          "projectId": projectId,
          "projectDetailTypeStr": type,
          "$file[repositoryId,folderId,title,uuid,version,createDate] = /dlfileentry/get-file-entry": {
            "@fileEntryId": "$detail.fileEntryId"
          }
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found project detail:");
        console.log(data);
        resolve(data);
      });
    });
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
      const map = {
        "$item[itemMake,itemPrice,itemType,fileEntryId,projectItemStatus,XCoordinate,YCoordinate] = /tmh-project-portlet.projectitem/find-by-project-id": {
          "projectId": project.projectId,
          "$file[repositoryId,folderId,title,uuid,version,createDate] = /dlfileentry/get-file-entry": {
            "@fileEntryId": "$item.fileEntryId"
          }
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
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
