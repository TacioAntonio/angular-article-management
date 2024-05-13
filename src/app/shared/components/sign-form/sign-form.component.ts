import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormValidationsComponent } from '../form-validations/form-validations.component';
import { submitType } from '../../enums/submitType';
import { InputFieldGroupComponent } from '../input-field-group/input-field-group.component';

@Component({
  selector: 'app-sign-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormValidationsComponent, InputFieldGroupComponent],
  templateUrl: './sign-form.component.html',
  styleUrl: './sign-form.component.scss',
})
export class SignFormComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) submitType!: submitType;
  @Input({ required: true }) submitTitle!: string;
  @Input({ required: true }) linkURL!: string;
  @Input({ required: true }) linkTitle!: string;
  @Output() submitForm: EventEmitter<void> = new EventEmitter<void>();
  inputTypes: any = {
    'email': 'email',
    'password': 'password'
  }

  get formControls(): any {
    return this.formGroup.controls;
  }

  get formControlsFields() {
    return Object.keys(this.formControls);
  }

  onSubmit() {
    this.submitForm.emit();
  }
}
