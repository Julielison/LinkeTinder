import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Vaga {
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
  publicadaEm: string;
  nivel: 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';
}

export interface Empresa {
  id: number;
  nomeEmpresa: string;
  email: string;
  local: string;
  setor: string;
  tamanho: string;
  logo: string;
}

@Injectable({
  providedIn: 'root'
})
export class VagaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  // Signal para armazenar vagas
  private vagasSignal = signal<Vaga[]>([]);

  // BehaviorSubject para compatibilidade com RxJS
  private vagasSubject = new BehaviorSubject<Vaga[]>([]);

  // Observables públicos
  vagas$ = this.vagasSubject.asObservable();

  constructor() {
    this.carregarVagas();
  }

  // Métodos usando Observables
  getVagas(): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(`${this.apiUrl}/vagas`).pipe(
      catchError(error => {
        console.error('Erro ao carregar vagas:', error);
        return of([]);
      })
    );
  }

  getVagaPorId(id: number): Observable<Vaga | null> {
    return this.http.get<Vaga>(`${this.apiUrl}/vagas/${id}`).pipe(
      catchError(error => {
        console.error('Erro ao carregar vaga:', error);
        return of(null);
      })
    );
  }

  // Métodos usando Signals
  carregarVagas() {
    this.getVagas().subscribe(vagas => {
      this.vagasSignal.set(vagas);
      this.vagasSubject.next(vagas);
    });
  }

  // Getter para o signal (somente leitura)
  get vagas() {
    return this.vagasSignal.asReadonly();
  }

  // Filtrar vagas
  filtrarVagas(filtros: {
    tecnologia?: string;
    modalidade?: string;
    nivel?: string;
  }): Observable<Vaga[]> {
    let url = `${this.apiUrl}/vagas?`;
    const params: string[] = [];

    if (filtros.modalidade) {
      params.push(`modalidade=${filtros.modalidade}`);
    }
    if (filtros.nivel) {
      params.push(`nivel=${filtros.nivel}`);
    }

    url += params.join('&');

    return this.http.get<Vaga[]>(url).pipe(
      map(vagas => {
        if (filtros.tecnologia) {
          return vagas.filter(vaga =>
            vaga.tecnologias.some(tech =>
              tech.toLowerCase().includes(filtros.tecnologia!.toLowerCase())
            )
          );
        }
        return vagas;
      }),
      catchError(error => {
        console.error('Erro ao filtrar vagas:', error);
        return of([]);
      })
    );
  }


  // Buscar vagas por tecnologia
  buscarPorTecnologia(tecnologia: string): Observable<Vaga[]> {
    return this.http.get<Vaga[]>(`${this.apiUrl}/vagas`).pipe(
      map(vagas => vagas.filter(vaga =>
        vaga.tecnologias.some(tech =>
          tech.toLowerCase().includes(tecnologia.toLowerCase())
        )
      )),
      catchError(error => {
        console.error('Erro ao buscar vagas:', error);
        return of([]);
      })
    );
  }

  // Criar nova vaga
  criarVaga(vaga: Omit<Vaga, 'id'>): Observable<Vaga> {
    return this.http.post<Vaga>(`${this.apiUrl}/vagas`, {
      ...vaga,
      publicadaEm: new Date().toISOString()
    });
  }

  // Atualizar vaga
  atualizarVaga(id: number, vaga: Partial<Vaga>): Observable<Vaga> {
    return this.http.patch<Vaga>(`${this.apiUrl}/vagas/${id}`, vaga);
  }

  // Deletar vaga
  deletarVaga(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vagas/${id}`);
  }

  // Dar like em uma vaga
  darLike(candidatoId: number, vagaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/likes`, {
      candidatoId,
      vagaId,
      tipo: 'like',
      data: new Date().toISOString()
    });
  }

  // Rejeitar uma vaga
  rejeitarVaga(candidatoId: number, vagaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/likes`, {
      candidatoId,
      vagaId,
      tipo: 'dislike',
      data: new Date().toISOString()
    });
  }

  obterEmpresaPorNome(nomeEmpresa: string): Observable<Empresa | null> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/empresas?nomeEmpresa=${nomeEmpresa}`).pipe(
      map(empresas => empresas.length > 0 ? empresas[0] : null),
      catchError(error => {
        console.error('Erro ao obter dados da empresa:', error);
        return of(null);
      })
    );
  }
}
