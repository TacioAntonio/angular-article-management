import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { InputFieldGroupComponent } from './input-field-group.component';
import { CommonModule } from '@angular/common';
import { FormValidationsComponent } from '../form-validations/form-validations.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const IMPORTS = [
  CommonModule,
  FormValidationsComponent
];

describe('InputFieldGroupComponent', () => {
  let component: InputFieldGroupComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(InputFieldGroupComponent);
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
    component.field = 'password';
    component.errorMessages = [{ password: 'Password is invalid.' }];

    expect(component.field).toBe('password');
    expect(component.errorMessages).toEqual([{ password: 'Password is invalid.' }]);
  });
});
