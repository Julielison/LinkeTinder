import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.css']
})
export class EmpresaFormComponent {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() voltarClick = new EventEmitter<void>();
  @Output() loginClick = new EventEmitter<void>();
  
  empresaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.empresaForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      nomeEmpresa: ['', [Validators.required]],
      local: ['', [Validators.required]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.empresaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.empresaForm.valid) {
      const formData = {
        ...this.empresaForm.value,
        userType: 'empresa'
      };
      this.formSubmit.emit(formData);
    } else {
      Object.keys(this.empresaForm.controls).forEach(key => {
        this.empresaForm.get(key)?.markAsTouched();
      });
    }
  }

  onVoltarClick() {
    this.voltarClick.emit();
  }

  onLoginClick() {
    this.loginClick.emit();
  }
}
