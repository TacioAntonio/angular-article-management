import { ActivatedRoute, RouterModule, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SignFormComponent } from '../../shared/components/sign-form/sign-form.component';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { MESSAGE_STATUS } from '../../shared/components/snackbar/enums/snackbar';
import { capitalizeFirstLetterWord, createTimer } from '../../shared/functions';
import { submitType } from '../../shared/enums/submitType';
import { SignUpComponent } from './sign-up.component';
import { SignUpService } from './sign-up.service';

const IMPORTS = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  SignFormComponent,
  SnackbarComponent,
  HttpClientTestingModule
];

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let signUpService: SignUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: SignUpService,
          useValue: {
            createUser: jest.fn(() => of({}))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new BehaviorSubject(convertToParamMap({})),
          },
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    signUpService = TestBed.inject(SignUpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    expect(component.signUpForm).toBeDefined();
    expect(component.formStatus).toEqual([]);
    expect(component.messageStatus).toBeUndefined();
    expect(component.SUBMIT_TYPE).toEqual(submitType.SIGN_UP);
  });

  it('should correctly return the controls of signUpForm', () => {
    const controls = component.formControls;
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };

    component.signUpForm.patchValue(userFixture);

    expect(controls).toEqual(component.signUpForm.controls);
  });

  it('should correctly return the getRawValue of signUpForm', () => {
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };

    component.signUpForm.patchValue(userFixture);

    expect(component.formRawValues).toEqual(userFixture);
  });

  it('should perform the submit', () => {
    const onSubmitSpy = jest.spyOn(component, 'onSubmit');
    const createUserSpy = jest.spyOn(signUpService, 'createUser');

    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };

    component.signUpForm.patchValue(userFixture);

    component.onSubmit();

    createTimer(1000, () => {
      expect(onSubmitSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(userFixture);
      expect(component['hiddenSnackbar']).toHaveBeenCalledTimes(1);
      expect(component.formRawValues).toEqual({ username: '', email: '', password: '' });
    });
  });

  it('should correctly perform the createUser', () => {
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };
    const mockReturnValueUserFixture = {
      "username": "admin",
      "email": "admin@gmail.com",
      "password": "$2b$10$TG43df/p253qifPUr8JDMuwvgQArxok5GPmIKHcEZ56nzMoGGwUEW",
      "id": "582f69cd-c0f4-42a0-9501-135bdabac302",
      "isAdmin": false
    };
    const createUserSpy = jest.spyOn(signUpService, 'createUser')
                              .mockReturnValue(of(mockReturnValueUserFixture));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    signUpService.createUser(userFixture).subscribe({
      next: ({ message, isError }: any) => {
        messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
        formStatus = [message ? capitalizeFirstLetterWord(message) : 'User registered successfully.'];
      }
    });

    expect(createUserSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.success);
    expect(formStatus).toEqual(['User registered successfully.']);
  });


  it('should correctly perform the createUser, but an error occurred', () => {
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };
    const mockReturnValueUserFixture = {
      message: 'Email already exists.',
      isError: true
    };
    const createUserSpy = jest.spyOn(signUpService, 'createUser')
                              .mockReturnValue(of(mockReturnValueUserFixture));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    signUpService.createUser(userFixture).subscribe({
      next: ({ message, isError }: any) => {
        messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
        formStatus = [message ? capitalizeFirstLetterWord(message) : 'User registered successfully.'];
      }
    });

    expect(createUserSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Email already exists.']);
  });

  it('should incorrectly perform the createUser', () => {
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };
    const mockError = {
      "error": {
        "message": ["Email already exists."]
      }
    };
    const createUserSpy = jest.spyOn(signUpService, 'createUser')
                              .mockReturnValue(throwError(() => mockError));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    signUpService.createUser(userFixture).subscribe({
      error: ({ error }) => {
        if (!error.message.length) return;
        messageStatus = MESSAGE_STATUS.error;
        formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
      }
    });

    expect(createUserSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Email already exists.']);
  });
});
