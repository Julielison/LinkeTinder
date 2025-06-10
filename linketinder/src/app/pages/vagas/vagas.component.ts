import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { VagaCardComponent } from './vaga-card/vaga-card.component';

interface Vaga {
  id: number;
  titulo: string;
  empresa: {
    nome: string;
    logo: string;
    local: string;
  };
  salario: {
    min: number;
    max: number;
  };
  tipo: 'CLT' | 'PJ' | 'Freelancer' | 'Estágio';
  modalidade: 'Remoto' | 'Presencial' | 'Híbrido';
  tecnologias: string[];
  descricao: string;
  requisitos: string[];
  beneficios: string[];
  publicadaEm: Date;
  nivel: 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';
}

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [CommonModule, FormsModule, VagaCardComponent], // Adicionar FormsModule aqui
  templateUrl: './vagas.component.html',
  styleUrls: ['./vagas.component.css']
})
export class VagasComponent implements OnInit {
  vagas: Vaga[] = [];
  vagasFiltradas: Vaga[] = [];
  filtroTecnologia = '';
  filtroModalidade = '';
  filtroNivel = '';

  constructor() {}

  ngOnInit() {
    this.carregarVagas();
  }

  carregarVagas() {
    // Dados fake de vagas
    this.vagas = [
      {
        id: 1,
        titulo: 'Desenvolvedor Full Stack',
        empresa: {
          nome: 'TechCorp',
          logo: '🏢',
          local: 'São Paulo, SP'
        },
        salario: { min: 8000, max: 12000 },
        tipo: 'CLT',
        modalidade: 'Híbrido',
        tecnologias: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
        descricao: 'Procuramos um desenvolvedor full stack para integrar nossa equipe de desenvolvimento de produtos inovadores.',
        requisitos: [
          'Experiência com React e Node.js',
          'Conhecimento em TypeScript',
          'Experiência com bancos NoSQL',
          'Conhecimento em Git'
        ],
        beneficios: ['Vale alimentação', 'Plano de saúde', 'Home office', 'Gympass'],
        publicadaEm: new Date('2024-06-01'),
        nivel: 'Pleno'
      },
      {
        id: 2,
        titulo: 'Desenvolvedor Frontend React',
        empresa: {
          nome: 'StartupX',
          logo: '🚀',
          local: 'Rio de Janeiro, RJ'
        },
        salario: { min: 6000, max: 9000 },
        tipo: 'CLT',
        modalidade: 'Remoto',
        tecnologias: ['React', 'JavaScript', 'CSS', 'Redux'],
        descricao: 'Oportunidade para trabalhar em uma startup em crescimento desenvolvendo interfaces modernas e responsivas.',
        requisitos: [
          'Sólida experiência com React',
          'Domínio de JavaScript ES6+',
          'Conhecimento em CSS/SASS',
          'Experiência com Redux ou Context API'
        ],
        beneficios: ['Trabalho 100% remoto', 'Flexibilidade de horários', 'Stock options'],
        publicadaEm: new Date('2024-06-05'),
        nivel: 'Júnior'
      },
      {
        id: 3,
        titulo: 'Desenvolvedor Java Senior',
        empresa: {
          nome: 'Enterprise Solutions',
          logo: '🏭',
          local: 'Belo Horizonte, MG'
        },
        salario: { min: 12000, max: 18000 },
        tipo: 'CLT',
        modalidade: 'Presencial',
        tecnologias: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
        descricao: 'Lidere projetos de grande escala em uma empresa consolidada no mercado financeiro.',
        requisitos: [
          'Experiência sênior com Java',
          'Domínio do ecossistema Spring',
          'Conhecimento em arquitetura de microsserviços',
          'Experiência com containerização'
        ],
        beneficios: ['Plano de saúde premium', 'Previdência privada', 'Carro da empresa', 'Bônus anual'],
        publicadaEm: new Date('2024-06-03'),
        nivel: 'Sênior'
      },
      {
        id: 4,
        titulo: 'Desenvolvedor Mobile Flutter',
        empresa: {
          nome: 'MobileFirst',
          logo: '📱',
          local: 'Florianópolis, SC'
        },
        salario: { min: 7000, max: 11000 },
        tipo: 'PJ',
        modalidade: 'Híbrido',
        tecnologias: ['Flutter', 'Dart', 'Firebase', 'REST API'],
        descricao: 'Desenvolva aplicativos móveis inovadores para milhões de usuários.',
        requisitos: [
          'Experiência com Flutter e Dart',
          'Conhecimento em Firebase',
          'Integração com APIs REST',
          'Publicação nas lojas de apps'
        ],
        beneficios: ['Equipamentos top de linha', 'Cursos e certificações', 'Ambiente descontraído'],
        publicadaEm: new Date('2024-06-07'),
        nivel: 'Pleno'
      },
      {
        id: 5,
        titulo: 'Estágio em Desenvolvimento Web',
        empresa: {
          nome: 'DevAcademy',
          logo: '🎓',
          local: 'Porto Alegre, RS'
        },
        salario: { min: 1200, max: 1800 },
        tipo: 'Estágio',
        modalidade: 'Híbrido',
        tecnologias: ['HTML', 'CSS', 'JavaScript', 'Vue.js'],
        descricao: 'Oportunidade para iniciar sua carreira em desenvolvimento web com mentoria especializada.',
        requisitos: [
          'Cursando superior em TI',
          'Conhecimento básico em HTML/CSS',
          'Interesse em aprender JavaScript',
          'Disponibilidade de 6 horas diárias'
        ],
        beneficios: ['Mentoria especializada', 'Vale transporte', 'Vale alimentação', 'Certificações'],
        publicadaEm: new Date('2024-06-08'),
        nivel: 'Júnior'
      },
      {
        id: 6,
        titulo: 'DevOps Engineer',
        empresa: {
          nome: 'CloudTech',
          logo: '☁️',
          local: 'São Paulo, SP'
        },
        salario: { min: 10000, max: 15000 },
        tipo: 'CLT',
        modalidade: 'Remoto',
        tecnologias: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
        descricao: 'Trabalhe com infraestrutura de nuvem de alta disponibilidade e automação de processos.',
        requisitos: [
          'Experiência com AWS/Azure/GCP',
          'Domínio de Docker e Kubernetes',
          'Conhecimento em Infrastructure as Code',
          'Experiência com CI/CD'
        ],
        beneficios: ['Trabalho remoto', 'Plano de saúde', 'Certificações AWS', 'Bônus por performance'],
        publicadaEm: new Date('2024-06-02'),
        nivel: 'Sênior'
      }
    ];

    this.vagasFiltradas = [...this.vagas];
  }

  filtrarVagas() {
    this.vagasFiltradas = this.vagas.filter(vaga => {
      const matchTecnologia = !this.filtroTecnologia || 
        vaga.tecnologias.some(tech => 
          tech.toLowerCase().includes(this.filtroTecnologia.toLowerCase())
        );
      
      const matchModalidade = !this.filtroModalidade || 
        vaga.modalidade === this.filtroModalidade;
      
      const matchNivel = !this.filtroNivel || 
        vaga.nivel === this.filtroNivel;

      return matchTecnologia && matchModalidade && matchNivel;
    });
  }

  limparFiltros() {
    this.filtroTecnologia = '';
    this.filtroModalidade = '';
    this.filtroNivel = '';
    this.vagasFiltradas = [...this.vagas];
  }

  onVagaInteracao(event: {vagaId: number, acao: 'like' | 'dislike'}) {
    console.log(`Vaga ${event.vagaId} - Ação: ${event.acao}`);
    // Aqui você pode implementar a lógica de like/dislike
    // Remover a vaga da lista após interação
    this.vagasFiltradas = this.vagasFiltradas.filter(vaga => vaga.id !== event.vagaId);
  }
}
