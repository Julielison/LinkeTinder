import { Component, input, output, signal, computed } from '@angular/core';
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
  vaga = input.required<Vaga>();

  vagaInteracao = output<{vagaId: number, acao: 'like' | 'dislike'}>();

  showDetalhes = signal(false);

  salarioFormatado = computed(() => {
    const vaga = this.vaga();
    return `R$ ${vaga.salario.min.toLocaleString()} - R$ ${vaga.salario.max.toLocaleString()}`;
  });

  diasPublicacao = computed(() => {
    const hoje = new Date();
    const publicacao = new Date(this.vaga().publicadaEm);
    const diffTime = Math.abs(hoje.getTime() - publicacao.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  modalidadeIcon = computed(() => {
    switch (this.vaga().modalidade) {
      case 'Remoto': return '🏠';
      case 'Presencial': return '🏢';
      case 'Híbrido': return '🔄';
      default: return '📍';
    }
  });

  tipoColor = computed(() => {
    switch (this.vaga().tipo) {
      case 'CLT': return '#10b981';
      case 'PJ': return '#3b82f6';
      case 'Freelancer': return '#f59e0b';
      case 'Estágio': return '#8b5cf6';
      default: return '#6b7280';
    }
  });

  nivelColor = computed(() => {
    switch (this.vaga().nivel) {
      case 'Júnior': return '#10b981';
      case 'Pleno': return '#f59e0b';
      case 'Sênior': return '#ef4444';
      case 'Especialista': return '#8b5cf6';
      default: return '#6b7280';
    }
  });

  // Computed para texto do botão de detalhes
  detalhesButtonText = computed(() =>
    this.showDetalhes() ? '🔼 Ocultar detalhes' : '🔽 Ver detalhes'
  );

  toggleDetalhes() {
    this.showDetalhes.update(current => !current);
  }

  onLike() {
    this.vagaInteracao.emit({ vagaId: this.vaga().id, acao: 'like' });
  }

  onDislike() {
    this.vagaInteracao.emit({ vagaId: this.vaga().id, acao: 'dislike' });
  }
}
