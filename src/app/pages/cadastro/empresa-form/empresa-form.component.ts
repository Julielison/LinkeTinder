import { Component, inject, signal, computed, output } from '@angular/core';
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
  private fb = inject(FormBuilder);

  // Usando a nova sintaxe output()
  formSubmit = output<any>();
  voltarClick = output<void>();
  loginClick = output<void>();

  empresaForm: FormGroup;
  isSubmitting = signal(false);

  // Computed signals para validação
  isFormValid = computed(() => this.empresaForm?.valid || false);

  constructor() {
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

  getFieldErrorMessage(fieldName: string): string {
    const field = this.empresaForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    if (errors['required']) {
      const fieldLabels: Record<string, string> = {
        email: 'Email',
        senha: 'Senha',
        nomeEmpresa: 'Nome da empresa',
        local: 'Localização'
      };
      return `${fieldLabels[fieldName]} é obrigatório`;
    }
    if (errors['email']) return 'Email deve ser válido';
    if (errors['minlength']) return 'Senha deve ter pelo menos 6 caracteres';

    return '';
  }

  async onSubmit() {
    if (this.empresaForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formData = {
          ...this.empresaForm.value,
          userType: 'empresa'
        };
        this.formSubmit.emit(formData);
      } finally {
        this.isSubmitting.set(false);
      }
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
