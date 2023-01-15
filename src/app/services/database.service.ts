import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { enviroment } from "src/enviroments/enviroments";


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(
    private _http: HttpClient
  ) {
    this.resize();
  }
  public screenSize: 'web' | 'mobile' | 'tablet' | 'tv' = 'web';

  public getDatabase(path: string, query: string = '') {
    return this._http.get(`${enviroment.URLBackend}${path}${query}`)
  }
  public postDatabase(path: string, data: any) {
    return this._http.post(`${enviroment.URLBackend}${path}/`, data)
  }
  public putDatabase(path: string, id: string, data: any) {
    return this._http.put(`${enviroment.URLBackend}${path}/${id}`, data)
  }
  public deleteDatabase(path: string, id: any) {
    return this._http.delete(`${enviroment.URLBackend}${path}/${id}`)
  }

  private resize() {
    const resizeVariation = () => {
      if (window.screen.width > 767 && window.screen.width <= 1099) this.screenSize = 'tablet'
      else if (window.screen.width <= 767) this.screenSize = 'mobile'
      else if (window.screen.width > 1099) this.screenSize = 'web'
    }
    resizeVariation();

    window.addEventListener('resize', resizeVariation)
  }

}
