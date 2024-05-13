import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SignFormComponent } from './sign-form.component';
import { ActivatedRoute, RouterModule, convertToParamMap } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidationsComponent } from '../form-validations/form-validations.component';
import { InputFieldGroupComponent } from '../input-field-group/input-field-group.component';
import { BehaviorSubject } from 'rxjs';
import { submitType } from '../../enums/submitType';

const IMPORTS = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormValidationsComponent,
  InputFieldGroupComponent
];

describe('SignFormComponent', () => {
  let component: SignFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
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
    const fixture = TestBed.createComponent(SignFormComponent);
    component = fixture.componentInstance;

    component.formGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    component.title = 'title';
    component.submitType = submitType.SIGN_IN;
    component.submitTitle = 'submitTitle';
    component.linkURL = 'linkURL';
    component.linkTitle = 'linkTitle';

    expect(component.title).toBe('title');
    expect(component.submitType).toBe(submitType.SIGN_IN);
    expect(component.linkURL).toBe('linkURL');
    expect(component.linkTitle).toBe('linkTitle');
  });

  it('should correctly return the controls of signForm', () => {
    const controls = component.formControls;
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };

    component.formGroup.patchValue(userFixture);

    expect(controls).toEqual(component.formGroup.controls);
  });


  it('should correctly return the formControlsFields of signForm', () => {
    const formControlsFields = component.formControlsFields;
    const formControlsFieldsFixture = ['username', 'email', 'password']

    expect(formControlsFields).toEqual(formControlsFieldsFixture);
  });

  it('should perform the submit and output', () => {
    const onSubmitSpy = jest.spyOn(component, 'onSubmit');
    const emitSpy = jest.spyOn(component.submitForm, 'emit');

    component.onSubmit();

    expect(onSubmitSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
