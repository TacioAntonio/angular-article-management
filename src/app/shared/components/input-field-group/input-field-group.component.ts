import { Component, Input } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { FormValidationsComponent } from "../form-validations/form-validations.component";
import { CommonModule } from "@angular/common";
import { IValidationMessage } from "../form-validations/interfaces";

@Component({
  selector: 'app-input-field-group',
  standalone: true,
  imports: [CommonModule, FormValidationsComponent],
  templateUrl: './input-field-group.component.html'
})
export class InputFieldGroupComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) field!: string;
  @Input() errorMessages!: Array<IValidationMessage>;

  get getFieldControl(): AbstractControl | null {
    return this.formGroup.get(this.field);
  }
}
