import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Ett } from '../org.emission.network';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class EttService {

	
		private NAMESPACE: string = 'Ett';
	



    constructor(private dataService: DataService<Ett>) {
    };

    public getAll(): Observable<Ett[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Ett> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Ett> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Ett> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Ett> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
