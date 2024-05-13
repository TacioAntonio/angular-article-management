import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SignFormComponent } from '../../shared/components/sign-form/sign-form.component';
import { submitType } from '../../shared/enums/submitType';
import { FormErrorMessages } from '../../shared/class/formErrorMessages';
import { SignUpService } from './sign-up.service';
import { HttpClientModule } from '@angular/common/http';
import { take } from 'rxjs';
import { capitalizeFirstLetterWord, createTimer } from '../../shared/functions';
import { MESSAGE_STATUS } from '../../shared/components/snackbar/enums/snackbar';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';

const IMPORTS = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  HttpClientModule,
  SignFormComponent,
  SnackbarComponent
];

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [SignUpService]
})
export class SignUpComponent extends FormErrorMessages implements OnInit {
  signUpForm!: FormGroup;
  formStatus: Array<string> = [];
  messageStatus!: MESSAGE_STATUS;
  readonly SUBMIT_TYPE: submitType = submitType.SIGN_UP;

  get formControls() {
    this.groupErrorMessages = this.signUpForm;
    return this.signUpForm.controls;
  }

  get formRawValues() {
    return this.signUpForm.getRawValue();
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly signUpService: SignUpService
  ) {
    super();
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]]
    });

    this.formControls;
  }

  private hiddenSnackbar() {
    createTimer(5000, () => this.formStatus = []);
  }

  onSubmit() {
    this.signUpService
        .createUser(this.formRawValues)
        .pipe(take(1))
        .subscribe({
          next: ({ message, isError }: any) => {
            this.messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
            this.formStatus = [message ? capitalizeFirstLetterWord(message) : 'User registered successfully.'];
            this.hiddenSnackbar();
            this.signUpForm.reset();
          },
          error: ({ error }) => {
            if (!error.message.length) return;
            this.messageStatus = MESSAGE_STATUS.error;
            this.formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
            this.hiddenSnackbar();
          }
        });
  }
}
