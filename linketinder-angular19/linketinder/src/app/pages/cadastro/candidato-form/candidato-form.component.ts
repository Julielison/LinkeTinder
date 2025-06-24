import { Component, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-candidato-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './candidato-form.component.html',
  styleUrls: ['./candidato-form.component.css']
})
export class CandidatoFormComponent {
  @ViewChild('tecnologiaInput') tecnologiaInput!: ElementRef;
  @Output() formSubmit = new EventEmitter<any>();
  @Output() voltarClick = new EventEmitter<void>();
  @Output() loginClick = new EventEmitter<void>();
  
  candidatoForm: FormGroup;
  tecnologias: string[] = [];

  constructor(private fb: FormBuilder) {
    this.candidatoForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      nome: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]]
    });
  }

  adicionarTecnologia(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const input = event.target as HTMLInputElement;
      const tecnologia = input.value.trim();
      
      if (tecnologia && !this.tecnologias.includes(tecnologia)) {
        this.tecnologias.push(tecnologia);
        input.value = '';
      }
    }
  }

  removerTecnologia(index: number) {
    this.tecnologias.splice(index, 1);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.candidatoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.candidatoForm.valid) {
      const formData = {
        ...this.candidatoForm.value,
        userType: 'candidato',
        tecnologias: this.tecnologias
      };
      this.formSubmit.emit(formData);
    } else {
      Object.keys(this.candidatoForm.controls).forEach(key => {
        this.candidatoForm.get(key)?.markAsTouched();
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
