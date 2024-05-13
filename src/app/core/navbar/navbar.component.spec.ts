import { Router, RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { SignInComponent } from '../../components/sign-in/sign-in.component';
import { deleteLocalStorage, setLocalStorage } from '../../shared/functions';
import { FAKE_TOKEN } from '../../shared/fake_constants';
import { NgZone } from '@angular/core';

const IMPORTS = [
  CommonModule,
  RouterModule.forRoot([
    { path: 'sign-in', component: SignInComponent }
  ])
];

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let router: Router;
  let ngZone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS]
    }).compileComponents();

    setLocalStorage('token', FAKE_TOKEN);
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  beforeEach(() => {
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
  });

  afterEach(() => {
    jest.clearAllMocks();
    deleteLocalStorage('token');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
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

  it('should return username decoded from token', () => {
    const result = component.username;

    expect(result).toBe("admin");
  });

  it('should perform signOut correctly', () => {
    const signOutSpy = jest.spyOn(component, 'signOut');
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');

    ngZone.run(() => {
      component.signOut();
    });

    expect(signOutSpy).toHaveBeenCalled();
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/sign-in');
  });
});
