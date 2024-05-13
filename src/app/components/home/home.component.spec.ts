import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { SignFormComponent } from '../../shared/components/sign-form/sign-form.component';
import { createTimer, deleteLocalStorage, setLocalStorage } from '../../shared/functions';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { MESSAGE_STATUS } from '../../shared/components/snackbar/enums/snackbar';
import { ArticleService } from '../../shared/services/article.service';
import { IArticle } from '../../shared/interfaces/iarticle';
import { FAKE_TOKEN } from '../../shared/fake_constants';
import { HomeComponent } from './home.component';

const IMPORTS = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  SignFormComponent,
  SnackbarComponent,
  HttpClientTestingModule
];

describe('HomeComponent', () => {
  let component: HomeComponent;
  let articleService: ArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: ArticleService,
          useValue: {
            getArticles: jest.fn(() => of({}))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
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
    const fixture = TestBed.createComponent(HomeComponent);
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
    expect(component.articles).toEqual([]);
    expect(component.filteredArticles).toEqual([]);
    expect(component.formStatus).toEqual([]);
    expect(component.messageStatus).toBeUndefined();
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

  it('should return isAdmin decoded from token', () => {
    const result = component.isAdmin;

    expect(result).toBeTruthy();
  });

  it('should return handledArticles as empty array', () => {
    const result = component.handledArticles;

    expect(result).toEqual([]);
  });

  it('should perform the getArticles', () => {
    const getArticlesSpy = jest.spyOn(component, 'getArticles');
    const getArticlesServiceSpy = jest.spyOn(articleService, 'getArticles');

    component.getArticles();

    createTimer(1000, () => {
      expect(getArticlesSpy).toHaveBeenCalled();
      expect(getArticlesServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should perform the getArticles service', () => {
    const mockArticles = [
      { title: 'Title 1', content: 'Content 1' },
      { title: 'Title 2', content: 'Content 2' }
    ];
    const articleServiceSpy = jest.spyOn(articleService, 'getArticles')
                                  .mockReturnValue(of(mockArticles));
    let articles: Array<IArticle> | any = [];
    let filteredArticles: Array<IArticle> | any = [];

    articleService.getArticles().subscribe({
      next: data => {
        articles = data;
        filteredArticles = data;
      }
    });

    expect(articleServiceSpy).toHaveBeenCalled();
    expect(articles).toEqual(mockArticles);
    expect(filteredArticles).toEqual(mockArticles);
  });

  it('should perform the handleArticleFiltering', () => {
    const handleArticleFilteringSpy = jest.spyOn(component, 'handleArticleFiltering');

    component.handleArticleFiltering('title');

    expect(handleArticleFilteringSpy).toHaveBeenCalled();
  });

  it('should perform the handleSnackbar', () => {
    const mockEvent = {
      messageStatus: MESSAGE_STATUS.success,
      formStatus: ['Success']
    }
    const handleSnackbarSpy = jest.spyOn(component, 'handleSnackbar');

    component.handleSnackbar(mockEvent);

    expect(handleSnackbarSpy).toHaveBeenCalled();
  });
});
