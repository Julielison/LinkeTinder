import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CandidatoFormComponent } from './candidato-form/candidato-form.component';
import { EmpresaFormComponent } from './empresa-form/empresa-form.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, CandidatoFormComponent, EmpresaFormComponent],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  userType: 'candidato' | 'empresa' = 'candidato';

  constructor(private router: Router) {}

  setUserType(type: 'candidato' | 'empresa') {
    this.userType = type;
  }

  onFormSubmit(formData: any) {
    console.log('Dados do cadastro:', formData);
    
    if (formData.userType === 'candidato') {
      // Salvar dados do candidato como usuário logado
      const candidatoLogado = {
        id: Date.now(), // ID temporário
        nome: formData.nome,
        email: formData.email,
        dataNascimento: formData.dataNascimento,
        tecnologias: formData.tecnologias || [],
        tipo: 'candidato'
      };
      
      localStorage.setItem('candidato', JSON.stringify(candidatoLogado));
      localStorage.setItem('candidatoData', JSON.stringify(formData));
      localStorage.setItem('token', 'temp-token-' + Date.now()); // Token temporário
      
      alert('Cadastro realizado com sucesso!');
      this.router.navigate(['/perfil-candidato']);
      
    } else {
      // Salvar dados da empresa como usuário logado
      const empresaLogada = {
        id: Date.now(), // ID temporário
        nomeEmpresa: formData.nomeEmpresa,
        email: formData.email,
        local: formData.local,
        tipo: 'empresa'
      };
      
      localStorage.setItem('empresa', JSON.stringify(empresaLogada));
      localStorage.setItem('empresaData', JSON.stringify(formData));
      localStorage.setItem('token', 'temp-token-' + Date.now()); // Token temporário
      
      alert('Cadastro empresa realizado com sucesso!');
      // Redirecionar para uma página da empresa (Para criar)
      this.router.navigate(['/empresas']);
    }
  }

  voltarParaHome() {
    this.router.navigate(['/']);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }
}
