import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { jwtDecode } from "jwt-decode";
import { ArticleManagerComponent } from "../../shared/components/article-manager/article-manager.component";
import { ArticleService } from "../../shared/services/article.service";
import { createTimer, getToken } from "../../shared/functions";
import { ActivatedRoute } from "@angular/router";
import { IArticle } from "../../shared/interfaces/iarticle";
import { take } from "rxjs";
import { MESSAGE_STATUS } from "../../shared/components/snackbar/enums/snackbar";
import { SnackbarComponent } from "../../shared/components/snackbar/snackbar.component";
import { NavbarComponent } from "../../core/navbar/navbar.component";

const IMPORTS = [
  CommonModule,
  ArticleManagerComponent,
  HttpClientModule,
  SnackbarComponent,
  NavbarComponent
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  articles: Array<IArticle> | any = [];
  filteredArticles: Array<IArticle> | any = [];
  formStatus: Array<string> = [];
  messageStatus!: MESSAGE_STATUS;

  get user(): any {
    return jwtDecode(getToken());
  }

  get isAdmin() {
    return this.user?.isAdmin;
  }

  get handledArticles() {
    return [...this.filteredArticles].reverse();
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly articleService: ArticleService
  ) {
    this.articles = this.activatedRoute.snapshot.data['articles'];
    this.filteredArticles = this.articles;
  }

  private hiddenSnackbar() {
    createTimer(5000, () => this.formStatus = []);
  }

  getArticles() {
    this.articleService.getArticles()
                       .pipe(take(1))
                       .subscribe(articles => {
                          this.articles = articles;
                          this.filteredArticles = articles;
                       });
  }

  handleArticleFiltering(value: string) {
    this.filteredArticles = this.articles.filter(({ title }: IArticle) => title.toLowerCase().includes(value.toLowerCase()));
  }

  handleSnackbar(event: any) {
    this.messageStatus = event?.messageStatus || '';
    this.formStatus = [event?.formStatus] || [];
    this.hiddenSnackbar();
  }
}
