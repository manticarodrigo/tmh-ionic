import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ENV } from '@env';

import { UserService } from './user-service';

@Injectable()
export class ProjectService {
  api: any;
  types = {
    BEDROOM: 'Bedroom',
    LIVING_ROOM: 'Living Room',
    MULTIPURPOSE_ROOM: 'Multipurpose Room',
    STUDIO: 'Studio',
    DINING_ROOM: 'Dining Room',
    HOME_OFFICE: 'Office'
  };
  statuses = {
    DETAILS: 'Details',
    DESIGN: 'Design',
    CONCEPTS: 'Concepts',
    FLOOR_PLAN: 'Floor Plan',
    REQUEST_ALTERNATIVES: 'Request Alternatives',
    ALTERNATIVES_READY: 'Alternatives Ready',
    FINAL_DELIVERY: 'Final Delivery',
    SHOPPING_CART: 'Shopping Cart',
    ESTIMATE_SHIPPING_AND_TAX: 'Estimate Shipping & Tax',
    CHECKOUT: 'Checkout',
    ARCHIVED: 'Archived'
  };

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
        .subscribe(
          res => {
            console.log('found project:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  fetchProjectDetails(projectId) {
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/details/project/?project=${projectId}`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('found project details:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
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
        .subscribe(
          res => {
            console.log('status update returned response:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  updateRevisionCount(project, status) {
    return new Promise((resolve, reject) => {
      console.log('updating project revision count:', status, project.revision_count);
      this.http.patch(
        `${ENV.backendUrl}/api/v1/projects/${project.id}/`,
        {
          status,
          revision_count: project.revision_count + 1
        },
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('revision count update returned response:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
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
        .subscribe(
          res => {
            console.log('detail update returned response:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  findByInProgress() {
    // TODO: get by status
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/projects/`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('found projects:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  findByComplete() {
    // TODO: get by status
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/projects/`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('found projects:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  findByArchived() {
    // TODO: get by status
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/projects/`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('found projects:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  findByUpNext() {
    // TODO: get by status
    return new Promise((resolve, reject) => {
      this.http.get(
        `${ENV.backendUrl}/api/v1/projects/`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('found projects:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
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
        .subscribe(
          res => {
            console.log('found project items:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
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

  deleteDetail(detail) {
    console.log('deleting detail:', detail);
    return new Promise((resolve, reject) => {
      this.http.delete(
        `${ENV.backendUrl}/api/v1/details/${detail.id}/`,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('delete returned response:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  addItem(project, item) {
    return new Promise((resolve, reject) => {
      console.log('adding project item:', item);
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
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('add item returned response:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  updateItem(project, item, status) {
    return new Promise((resolve, reject) => {
      console.log('updating project item:', item);
      const formData = new FormData();
      formData.append('status', status);
      if (typeof item.image.name === 'string') {
        // new file added
        formData.append('image', item.image);
      }
      formData.append('make', item.make);
      formData.append('type', item.type);
      formData.append('price', item.price);
      formData.append('inspiration', item.inspiration);
      formData.append('lat', item.lat);
      formData.append('lng', item.lng);
      formData.append('project', project.id);
      this.http.patch(
        `${ENV.backendUrl}/api/v1/items/${item.id}/`,
        formData,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('update item returned response:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  updateItemStatus(item, status) {
    console.log('updating item status:', item, status);
    return new Promise((resolve, reject) => {
      this.http.patch(
        `${ENV.backendUrl}/api/v1/items/${item.id}/`,
        { status },
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('update returned response:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  addAlternative(project, alt, image, parent) {
    return new Promise((resolve, reject) => {
      console.log('adding item alt:', project, alt, image, parent);
      const formData = new FormData();
      formData.append('status', 'ALTERNATE');
      formData.append('image', image);
      formData.append('make', alt.make);
      formData.append('type', alt.type);
      formData.append('price', alt.price);
      formData.append('inspiration', alt.inspiration);
      formData.append('lat', alt.lat);
      formData.append('lng', alt.lng);
      formData.append('project', project.id);
      formData.append('parent', parent.id);
      this.http.post(
        `${ENV.backendUrl}/api/v1/items/`,
        formData,
        { headers: this.userService.getHeaders() }
      )
        .map(res => res.json())
        .subscribe(
          res => {
            console.log('add item alt returned response:', res);
            resolve(res);
          },
          err => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

}