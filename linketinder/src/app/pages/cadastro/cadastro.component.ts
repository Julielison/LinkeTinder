import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  @ViewChild('tecnologiaInput') tecnologiaInput!: ElementRef;
  
  userType: 'candidato' | 'empresa' = 'candidato';
  cadastroForm: FormGroup;
  tecnologias: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.cadastroForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      
      // Campos para candidato
      nome: [''],
      dataNascimento: [''],
      
      // Campos para empresa
      nomeEmpresa: [''],
      local: ['']
    });
  }

  setUserType(type: 'candidato' | 'empresa') {
    this.userType = type;
    this.tecnologias = [];
    this.updateValidators();
  }

  updateValidators() {
    // Remove todos os validators primeiro
    this.cadastroForm.get('nome')?.clearValidators();
    this.cadastroForm.get('dataNascimento')?.clearValidators();
    this.cadastroForm.get('nomeEmpresa')?.clearValidators();
    this.cadastroForm.get('local')?.clearValidators();

    if (this.userType === 'candidato') {
      this.cadastroForm.get('nome')?.setValidators([Validators.required]);
      this.cadastroForm.get('dataNascimento')?.setValidators([Validators.required]);
    } else {
      this.cadastroForm.get('nomeEmpresa')?.setValidators([Validators.required]);
      this.cadastroForm.get('local')?.setValidators([Validators.required]);
    }

    // Atualiza a validação
    this.cadastroForm.get('nome')?.updateValueAndValidity();
    this.cadastroForm.get('dataNascimento')?.updateValueAndValidity();
    this.cadastroForm.get('nomeEmpresa')?.updateValueAndValidity();
    this.cadastroForm.get('local')?.updateValueAndValidity();
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
    const field = this.cadastroForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      const formData = {
        ...this.cadastroForm.value,
        userType: this.userType,
        tecnologias: this.userType === 'candidato' ? this.tecnologias : undefined
      };

      console.log('Dados do cadastro:', formData);
      
      // Aqui será feita a chamada para o backend
      alert(`Cadastro ${this.userType} realizado com sucesso!`);
      this.router.navigate(['/login']);
    } else {
      // Marca todos os campos como touched para mostrar os erros
      Object.keys(this.cadastroForm.controls).forEach(key => {
        this.cadastroForm.get(key)?.markAsTouched();
      });
    }
  }

  voltarParaHome() {
    this.router.navigate(['/']);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
