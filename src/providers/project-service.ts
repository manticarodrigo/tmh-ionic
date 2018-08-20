import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ENV } from '@env';

import { UserService } from './user-service';

@Injectable()
export class ProjectService {
  api: any;

  constructor(private http: Http,
              private userService: UserService) {
    this.api = this.userService.api;
  }

  fetchUserProjects() {
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/projects/me/`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log(res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  findByProjectId(id) {
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/projects/${id}/`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(res => {
          console.log('found project:', res);
          resolve(res);
        });
    });
  }

  fetchProjectDetails(projectId) {
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/details/project/?project=${projectId}`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(res => {
          console.log('found project details:', res);
          resolve(res);
        });
    });
  }

  updateStatus(project, status) {
    return new Promise((resolve, reject) => {
      console.log('updating project status:', status);
      this.http.patch(
        `${ENV.backendUrl}/api/v1/projects/${project.id}/`,
        { status },
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(res => {
          console.log('status update returned response:', res);
          resolve(res);
        });
    });
  }

  updateRevisionCount(project, status) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log('updating project status/revisionCount:');
      console.log(status);
      var endpoint = this.api + '/tmh-project-portlet.project//update-project-revision-count/projectId/' + project.projectId + '/userId/' + project.clientId + '/projectStatus/' + status + '/revisionCount/' + Number(project.revisionCount) + 1;
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log('status/revisionCount update returned response:');
        console.log(data);
        resolve(data);
      });
    });
  }

  updateDetailStatus(detail, status) {
    return new Promise((resolve, reject) => {
      console.log('updating detail status:', status);
      this.http.patch(
        `${ENV.backendUrl}/api/v1/details/${detail.id}/`,
        { status },
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(data => {
          console.log('detail update returned response:', data);
          resolve(data);
        });
    });
  }

  findByInProgress() {
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/projects/`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(projects => {
          console.log('found projects:', projects);
          resolve(projects);
        });
    });
  }

  findByComplete() {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        '$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-complete': {
          '$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id': {
            '@userId': '$project.clientId'
          }
        }
      }
      const endpoint = this.api + '/invoke?cmd=' + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(projects => {
        console.log('found projects:');
        console.log(projects);
        resolve(projects);
      });
    });
  }

  findByArchived() {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        '$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-archived': {
          // '$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id': {
          //   '@userId': '$project.clientId'
          // }
        }
      }
      const endpoint = this.api + '/invoke?cmd=' + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(projects => {
        console.log('found projects:');
        console.log(projects);
        resolve(projects);
      });
    });
  }

  findByUpNext() {
    const self = this;
    return new Promise((resolve, reject) => {
      const map = {
        '$project[projectId,createDate,endDate,modifiedDate,startDate,stripeChargeId,style,userId,videoUrl,zip,projectStatus,projectType,revisionCount,designerNote,finalNote] = /tmh-project-portlet.project/find-by-up-next': {
          '$client[firstName,lastName,emailAddress,portraitId,userId,createDate] = /user/get-user-by-id': {
            '@userId': '$project.clientId'
          }
        }
      }
      const endpoint = this.api + '/invoke?cmd=' + JSON.stringify(map);
      self.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(projects => {
        console.log('found projects:');
        console.log(projects);
        resolve(projects);
      });
    });
  }

  fetchItems(project) {
    return new Promise((resolve, reject) => {
      console.log('fetching items for project:', project.id);
      this.http.get(
        `${ENV.backendUrl}/api/v1/items/project/?project=${project.id}`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(data => {
          console.log('found project items:', data);
          resolve(data);
        });
    });
  }

  addDetail(project, file, type, status) {
    return new Promise((resolve, reject) => {
      const headers = this.userService.getHeaders();
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);
      formData.append('project', project.id);
      formData.append('status', status);
      this.http.post(
        `${ENV.backendUrl}/api/v1/details/`,
        formData,
        { headers }
      )
        .map(res => res.json())
        .subscribe(res => {
          console.log(res);
          resolve(res);
        });
    });
  }

  deleteDetail(project, detail) {
    console.log('deleting detail:', detail);
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + '/tmh-project-portlet.projectdetail/delete-project-detail/projectId/' + project.projectId + '/projectDetailId/' + detail.projectDetailId;
      this.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log('delete returned response:', data);
        resolve(data);
      });
    });
  }

  addItem(project, item) {
    return new Promise((resolve, reject) => {
      console.log('adding project item:', item);
      const headers = this.userService.getHeaders();
      const formData = new FormData();
      formData.append('status', 'PENDING');
      formData.append('image', item.image);
      formData.append('make', item.make);
      formData.append('type', item.type);
      formData.append('price', item.price);
      formData.append('inspiration', item.inspiration);
      formData.append('lat', item.lat);
      formData.append('lng', item.lng);
      formData.append('project', project.id);
      this.http.post(
        `${ENV.backendUrl}/api/v1/items/`,
        formData,
        { headers })
      .map(res => res.json())
      .subscribe(res => {
        console.log('add item returned response:', res);
        resolve(res);
      });
    });
  }

  updateItem(project, item, status) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log('updating project item:', item);
      const headers = self.userService.headers;
      headers.append('enctype', 'multipart/form-data');
      const now = new Date().getTime();
      const map = {
        '/tmh-project-portlet.projectitem/update-project-item': {
          'projectItemId': project.projectItemId,
          'projectItemStatus': status,
          'itemMake': item.itemMake ? item.itemMake : '',
          'itemType': item.itemType ? item.itemType : '',
          'itemPrice': item.itemPrice ? item.itemPrice : '',
          'itemInspiration': item.itemInspiration ? item.itemInspiration : '',
          'fileName': item.file ? now + '-' + item.file.name : '',
          'contentType': item.file ? item.file.type.split('/')[1] : '',
          'fileSize': item.file ? item.file.size : '',
          'serviceContext': JSON.stringify({'userId':self.userService.currentUser.userId})
        }
      }
      const endpoint = this.api + '/invoke?cmd=' + JSON.stringify(map);
      var formData = new FormData();
      if (item.file) {
        formData.append('file', item.file);
      }
      self.http.post(endpoint, formData, {headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log('update item returned response:');
        console.log(data);
        resolve(data);
      });
    });
  }

  updateItemStatus(item, status) {
    console.log('updating item status:');
    console.log(item);
    console.log(status);
    const self = this;
    return new Promise((resolve, reject) => {
      const endpoint = this.api + '/tmh-project-portlet.projectitem/update-project-item-status/projectItemId/' + item.projectItemId + '/userId/' + item.userId + '/projectItemStatus/' + status;
      this.http.get(endpoint, {headers: self.userService.headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log('update returned response:');
        console.log(data);
        resolve(data);
      });
    });
  }

  addAlternative(project, item, file, parentItem) {
    const self = this;
    return new Promise((resolve, reject) => {
      console.log('adding item alt:');
      console.log(project);
      console.log(item);
      console.log(file);
      console.log(parentItem);
      var headers = self.userService.headers;
      headers.append('enctype', 'multipart/form-data');
      const now = new Date().getTime();
      const map = {
        '/tmh-project-portlet.projectitem/add-project-item': {
          'projectId': project.projectId,
          'parentProjectItemId': parentItem.projectItemId,
          'projectItemStatus': 'ALTERNATE',
          'itemMake': item.itemMake ? item.itemMake : '',
          'itemType': item.itemType ? item.itemType : '',
          'itemPrice': item.itemPrice ? item.itemPrice : '',
          'itemInspiration': item.itemInspiration ? item.itemInspiration : '',
          'fileName': file ? now + '-' + file.name : '',
          'contentType': file ? file.type.split('/')[1] : '',
          'fileSize': file ? file.size : '',
          'serviceContext': JSON.stringify({'userId':self.userService.currentUser.userId})
        }
      }
      const endpoint = this.api + '/invoke?cmd=' + JSON.stringify(map);
      var formData = new FormData();
      if (file) {
        formData.append('file', item.file);
      }
      self.http.post(endpoint, formData, {headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log('add item alt returned response:');
        console.log(data);
        resolve(data);
      });
    });
  }

}