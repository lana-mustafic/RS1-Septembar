import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import {
  ListProformasRequest,
  ListProformasResponse,
} from './proformas-api.models';

@Injectable({ providedIn: 'root' })
export class ProformasApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/Proformas`;

  list(request: ListProformasRequest): Observable<ListProformasResponse> {
    return this.http.get<ListProformasResponse>(this.baseUrl, {
      params: buildHttpParams(request as any),
    });
  }


  // TODO (student): POST /Proformas - slanje predracuna sa stavkama.
}
