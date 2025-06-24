import { Component, signal, computed, model, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VagaCardComponent } from './vaga-card/vaga-card.component';
import { VagaService, Vaga } from '../../services/vaga.service';

@Component({
  selector: 'app-vagas',
  standalone: true,
  imports: [CommonModule, FormsModule, VagaCardComponent],
  templateUrl: './vagas.component.html',
  styleUrls: ['./vagas.component.css']
})
export class VagasComponent {
  private vagaService = inject(VagaService);

  // Signal para armazenar vagas - inicializado vazio
  private vagas = signal<Vaga[]>([]);

  // Signal para controle de loading
  isLoading = signal(true);

  // Signal para controle de erro
  error = signal<string | null>(null);

  // Models para filtros
  filtroTecnologia = model('');
  filtroModalidade = model('');
  filtroNivel = model('');

  // Computed para vagas filtradas
  vagasFiltradas = computed(() => {
    const vagas = this.vagas();
    const tecFilter = this.filtroTecnologia().toLowerCase();
    const modFilter = this.filtroModalidade();
    const nivFilter = this.filtroNivel();

    if (!tecFilter && !modFilter && !nivFilter) {
      return vagas;
    }

    return vagas.filter(vaga => {
      const matchTecnologia = !tecFilter ||
        vaga.tecnologias.some(tech =>
          tech.toLowerCase().includes(tecFilter)
        );

      const matchModalidade = !modFilter ||
        vaga.modalidade === modFilter;

      const matchNivel = !nivFilter ||
        vaga.nivel === nivFilter;

      return matchTecnologia && matchModalidade && matchNivel;
    });
  });

  // Computed para contagem de resultados
  totalVagasEncontradas = computed(() => this.vagasFiltradas().length);
  hasVagas = computed(() => this.totalVagasEncontradas() > 0);

  constructor() {
    // Carregar vagas na inicialização
    this.carregarVagas();
  }

  // Método para carregar vagas da API
  private carregarVagas() {
    this.isLoading.set(true);
    this.error.set(null);

    this.vagaService.getVagas().subscribe({
      next: (vagas) => {
        this.vagas.set(vagas);
        this.isLoading.set(false);
        console.log('Vagas carregadas:', vagas);
      },
      error: (error) => {
        console.error('Erro ao carregar vagas:', error);
        this.error.set('Erro ao carregar vagas. Tente novamente.');
        this.isLoading.set(false);
      }
    });
  }

  // Método para recarregar vagas
  recarregarVagas() {
    this.carregarVagas();
  }

  // Limpar filtros
  limparFiltros() {
    this.filtroTecnologia.set('');
    this.filtroModalidade.set('');
    this.filtroNivel.set('');
  }

  // Tratar interação com vaga (like/dislike)
  onVagaInteracao(event: {vagaId: number, acao: 'like' | 'dislike'}) {
    console.log(`Vaga ${event.vagaId} - Ação: ${event.acao}`);

    // Implementar like/dislike via API
    const candidatoId = 1; // TODO: Pegar do contexto de usuário logado

    if (event.acao === 'like') {
      this.vagaService.darLike(candidatoId, event.vagaId).subscribe({
        next: () => {
          console.log('Like registrado');
          // Remover vaga da lista após interação
          this.vagas.update(vagas => vagas.filter(vaga => vaga.id !== event.vagaId));
        },
        error: (error) => console.error('Erro ao dar like:', error)
      });
    } else {
      this.vagaService.rejeitarVaga(candidatoId, event.vagaId).subscribe({
        next: () => {
          console.log('Rejeição registrada');
          // Remover vaga da lista após interação
          this.vagas.update(vagas => vagas.filter(vaga => vaga.id !== event.vagaId));
        },
        error: (error) => console.error('Erro ao rejeitar vaga:', error)
      });
    }
  }

  // Método para buscar vagas por tecnologia
  buscarPorTecnologia(tecnologia: string) {
    if (!tecnologia.trim()) {
      this.carregarVagas();
      return;
    }

    this.isLoading.set(true);
    this.vagaService.buscarPorTecnologia(tecnologia).subscribe({
      next: (vagas) => {
        this.vagas.set(vagas);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erro ao buscar vagas:', error);
        this.error.set('Erro ao buscar vagas.');
        this.isLoading.set(false);
      }
    });
  }
}
