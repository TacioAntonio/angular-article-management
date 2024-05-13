import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { ArticleService } from "../services/article.service";

export const ArticleByIdResolve: ResolveFn<Object> = (route, state) => {
  const articleId: string | null = route.paramMap.get('id');
  return inject(ArticleService).getArticle(articleId);
}
