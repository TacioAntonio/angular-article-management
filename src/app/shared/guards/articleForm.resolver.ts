import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { ArticleService } from "../services/article.service";

export const ArticleFormResolve: ResolveFn<Object> = (route, state) => {
  const articleId = route.paramMap.get('id');

  if (articleId === 'new') {
    return [];
  }

  return inject(ArticleService).getArticle(articleId);
}
