import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavbarBackComponent } from "../../shared/components/navbar-back/navbar-back.component";
import { IArticle } from "../../shared/interfaces/iarticle";

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, NavbarBackComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent {
  article!: IArticle;

  constructor(private readonly activatedRoute: ActivatedRoute) {
    this.article = this.activatedRoute.snapshot.data['article'];
  }
}
