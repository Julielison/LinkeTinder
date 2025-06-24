import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  selector: 'app-vaga-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vaga-card.component.html',
  styleUrls: ['./vaga-card.component.css']
})
export class VagaCardComponent {
  @Input() vaga!: Vaga;
  @Output() vagaInteracao = new EventEmitter<{vagaId: number, acao: 'like' | 'dislike'}>();

  showDetalhes = false;

  toggleDetalhes() {
    this.showDetalhes = !this.showDetalhes;
  }

  onLike() {
    this.vagaInteracao.emit({ vagaId: this.vaga.id, acao: 'like' });
  }

  onDislike() {
    this.vagaInteracao.emit({ vagaId: this.vaga.id, acao: 'dislike' });
  }

  formatarSalario(): string {
    return `R$ ${this.vaga.salario.min.toLocaleString()} - R$ ${this.vaga.salario.max.toLocaleString()}`;
  }

  calcularDiasPublicacao(): number {
    const hoje = new Date();
    const publicacao = new Date(this.vaga.publicadaEm);
    const diffTime = Math.abs(hoje.getTime() - publicacao.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getModalidadeIcon(): string {
    switch (this.vaga.modalidade) {
      case 'Remoto': return '🏠';
      case 'Presencial': return '🏢';
      case 'Híbrido': return '🔄';
      default: return '📍';
    }
  }

  getTipoColor(): string {
    switch (this.vaga.tipo) {
      case 'CLT': return '#10b981';
      case 'PJ': return '#3b82f6';
      case 'Freelancer': return '#f59e0b';
      case 'Estágio': return '#8b5cf6';
      default: return '#6b7280';
    }
  }

  getNivelColor(): string {
    switch (this.vaga.nivel) {
      case 'Júnior': return '#10b981';
      case 'Pleno': return '#f59e0b';
      case 'Sênior': return '#ef4444';
      case 'Especialista': return '#8b5cf6';
      default: return '#6b7280';
    }
  }
}
