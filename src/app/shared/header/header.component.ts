import { Component, signal, computed, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface UserData {
  type: 'candidato' | 'empresa' | null;
  name: string;
  isLoggedIn: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private router = inject(Router);

  // Signals para gerenciar estado
  private userData = signal<UserData>({
    type: null,
    name: '',
    isLoggedIn: false
  });

  activeView = signal<'empresas' | 'vagas' | 'candidatos'>('empresas');

  // Computed signals para propriedades derivadas
  showNavigation = computed(() => this.userData().isLoggedIn);
  userType = computed(() => this.userData().type);
  userName = computed(() => this.userData().name);

  // Computed para verificar se é candidato
  isCandidato = computed(() => this.userType() === 'candidato');

  // Computed para verificar se é empresa
  isEmpresa = computed(() => this.userType() === 'empresa');

  constructor() {
    // Verificar status do usuário na inicialização
    this.checkUserStatus();

    // Observar mudanças de rota
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe((event: NavigationEnd) => {
      this.checkUserStatus();
      this.updateActiveViewFromRoute(event.url);
    });
  }

  private checkUserStatus() {
    // Verificar dados no localStorage
    const candidatoData = localStorage.getItem('candidato');
    const empresaData = localStorage.getItem('empresa');
    const token = localStorage.getItem('token');

    if (candidatoData && token) {
      const candidato = JSON.parse(candidatoData);
      this.userData.set({
        type: 'candidato',
        name: candidato.nome,
        isLoggedIn: true
      });
      this.activeView.set('vagas'); // View padrão para candidatos
    } else if (empresaData && token) {
      const empresa = JSON.parse(empresaData);
      this.userData.set({
        type: 'empresa',
        name: empresa.nomeEmpresa,
        isLoggedIn: true
      });
      this.activeView.set('candidatos'); // View padrão para empresas
    } else {
      this.userData.set({
        type: null,
        name: '',
        isLoggedIn: false
      });
    }
  }

  private updateActiveViewFromRoute(url: string) {
    if (url.includes('/vagas')) {
      this.activeView.set('vagas');
    } else if (url.includes('/empresas')) {
      this.activeView.set('empresas');
    } else if (url.includes('/candidatos')) {
      this.activeView.set('candidatos');
    } else if (url.includes('/perfil-candidato')) {
      this.activeView.set('vagas'); // Manter vagas como padrão no perfil do candidato
    } else if (url.includes('/perfil-empresa')) {
      this.activeView.set('candidatos'); // Manter candidatos como padrão no perfil da empresa
    }
  }

  setActiveView(view: 'empresas' | 'vagas' | 'candidatos') {
    this.activeView.set(view);

    // Navegar para a rota correspondente
    switch (view) {
      case 'empresas':
        this.router.navigate(['/empresas']);
        break;
      case 'vagas':
        this.router.navigate(['/vagas']);
        break;
      case 'candidatos':
        this.router.navigate(['/candidatos']);
        break;
    }
  }

  onLogout() {
    // Limpar todos os dados do usuário
    const keysToRemove = [
      'candidato',
      'empresa',
      'candidatoData',
      'empresaData',
      'token'
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Atualizar estado
    this.userData.set({
      type: null,
      name: '',
      isLoggedIn: false
    });

    // Mostrar mensagem de logout
    alert('Logout realizado com sucesso!');

    // Redirecionar para home
    this.router.navigate(['/']);
  }
}
