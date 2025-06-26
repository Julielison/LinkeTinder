import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vaga, VagaService, Empresa } from '../../../services/vaga.service';

@Component({
  selector: 'app-vaga-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vaga-card.component.html',
  styleUrls: ['./vaga-card.component.css']
})
export class VagaCardComponent {
  private vagaService = inject(VagaService);

  vaga = input.required<Vaga>();
  vagaInteracao = output<{vagaId: number, acao: 'like' | 'dislike'}>();

  // Signal para controlar detalhes
  showDetalhes = signal(false);

  // Signals para dados da empresa
  showEmpresaDetails = signal(false);
  empresaData = signal<Empresa | null>(null);
  loadingEmpresa = signal(false);

  // Timer para controlar o hover
  private hoverTimer: any = null;
  private leaveTimer: any = null;

  // Computed signals para valores derivados
  salarioFormatado = computed(() => {
    const vaga = this.vaga();
    return `R$ ${vaga.salario.min.toLocaleString()} - R$ ${vaga.salario.max.toLocaleString()}`;
  });

  diasPublicacao = computed(() => {
    const hoje = new Date();
    const publicacao = new Date(this.vaga().publicadaEm); // Conversão string → Date
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

  toggleDetalhes(idVaga: number) {
    if (this.showDetalhes()) {
      this.showDetalhes.set(false);
      return;
    }

    this.vagaService.obterDescricao(idVaga).subscribe({
      next: (descricao) => {
        if (descricao) {
          console.log('Descrição obtida:', descricao);
          this.showDetalhes.set(true);
        } else {
          console.warn('Descrição não encontrada para a vaga:', idVaga);
        }
      },
      error: (error) => {
        console.error('Erro ao obter descrição da vaga:', error);
      }
    });
  }

  onLike() {
    this.vagaInteracao.emit({ vagaId: this.vaga().id, acao: 'like' });
  }

  onDislike() {
    this.vagaInteracao.emit({ vagaId: this.vaga().id, acao: 'dislike' });
  }

  // Método para buscar dados da empresa
  onEmpresaHover() {
    // Cancela timer de leave se existir
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }

    // Se já está carregando ou já tem dados, apenas mostra
    if (this.loadingEmpresa() || this.empresaData()) {
      this.showEmpresaDetails.set(true);
      return;
    }

    // Debounce de 300ms para evitar requests desnecessários
    this.hoverTimer = setTimeout(() => {
      this.loadingEmpresa.set(true);
      this.showEmpresaDetails.set(true);

      this.vagaService.obterEmpresaPorNome(this.vaga().empresa.nome).subscribe({
        next: (empresa) => {
          console.log('Dados da empresa carregados:', empresa);
          this.empresaData.set(empresa);
          this.loadingEmpresa.set(false);

          // Garante que ainda está em hover antes de mostrar
          if (this.showEmpresaDetails()) {
            // Força uma pequena animação para garantir que o tooltip apareça
            setTimeout(() => {
              if (this.empresaData() && this.showEmpresaDetails()) {
                console.log('Tooltip deve estar visível agora');
              }
            }, 50);
          }
        },
        error: (error) => {
          console.error('Erro ao carregar dados da empresa:', error);
          this.loadingEmpresa.set(false);
          this.showEmpresaDetails.set(false);
        }
      });
    }, 300);
  }

  onEmpresaLeave() {
    // Cancela timer de hover se existir
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }

    // Delay para permitir movimento do mouse para o tooltip
    this.leaveTimer = setTimeout(() => {
      this.showEmpresaDetails.set(false);
    }, 200);
  }

  // Métodos para manter tooltip visível quando mouse está sobre ele
  onTooltipEnter() {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
  }

  onTooltipLeave() {
    this.showEmpresaDetails.set(false);
  }

  // Cleanup nos timers quando componente for destruído
  ngOnDestroy() {
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
    }
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
    }
  }
}
