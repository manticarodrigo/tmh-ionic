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

  updateStatus(project, status) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("updating project status:");
      console.log(status);
      var endpoint = this.api + "/tmh-project-portlet.project/update-project-status/projectId/" + project.projectId + "/userId/" + project.userId + "/projectStatus/" + status;
      if (status == 'FLOOR_PLAN') {
        endpoint += "/daysLeft/" + 15;
      }
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("status update returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  updateDetailStatus(detail, status) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("updating detail status:");
      console.log(status);
      var endpoint = this.api + "/tmh-project-portlet.projectdetail/update-project-detail/projectDetailId/" + detail.projectDetailId + "/projectDetailStatus/" + status;
      console.log(endpoint);
      self.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("detail update returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByUserId(uid) {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-user-id": {
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
        "$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-in-progress": {
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
        "$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-complete": {
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
        "$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-archived": {
          // "$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id": {
          //   "@userId": "$project.userId"
          // }
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
        "$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-up-next": {
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
        "$detail[fileEntryId,projectDetailId,projectDetailStatus,projectDetailType] = /tmh-project-portlet.projectdetail/find-by-project-id-project-detail-type": {
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

  addDetail(project, file, type) {
    console.log("adding detail of type:");
    console.log(type);
    const self = this;
    return new Promise((resolve, reject) => {
      var headers = self.headers;
      headers.append("enctype", "multipart/form-data");
      const now = new Date().getTime();
      const endpoint = this.api + "/tmh-project-portlet.projectdetail/add-project-detail.9/globalGroupId/" + 20484 + "/projectId/" + project.projectId + "/projectDetailType/" + type + "/projectDetailStatus/PENDING/fileName/" + now + "-" + file.name + "/contentType/" + file.type.split("/")[1] + "/fileSize/" + file.size + "/serviceContext/" + JSON.stringify({"userId":self.userService.currentUser.userId});
      console.log(endpoint);
      var formData = new FormData();
      formData.append('file', file);
      this.http.post(endpoint, formData, {headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("add detail returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  deleteDetail(project, detail) {
    console.log("deleting detail:");
    console.log(detail);
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/tmh-project-portlet.projectdetail/delete-project-detail/projectId/" + project.projectId + "/projectDetailId/" + detail.projectDetailId;
      this.http.get(endpoint, {headers: self.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("delete returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  addItem(project, item) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("adding project item:");
      console.log(item);
      var headers = self.headers;
      headers.append("enctype", "multipart/form-data");
      const now = new Date().getTime();
      const map = {
        "/tmh-project-portlet.projectitem/add-project-item": {
          "projectId": project.projectId,
          "parentProjectItemId": 0,
          "projectItemStatus": "PENDING",
          "fileName": now + "-" + item.file.name,
          "contentType": item.file.type.split("/")[1],
          "fileSize": item.file.size,
          "itemMake": item.itemMake ? item.itemMake : "",
          "itemType": item.itemType ? item.itemType : "",
          "itemPrice": item.itemPrice ? item.itemPrice : "",
          "itemInspiration": item.itemInspiration ? item.itemInspiration : "",
          "yCoordinate": item.YCoordinate,
          "xCoordinate": item.XCoordinate,
          "serviceContext": JSON.stringify({"userId":self.userService.currentUser.userId})
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
      var formData = new FormData();
      formData.append('file', item.file);
      self.http.post(endpoint, formData, {headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("add item returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

}