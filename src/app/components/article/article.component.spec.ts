import { ActivatedRoute } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NavbarBackComponent } from '../../shared/components/navbar-back/navbar-back.component';
import { ArticleComponent } from './article.component';

const IMPORTS = [
  CommonModule,
  NavbarBackComponent
];

describe('ArticleComponent', () => {
  let component: ArticleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                article: {},
              }
            }
          },
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
