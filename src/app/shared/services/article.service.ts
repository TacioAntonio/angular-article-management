import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../shared/contants';
import { getToken } from '../functions';
import { ICreateArticle, IUpdateArticle } from '../interfaces/iarticle';

@Injectable()
export class ArticleService {
  private readonly API_URL = API_URL;

  constructor(private readonly http: HttpClient) {}

  getArticles() {
    return this.http.get(`${this.API_URL}/articles`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  getArticle(articleId: string | null) {
    return this.http.get(`${this.API_URL}/article?id=${articleId}`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  createArticle(body: ICreateArticle) {
    return this.http.post(`${this.API_URL}/article`, body, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  updateArticle(articleId: string, body: IUpdateArticle) {
    return this.http.put(`${this.API_URL}/article?id=${articleId}`, body, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  deleteArticle(articleId: string | null) {
    return this.http.delete(`${this.API_URL}/article?id=${articleId}`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }
}
