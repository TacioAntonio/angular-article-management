import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { ArticleService } from '../../shared/services/article.service';
import { ArticleFormComponent } from './article-form.component';
import { FormValidationsComponent } from '../../shared/components/form-validations/form-validations.component';
import { NavbarBackComponent } from '../../shared/components/navbar-back/navbar-back.component';
import { capitalizeFirstLetterWord, createTimer, deleteLocalStorage, setLocalStorage } from '../../shared/functions';
import { FAKE_TOKEN } from '../../shared/fake_constants';
import { MESSAGE_STATUS } from '../../shared/components/snackbar/enums/snackbar';

const IMPORTS = [
  CommonModule,
  NavbarBackComponent,
  ReactiveFormsModule,
  SnackbarComponent,
  FormValidationsComponent,
  HttpClientTestingModule
];

class MockArticleForm {
  currentArticleId!: string;

  createArticle() {}
  updateArticle() {}

  onSubmit() {
    if (this.currentArticleId === 'new') {
      this.createArticle();
    } else {
      this.updateArticle();
    }
  }
}

describe('ArticleFormComponent', () => {
  let component: ArticleFormComponent;
  let articleService: ArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: ArticleService,
          useValue: {
            createArticle: jest.fn(() => of({})),
            updateArticle: jest.fn(() => of({}))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                id: ''
              },
              data: {
                articles: [],
              }
            }
          },
        }
      ]
    }).compileComponents();

    setLocalStorage('token', FAKE_TOKEN);
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(ArticleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    articleService = TestBed.inject(ArticleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    deleteLocalStorage('token');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    expect(component.articleForm).toBeDefined();
    expect(component.articleData).toBeUndefined();
    expect(component['currentArticleId']).toBe('');
    expect(component.formStatus).toEqual([]);
    expect(component.messageStatus).toBeUndefined();
    expect(component.isUpdatedArticle).toEqual(false);
  });

  it('should return user decoded from token', () => {
    const userFixture = {
      exp: 1715264875,
      iat: 1715261275,
      id: "8b7e0a97-3b29-444d-9874-517035e44f31",
      isAdmin: true,
      isAuth: true,
      username: "admin"
    };
    const result = component.user;

    expect(result).toEqual(userFixture);
  });


  it('should correctly return the controls of articleForm', () => {
    const controls = component.formControls;
    const articleFixture = {
      title: 'Title',
      content: 'Content'
    };

    component.articleForm.patchValue(articleFixture);

    expect(controls).toEqual(component.articleForm.controls);
  });

  it('should correctly return the getRawValue of articleForm', () => {
    const articleFixture = {
      title: 'Title',
      content: 'Content'
    };

    component.articleForm.patchValue(articleFixture);

    expect(component.formRawValues).toEqual(articleFixture);
  });

  it('should perform createArticle in onSubmit', () => {
    const createArticleSpy = jest.spyOn(component as any as MockArticleForm, 'createArticle');

    component['currentArticleId'] = 'new';
    component.onSubmit();

    createTimer(1000, () => {
      expect(createArticleSpy).toHaveBeenCalled();
    });
  });

  it('should perform updateArticle in onSubmit', () => {
    const updateArticleSpy = jest.spyOn(component as any as MockArticleForm, 'updateArticle');

    component.onSubmit();

    createTimer(1000, () => {
      expect(updateArticleSpy).toHaveBeenCalled();
    });
  });

  it('should perform the createArticle in articleService', () => {
    const articleFixture = {
      title: 'Title',
      content: 'Content',
      userId: 0
    };
    const mockReturnValueArticleFixture = {};
    const createArticleSpy = jest.spyOn(articleService, 'createArticle')
                              .mockReturnValue(of(mockReturnValueArticleFixture));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus: Array<string> = [];

    articleService.createArticle(articleFixture).subscribe({
      next: ({ message, isError }: any) => {
        messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
        formStatus = [message ? capitalizeFirstLetterWord(message) : 'Article created successfully.'];
        component['hiddenSnackbar'];
        component.articleForm.reset();
      }
    });

    expect(createArticleSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.success);
    expect(formStatus).toEqual(['Article created successfully.']);
    expect(component.formRawValues).toEqual({ title: null, content: null });
  });

  it('should perform the createArticle in articleService, but an error occurred', () => {
    const articleFixture = {
      title: 'Title',
      content: 'Content',
      userId: 0
    };
    const mockReturnValueArticleFixture = {
      message: 'Title is invalid.',
      isError: true
    };
    const createArticleSpy = jest.spyOn(articleService, 'createArticle')
                              .mockReturnValue(of(mockReturnValueArticleFixture));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus: Array<string> = [];

    articleService.createArticle(articleFixture).subscribe({
      next: ({ message, isError }: any) => {
        messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
        formStatus = [message ? capitalizeFirstLetterWord(message) : 'Article created successfully.'];
        component['hiddenSnackbar'];
        (!isError && component.articleForm.reset());
      }
    });

    expect(createArticleSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Title is invalid.']);
    expect(component.formRawValues).toEqual({ title: '', content: '' });
  });

  it('should incorrectly the createArticle in articleService', () => {
    const articleFixture = {
      title: 'Title',
      content: 'Content',
      userId: 0
    };
    const mockError = {
      "error": {
        "message": ["Title is invalid."]
      }
    };
    const createArticleSpy = jest.spyOn(articleService, 'createArticle')
                              .mockReturnValue(throwError(() => mockError));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus: Array<string> = [];

    articleService.createArticle(articleFixture).subscribe({
      error: ({ error }) => {
        if (!error.message.length) return;
        messageStatus = MESSAGE_STATUS.error;
        formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
        component['hiddenSnackbar'];
      }
    });

    expect(createArticleSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Title is invalid.']);
  });

  it('should perform the updateArticle in articleService', () => {
    const userIdFixture = '0';
    const articleFixture = {
      title: 'Title',
      content: 'Content'
    };
    const mockReturnValueArticleFixture = {};
    const updateArticleSpy = jest.spyOn(articleService, 'updateArticle')
                              .mockReturnValue(of(mockReturnValueArticleFixture));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus: Array<string> = [];

    articleService.updateArticle(userIdFixture, articleFixture).subscribe({
      next: ({ message, isError }: any) => {
        messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
        formStatus = [message ? capitalizeFirstLetterWord(message) : 'Article updated successfully.'];
        component['hiddenSnackbar']();
        component.isUpdatedArticle = true;
        createTimer(5000, () => component.isUpdatedArticle = false);
      }
    });

    expect(updateArticleSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.success);
    expect(formStatus).toEqual(['Article updated successfully.']);
    expect(component.isUpdatedArticle).toBeTruthy();
  });

  it('should perform the updateArticle in articleService, but an error occurred', () => {
    const userIdFixture = '0';
    const articleFixture = {
      title: 'Title',
      content: 'Content'
    };
    const mockReturnValueArticleFixture = {
      message: 'Title is invalid.',
      isError: true
    };
    const updateArticleSpy = jest.spyOn(articleService, 'updateArticle')
                              .mockReturnValue(of(mockReturnValueArticleFixture));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus: Array<string> = [];

    articleService.updateArticle(userIdFixture, articleFixture).subscribe({
      next: ({ message, isError }: any) => {
        messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
        formStatus = [message ? capitalizeFirstLetterWord(message) : 'Article updated successfully.'];
        component['hiddenSnackbar']();
        component.isUpdatedArticle = true;
        createTimer(5000, () => component.isUpdatedArticle = false);
      }
    });

    expect(updateArticleSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Title is invalid.']);
    expect(component.isUpdatedArticle).toBeTruthy();
  });


  it('should incorrectly the updateArticle in articleService', () => {
    const userIdFixture = '0';
    const articleFixture = {
      title: 'Title',
      content: 'Content'
    };
    const mockError = {
      "error": {
        "message": ["Title is invalid."]
      }
    };
    const updateArticleSpy = jest.spyOn(articleService, 'updateArticle')
                              .mockReturnValue(throwError(() => mockError));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus: Array<string> = [];

    articleService.updateArticle(userIdFixture, articleFixture).subscribe({
      error: ({ error }) => {
        if (!error.message.length) return;
        messageStatus = MESSAGE_STATUS.error;
        formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
        component['hiddenSnackbar'];
      }
    });

    expect(updateArticleSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Title is invalid.']);
  });
});
