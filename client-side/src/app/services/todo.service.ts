import { Injectable } from '@angular/core';
import { AddonService } from './addon.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private addonService: AddonService
  ) { }

  getTodos(){
    return this.addonService.papiClient.addons.api.uuid(this.addonService.addonUUID).file('api').func('todos').get();
  }
  deleteTodos(objs){
    return this.addonService.papiClient.addons.api.uuid(this.addonService.addonUUID).file('api').func('delete_todos').post({}, this.extractKeys(objs));
  }
  completeTodos(objs){
    return this.addonService.papiClient.addons.api.uuid(this.addonService.addonUUID).file('api').func('complete_todos').post({}, this.extractKeys(objs));
  }
  extractKeys(objs) {
    let keys = [];
    objs.forEach(element => {
      keys.push(element.Key)
    });
    return keys;
  }
}
