import { TestBed } from '@angular/core/testing';
import { NavbarBackComponent } from './navbar-back.component';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

describe('SnackbarComponent', () => {
  let component: NavbarBackComponent;
  let router: Router;
  let ngZone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(NavbarBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    component.URL = '/home';

    expect(component.URL).toBe('/home');
  });

  it('should navigate to a specific page', () => {
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');

    component.URL = '/home';
    ngZone.run(() => {
      component.navigateTo();
    });

    expect(navigateByUrlSpy).toHaveBeenCalledWith('/home');
  });
});
