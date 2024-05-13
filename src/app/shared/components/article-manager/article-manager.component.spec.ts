import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ArticleManagerComponent } from './article-manager.component';
import { ArticleService } from '../../services/article.service';
import { of, throwError } from 'rxjs';
import { NgZone } from '@angular/core';
import { capitalizeFirstLetterWord, createTimer } from '../../functions';
import { MESSAGE_STATUS } from '../snackbar/enums/snackbar';

const IMPORTS = [
  CommonModule,
  RouterModule,
  FormsModule
];

describe('ArticleManagerComponent', () => {
  let component: ArticleManagerComponent;
  let fixture: ComponentFixture<ArticleManagerComponent>;
  let router: Router;
  let ngZone: NgZone;
  let articleService: ArticleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: ArticleService,
          useValue: {
            deleteArticle: jest.fn(() => of({}))
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    articleService = TestBed.inject(ArticleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    component.articles = [{ id: 0, title: 'Title', content: 'Content' }];
    component.isAdmin = false;

    expect(component.articles).toEqual([{ id: 0, title: 'Title', content: 'Content' }]);
    expect(component.isAdmin).toBeFalsy();
    expect(component.textToSearch).toBe('');
  });

  it('should navigate to create article page', () => {
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');

    ngZone.run(() => {
      component.navigateToCreateArticle(0);
    });

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/article-form/0');
  });

  it('should navigate to article page', () => {
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');

    ngZone.run(() => {
      component.navigateToArticle(0);
    });

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/article/0');
  });

  it('should perform the emitTextToSearch and output', () => {
    const emitTextToSearchSpy = jest.spyOn(component, 'emitTextToSearch');
    const emitSpy = jest.spyOn(component.onTextToSearch, 'emit');

    component.emitTextToSearch();

    expect(emitTextToSearchSpy).toHaveBeenCalled();

    createTimer(1000, () => {
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });


  it('should perform the onInputChangeSearch', () => {
    const onInputChangeSearchSpy = jest.spyOn(component, 'onInputChangeSearch');

    component.onInputChangeSearch({ value: 'text' });

    expect(onInputChangeSearchSpy).toHaveBeenCalled();
  });

  it('should perform the deleteArticle', () => {
    const deleteArticleSpy = jest.spyOn(component, 'deleteArticle');
    const ServiceDeleteArticleSpy = jest.spyOn(articleService, 'deleteArticle');
    const emitSpy = jest.spyOn(component.isDeletedArticle, 'emit');

    component.deleteArticle(0);

    createTimer(1000, () => {
      expect(deleteArticleSpy).toHaveBeenCalled();
      expect(ServiceDeleteArticleSpy).toHaveBeenCalledTimes(1);
      expect(ServiceDeleteArticleSpy).toHaveBeenCalledWith(0);
      expect(emitSpy).toHaveBeenCalledTimes(1);
    });
  });

  // Service - OK, OK, MAS ERROR e ERROR
  it('should correctly perform the deleteArticle', () => {
    const mockReturnValueArticleFixture = {
      message: 'Article deleted successfully.'
    };
    const deleteArticleSpy = jest.spyOn(articleService, 'deleteArticle')
                              .mockReturnValue(of(mockReturnValueArticleFixture));
    const emitSpy = jest.spyOn(component.isDeletedArticle, 'emit');

    articleService.deleteArticle('0').subscribe({
      next: ({ message, isError }: any) => {
        component.isDeletedArticle.emit({
          messageStatus: isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success,
          formStatus: message
        });
      }
    });

    expect(deleteArticleSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith({
      messageStatus: MESSAGE_STATUS.success,
      formStatus: 'Article deleted successfully.'
    });
  });

  it('should correctly perform the deleteArticle, but an error occurred', () => {
    const mockReturnValueArticleFixture = {
      message: 'Error when trying to delete article.',
      isError: true
    };
    const deleteArticleSpy = jest.spyOn(articleService, 'deleteArticle')
                              .mockReturnValue(of(mockReturnValueArticleFixture));
    const emitSpy = jest.spyOn(component.isDeletedArticle, 'emit');

    articleService.deleteArticle('0').subscribe({
      next: ({ message, isError }: any) => {
        component.isDeletedArticle.emit({
          messageStatus: isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success,
          formStatus: message
        });
      }
    });

    expect(deleteArticleSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy).toHaveBeenCalledWith({
      messageStatus: MESSAGE_STATUS.error,
      formStatus: 'Error when trying to delete article.'
    });
  });

  it('should incorrectly perform the deleteArticle', () => {
    const mockError = {
      "error": {
        "message": ["Article is invalid."]
      }
    };
    const deleteArticleSpy = jest.spyOn(articleService, 'deleteArticle')
                              .mockReturnValue(throwError(() => of(mockError)));
    const emitSpy = jest.spyOn(component.isDeletedArticle, 'emit');

    articleService.deleteArticle('0').subscribe({
      error: ({ error }) => {
        if (!error.message.length) return;
        component.isDeletedArticle.emit({
          messageStatus: MESSAGE_STATUS.error,
          formStatus: error.message.map((word: string) => capitalizeFirstLetterWord(word))
        });
      }
    });

    expect(deleteArticleSpy).toHaveBeenCalled();
    createTimer(1000, () => {
      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith({
        messageStatus: MESSAGE_STATUS.error,
        formStatus: 'Article is invalid.'
      });
    });
  });
});
