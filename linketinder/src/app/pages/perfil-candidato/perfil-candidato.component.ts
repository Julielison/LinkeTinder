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
    nome: '',
    email: '',
    dataNascimento: '',
    tecnologias: []
  };

  stats: Stats = {
    likes: 0,
    matches: 0,
    visualizacoes: 0
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.carregarDadosCandidato();
  }

  carregarDadosCandidato() {
    const candidatoData = localStorage.getItem('candidatoData');
    if (candidatoData) {
      const dados = JSON.parse(candidatoData);
      this.candidato = {
        nome: dados.nome,
        email: dados.email,
        dataNascimento: dados.dataNascimento,
        tecnologias: dados.tecnologias || []
      };
      
      // Estatísticas iniciais para novo usuário
      this.stats = {
        likes: Math.floor(Math.random() * 10),
        matches: Math.floor(Math.random() * 5),
        visualizacoes: Math.floor(Math.random() * 20) + 5
      };
    } else {
      // Dados padrão caso não tenha dados salvos
      this.candidato = {
        nome: 'Usuário',
        email: 'usuario@email.com',
        dataNascimento: '1990-01-01',
        tecnologias: []
      };
    }
  }

  calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    
    return idade;
  }

  calcularExperiencia(): string {
    const idade = this.calcularIdade(this.candidato.dataNascimento);
    const experiencia = Math.max(0, idade - 18);
    return experiencia > 0 ? `${experiencia} anos` : 'Iniciante';
  }

  getTecnologiasPrincipais(): string {
    if (this.candidato.tecnologias.length === 0) return 'Tecnologias diversas';
    if (this.candidato.tecnologias.length <= 2) return this.candidato.tecnologias.join(' e ');
    return this.candidato.tecnologias.slice(0, 2).join(', ') + ` e mais ${this.candidato.tecnologias.length - 2}`;
  }

  editarPerfil() {
    // Aqui você pode implementar a edição do perfil
    alert('Funcionalidade de edição será implementada em breve!');
  }
}