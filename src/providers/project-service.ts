import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { UserService } from './user-service';

@Injectable()
export class ProjectService {
  api: any;

  constructor(private http: Http,
              private userService: UserService) {
    this.api = this.userService.api;
  }

  updateStatus(project, status) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("updating project status:");
      console.log(status);
      var endpoint = this.api + "/tmh-project-portlet.project/update-project-status/projectId/" + project.projectId + "/userId/" + project.userId + "/projectStatus/" + status;
      if (status == 'CONCEPTS') {
        endpoint += "/daysLeft/" + 14;
      }
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("status update returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  updateRevisionCount(project, status) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("updating project status/revisionCount:");
      console.log(status);
      var endpoint = this.api + "/tmh-project-portlet.project//update-project-revision-count/projectId/" + project.projectId + "/userId/" + project.userId + "/projectStatus/" + status + "/revisionCount/" + Number(project.revisionCount) + 1;
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("status/revisionCount update returned response:");
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
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("detail update returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  findByProjectId(id) {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        "$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-project-id": {
          "projectId": id,
          "$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id": {
            "@userId": "$project.userId"
          }
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + encodeURIComponent(JSON.stringify(map));
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(project => {
        console.log("found project:");
        console.log(project);
        resolve(project);
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
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
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
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
      self.http.get(endpoint, {headers: self.userService.headers})
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
        "$item[itemMake,itemPrice,itemType,itemInspiration,fileEntryId,projectItemId,parentProjectItemId,projectItemStatus,XCoordinate,YCoordinate,userId,checked] = /tmh-project-portlet.projectitem/find-by-project-id": {
          "projectId": project.projectId
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found project items:");
        console.log(data);
        resolve(data);
      });
    });
  }

  addDetail(project, file, type, status) {
    console.log("adding detail of type:");
    console.log(type);
    const self = this;
    return new Promise((resolve, reject) => {
      var headers = self.userService.headers;
      headers.append("enctype", "multipart/form-data");
      const now = new Date().getTime();
      const endpoint = this.api + "/tmh-project-portlet.projectdetail/add-project-detail.9/globalGroupId/" + 20484 + "/projectId/" + project.projectId + "/projectDetailType/" + type + "/projectDetailStatus/" + status + "/fileName/" + now + "-" + file.name + "/contentType/" + file.type.split("/")[1] + "/fileSize/" + file.size + "/serviceContext/" + JSON.stringify({"userId":self.userService.currentUser.userId});
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
      this.http.get(endpoint, {headers: self.userService.headers})
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
      var headers = self.userService.headers;
      headers.append("enctype", "multipart/form-data");
      const now = new Date().getTime();
      const map = {
        "/tmh-project-portlet.projectitem/add-project-item": {
          "projectId": project.projectId,
          "yCoordinate": item.YCoordinate,
          "xCoordinate": item.XCoordinate,
          "serviceContext": JSON.stringify({"userId":self.userService.currentUser.userId})
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      self.http.post(endpoint, {}, {headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("add item returned response:");
        console.log(data);
        if (!data.exception) {
          self.updateItem(project, data, 'PENDING')
          .then(data => {
            resolve(data);
          });
        } else {
          resolve(data);
        }
      });
    });
  }

  updateItem(project, item, status) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("updating project item:");
      console.log(item);
      var headers = self.userService.headers;
      headers.append("enctype", "multipart/form-data");
      const now = new Date().getTime();
      const map = {
        "/tmh-project-portlet.projectitem/update-project-item": {
          "projectItemId": project.projectItemId,
          "projectItemStatus": status,
          "itemMake": item.itemMake ? item.itemMake : "",
          "itemType": item.itemType ? item.itemType : "",
          "itemPrice": item.itemPrice ? item.itemPrice : "",
          "itemInspiration": item.itemInspiration ? item.itemInspiration : "",
          "fileName": item.file ? now + "-" + item.file.name : "",
          "contentType": item.file ? item.file.type.split("/")[1] : "",
          "fileSize": item.file ? item.file.size : "",
          "serviceContext": JSON.stringify({"userId":self.userService.currentUser.userId})
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      var formData = new FormData();
      if (item.file) {
        formData.append('file', item.file);
      }
      self.http.post(endpoint, formData, {headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("update item returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  updateItemStatus(item, status) {
    console.log("updating item status:");
    console.log(item);
    console.log(status);
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + "/tmh-project-portlet.projectitem/update-project-item-status/projectItemId/" + item.projectItemId + "/userId/" + item.userId + "/projectItemStatus/" + status;
      this.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("update returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  addAlternative(project, item, file, parentItem) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log("adding item alt:");
      console.log(project);
      console.log(item);
      console.log(file);
      console.log(parentItem);
      var headers = self.userService.headers;
      headers.append("enctype", "multipart/form-data");
      const now = new Date().getTime();
      const map = {
        "/tmh-project-portlet.projectitem/add-project-item": {
          "projectId": project.projectId,
          "parentProjectItemId": parentItem.projectItemId,
          "projectItemStatus": "ALTERNATE",
          "itemMake": item.itemMake ? item.itemMake : "",
          "itemType": item.itemType ? item.itemType : "",
          "itemPrice": item.itemPrice ? item.itemPrice : "",
          "itemInspiration": item.itemInspiration ? item.itemInspiration : "",
          "fileName": file ? now + "-" + file.name : "",
          "contentType": file ? file.type.split("/")[1] : "",
          "fileSize": file ? file.size : "",
          "serviceContext": JSON.stringify({"userId":self.userService.currentUser.userId})
        }
      }
      const endpoint = this.api + "/invoke?cmd=" + JSON.stringify(map);
      var formData = new FormData();
      if (file) {
        formData.append('file', item.file);
      }
      self.http.post(endpoint, formData, {headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("add item alt returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

}