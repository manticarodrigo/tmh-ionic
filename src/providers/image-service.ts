import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

import { UserService } from './user-service';

@Injectable()
export class ImageService {
  api: any;

  constructor(private http: Http,
              private platform: Platform,
              private userService: UserService) {
    if (this.platform.is('cordova')) {
      this.api = 'http://stage.themanhome.com/api/jsonws';
    } else {
      this.api = '/api';
    }
  }

  createFileUrl(data) {
    const repositoryId = data.repositoryId;
    const folderId = data.folderId;
    const title = data.title;
    const uuid = data.uuid;
    const version = data.version;
    const createDate = data.createDate;
    return "http://stage.themanhome.com/documents/" + repositoryId + "/" + folderId + "/" + title + "/" + uuid + "?version=" + version + "&t=" + createDate;
  }

  imageForUser(user) {
    const self = this;
    const headers = this.userService.headers;
    return new Promise((resolve, reject) => {
      self.getImage(user.portraitId, headers, (data) => {
        if (data) {
          console.log("fetched user portrait data:");
          console.log(data);
          var photoURL = "http://stage.themanhome.com/image/user_male_portrait?img_id=" + user.portraitId;
          if (data.modifiedDate) {
            photoURL = photoURL + '&t=' + data.modifiedDate;
          }
          resolve(photoURL);
        } else {
          console.log("no image found");
          resolve(null);
        }
      });
    });
  }

  getImage(id, headers, callback) {
    console.log("Fetching image with id:");
    console.log(id);
    if (!id || id == 0) {
     callback(null);
    } else {
      const endpoint = this.api + "/image/get-image/imageId/" + id;
      this.http.get(endpoint, {headers: headers})
      .map(res => res.json())
      .subscribe(img => {
        console.log("Found image:");
        console.log(img);
        callback(img);
      })
    }
  }

  uploadFile(file, project) {
    console.log("uploading file in general folder:");
    console.log(file);
    const self = this;
    const headers = this.userService.headers;
    return new Promise((resolve, reject) => {
      headers.append("enctype", "multipart/form-data");
      let now = new Date();
      const endpoint = this.userService.api + "/dlapp/add-file-entry.9/repositoryId/" + 20484 + "/folderId/" + 0 + "/title/" + now.getTime() + ".jpg";
      var formData = new FormData();
      formData.append('file', file);
      this.http.post(endpoint, formData, {headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("upload returned response:");
        console.log(data);
        resolve(data);
      });
    });
  }

  getFileEntry(fileEntryId) {
    const self = this;
    const headers = this.userService.headers;
    console.log(headers);
    return new Promise((resolve, reject) => {
      console.log("fetching file with entry id:");
      console.log(fileEntryId);
      const endpoint = this.api + "/dlfileentry/get-file-entry/fileEntryId/" + fileEntryId;
      self.http.get(endpoint, {headers: headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log("found file data:");
        console.log(data);
        if (!data.exception) {
          data.url = self.createFileUrl(data);
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

}
