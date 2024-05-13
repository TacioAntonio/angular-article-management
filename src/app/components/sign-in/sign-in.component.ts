import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { submitType } from '../../shared/enums/submitType';
import { SignFormComponent } from '../../shared/components/sign-form/sign-form.component';
import { FormErrorMessages } from '../../shared/class/formErrorMessages';
import { HttpClientModule } from '@angular/common/http';
import { SignInService } from './sign-in.service';
import { take } from 'rxjs';
import { MESSAGE_STATUS } from '../../shared/components/snackbar/enums/snackbar';
import { capitalizeFirstLetterWord, createTimer, setLocalStorage } from '../../shared/functions';
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
  selector: 'app-sign-in',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [SignInService]
})
export class SignInComponent extends FormErrorMessages implements OnInit {
  signInForm!: FormGroup;
  formStatus: Array<string> = [];
  messageStatus!: MESSAGE_STATUS;
  readonly SUBMIT_TYPE: submitType = submitType.SIGN_IN;

  get formControls() {
    this.groupErrorMessages = this.signInForm;
    return this.signInForm.controls;
  }

  get formRawValues() {
    return this.signInForm.getRawValue();
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly signInService: SignInService,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
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
    this.signInService
        .signIn(this.formRawValues)
        .pipe(take(1))
        .subscribe({
          next: ({ token, message, isError }: any) => {
            if (isError) {
              this.messageStatus = MESSAGE_STATUS.error;
              this.formStatus = [message && capitalizeFirstLetterWord(message)];
            } else {
              setLocalStorage('token', token);
              this.router.navigateByUrl('/home');
            }
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
