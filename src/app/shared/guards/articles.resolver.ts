import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { ArticleService } from "../services/article.service";

export const ArticlesResolve: ResolveFn<Object> = (route, state) => {
  return inject(ArticleService).getArticles();
}
