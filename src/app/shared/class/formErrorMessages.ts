import { FormGroup } from "@angular/forms";

export class FormErrorMessages {
  get usernameErrorMessages() {
    return [
      { required: 'Username is required.' },
      { minlength: 'The username must be at least 3 characters long.' },
      { maxlength: 'Username cannot exceed 8 characters.' },
      { pattern: 'Username must contain only letters.' }
    ];
  }

  get emailErrorMessages() {
    return [
      { required: 'Email is required.' },
      { email: 'Invalid e-mail.' }
    ];
  }

  get passwordErrorMessages() {
    return [
      { required: 'Password is required.' },
      { minlength: 'The password must be at least 6 characters long.' },
      { maxlength: 'Username cannot exceed 12 characters.' },
      { pattern: 'The password must contain at least one lowercase letter, one uppercase letter, one number and one symbol.' }
    ];
  }

  get titleErrorMessages() {
    return [
      { required: 'Title is required.' },
      { minlength: 'The title must be at least 3 characters long.' },
      { maxlength: 'Title cannot exceed 15 characters.' }
    ];
  }

  get contentErrorMessages() {
    return [
      { required: 'Content is required.' },
      { minlength: 'The content must be at least 100 characters long.' }
    ];
  }

  set groupErrorMessages(signInForm: FormGroup) {
    Object.keys(signInForm.controls).forEach(eachKey => {
      let formControl: any = signInForm.controls[eachKey];

      switch (eachKey) {
        case 'username':
          formControl['errorMessages'] = this.usernameErrorMessages;
          break;
        case 'email':
          formControl['errorMessages'] = this.emailErrorMessages;
          break;
        case 'password':
          formControl['errorMessages'] = this.passwordErrorMessages;
          break;
        case 'title':
          formControl['errorMessages'] = this.titleErrorMessages;
          break;
        case 'content':
          formControl['errorMessages'] = this.contentErrorMessages;
          break;
        break;
      }
    });
  }
}
