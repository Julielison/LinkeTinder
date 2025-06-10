import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Candidato {
  nome: string;
  email: string;
  dataNascimento: string;
  tecnologias: string[];
}

interface Stats {
  likes: number;
  matches: number;
  visualizacoes: number;
}

@Component({
  selector: 'app-perfil-candidato',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-candidato.component.html',
  styleUrls: ['./perfil-candidato.component.css']
})
export class PerfilCandidatoComponent implements OnInit {
  candidato: Candidato = {
    nome: 'João Silva',
    email: 'joao@email.com',
    dataNascimento: '1995-03-15',
    tecnologias: ['JavaScript', 'TypeScript', 'Angular', 'Node.js', 'Python', 'React']
  };

  stats: Stats = {
    likes: 23,
    matches: 5,
    visualizacoes: 156
  };

  constructor(private router: Router) { }

  ngOnInit() {
    // Aqui você carregaria os dados do candidato do backend
    this.carregarDadosCandidato();
  }

  carregarDadosCandidato() {
    // Simulação de dados - substituir por chamada real ao backend
    const dadosSalvos = localStorage.getItem('candidato');
    if (dadosSalvos) {
      this.candidato = JSON.parse(dadosSalvos);
    }
  }

  calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }

  calcularExperiencia(): string {
    const anoAtual = new Date().getFullYear();
    const anoNascimento = new Date(this.candidato.dataNascimento).getFullYear();
    const idadeTrabalho = anoAtual - anoNascimento - 18; // Assumindo que começou a trabalhar aos 18
    
    if (idadeTrabalho <= 0) return 'menos de 1 ano';
    if (idadeTrabalho === 1) return '1 ano';
    return `${idadeTrabalho} anos`;
  }

  getTecnologiasPrincipais(): string {
    if (this.candidato.tecnologias.length === 0) return 'Diversas tecnologias';
    if (this.candidato.tecnologias.length <= 2) return this.candidato.tecnologias.join(' e ');
    return this.candidato.tecnologias.slice(0, 2).join(', ') + ' e outras';
  }

  editarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }
}