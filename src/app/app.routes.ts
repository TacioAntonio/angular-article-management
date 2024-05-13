import { Routes } from '@angular/router';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { ArticleComponent } from './components/article/article.component';
import { ArticleFormComponent } from './components/article-form/article-form.component';
import { AuthenticateGuard } from './shared/guards/authenticate.guard';
import { AuthorizationGuard } from './shared/guards/authorization.guard';
import { ArticleByIdResolve } from './shared/guards/articleById.resolver';
import { ArticlesResolve } from './shared/guards/articles.resolver';
import { ArticleFormResolve } from './shared/guards/articleForm.resolver';
import { Error404Component } from './core/error404/error404.component';

export const routes: Routes = [
  {
    path: 'article-form/:id',
    component: ArticleFormComponent,
    canActivate: [
      AuthenticateGuard,
      AuthorizationGuard
    ],
    resolve: {
      article: ArticleFormResolve
    }
  },
  {
    path: 'article/:id',
    component: ArticleComponent,
    canActivate: [AuthenticateGuard],
    resolve: {
      article: ArticleByIdResolve
    }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticateGuard],
    resolve: {
      articles: ArticlesResolve
    }
  },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: '**', component: Error404Component }
];
