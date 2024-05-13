import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IArticle } from "../../interfaces/iarticle";
import { Router, RouterModule } from "@angular/router";
import { ArticleService } from "../../services/article.service";
import { Subject, Subscription, take } from "rxjs";
import { MESSAGE_STATUS } from "../snackbar/enums/snackbar";
import { capitalizeFirstLetterWord } from "../../functions";
import { FormsModule } from "@angular/forms";
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-article-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './article-manager.component.html',
  styleUrl: './article-manager.component.scss'
})
export class ArticleManagerComponent {
  @Input({ required: true }) articles: Array<IArticle> = [];
  @Input({ required: true }) isAdmin!: boolean;
  @Output() isDeletedArticle: EventEmitter<any> = new EventEmitter<any>();
  @Output() onTextToSearch: EventEmitter<string> = new EventEmitter<string>();
  textToSearch: string = '';
  private textToSearchChange: Subject<string> = new Subject<string>();
  private subscription: Subscription | undefined;

  constructor(
    private readonly router: Router,
    private readonly articleService: ArticleService
  ) {}

  ngOnInit(): void {
    this.emitTextToSearch();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  navigateToCreateArticle(articleId: number | string) {
    this.router.navigateByUrl(`/article-form/${articleId}`);
  }

  navigateToArticle(articleId: number) {
    this.router.navigateByUrl(`/article/${articleId}`);
  }

  emitTextToSearch() {
    this.subscription = this.textToSearchChange
                            .pipe(debounceTime(1000))
                            .subscribe((value: string) => {
                              this.onTextToSearch.emit(value);
                            });
  }

  onInputChangeSearch({ value }: any) {
    this.textToSearchChange.next(value);
  }

  deleteArticle(articleId: number | string) {
    this.articleService
        .deleteArticle(articleId.toString())
        .pipe(take(1))
        .subscribe({
          next: ({ message, isError }: any) => {
            this.isDeletedArticle.emit({
              messageStatus: isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success,
              formStatus: message
            });
          },
          error: ({ error }) => {
            if (!error.message.length) return;
            this.isDeletedArticle.emit({
              messageStatus: MESSAGE_STATUS.error,
              formStatus: error.message.map((word: string) => capitalizeFirstLetterWord(word))
            });
          }
        });
  }
}
