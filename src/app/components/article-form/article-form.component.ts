import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NavbarBackComponent } from "../../shared/components/navbar-back/navbar-back.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { take } from "rxjs";
import { IArticle, ICreateArticle, IUpdateArticle } from "../../shared/interfaces/iarticle";
import { ArticleService } from "../../shared/services/article.service";
import { MESSAGE_STATUS } from "../../shared/components/snackbar/enums/snackbar";
import { capitalizeFirstLetterWord, createTimer, getToken } from "../../shared/functions";
import { SnackbarComponent } from "../../shared/components/snackbar/snackbar.component";
import { jwtDecode } from "jwt-decode";
import { FormValidationsComponent } from "../../shared/components/form-validations/form-validations.component";
import { FormErrorMessages } from "../../shared/class/formErrorMessages";

const IMPORTS = [
  CommonModule,
  NavbarBackComponent,
  ReactiveFormsModule,
  SnackbarComponent,
  FormValidationsComponent
];

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './article-form.component.html',
  styleUrl: './article-form.component.scss',
  providers: [ArticleService]
})
export class ArticleFormComponent extends FormErrorMessages implements OnInit {
  articleForm!: FormGroup;
  articleData!: IArticle | any;
  private currentArticleId!: string;
  formStatus: Array<string> = [];
  messageStatus!: MESSAGE_STATUS;
  isUpdatedArticle: boolean = false;

  get user(): any {
    return jwtDecode(getToken());
  }

  get formControls(): any {
    this.groupErrorMessages = this.articleForm;
    return this.articleForm.controls;
  }

  get formRawValues() {
    return this.articleForm.getRawValue();
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly articleService: ArticleService
  ) {
    super();
    const article = this.activatedRoute.snapshot.data['article'];
    this.articleData = Array.isArray(article) ? null : article;
    this.currentArticleId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.articleForm = this.formBuilder.group({
      title: [this.articleData?.title || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]],
      content: [this.articleData?.content || '', [
        Validators.required,
        Validators.minLength(100),
      ]]
    });

    this.formControls;
  }

  private hiddenSnackbar() {
    createTimer(5000, () => this.formStatus = []);
  }

  private createArticle(value: ICreateArticle) {
    this.articleService
        .createArticle(value)
        .pipe(take(1))
        .subscribe({
          next: ({ message, isError }: any) => {
            this.messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
            this.formStatus = [message ? capitalizeFirstLetterWord(message) : 'Article created successfully.'];
            this.hiddenSnackbar();
            (!isError && this.articleForm.reset());
          },
          error: ({ error }) => {
            if (!error.message.length) return;
            this.messageStatus = MESSAGE_STATUS.error;
            this.formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
            this.hiddenSnackbar();
          }
        });
  }

  private updateArticle(articleId: string, value: IUpdateArticle) {
    this.articleService
        .updateArticle(articleId, value)
        .pipe(take(1))
        .subscribe({
          next: ({ message, isError }: any) => {
            this.messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
            this.formStatus = [message ? capitalizeFirstLetterWord(message) : 'Article updated successfully.'];
            this.hiddenSnackbar();
            this.isUpdatedArticle = true;
            createTimer(5000, () => this.isUpdatedArticle = false);
          },
          error: ({ error }) => {
            if (!error.message.length) return;
            this.messageStatus = MESSAGE_STATUS.error;
            this.formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
            this.hiddenSnackbar();
          }
        });
  }

  onSubmit() {
    const newBody = { ...this.formRawValues, userId: (this.user?.id || '') };

    if (this.currentArticleId === 'new') {
      this.createArticle(newBody);
    } else {
      this.updateArticle(this.currentArticleId, newBody);
    }
  }
}
