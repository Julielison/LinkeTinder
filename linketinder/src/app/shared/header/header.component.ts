import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showNavigation = false;
  activeView: 'empresas' | 'vagas' | 'candidatos' = 'empresas';
  userType: 'candidato' | 'empresa' | null = null;
  userName = '';

  constructor(private router: Router) { }

  ngOnInit() {
    // Verificar se o usuário está logado
    this.checkUserStatus();
    
    // Observar mudanças de rota para atualizar a visualização
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkUserStatus();
      this.updateActiveViewFromRoute(event.url);
    });
  }

  checkUserStatus() {
    // Verificar se existe dados de candidato logado
    const candidatoData = localStorage.getItem('candidato');
    const empresaData = localStorage.getItem('empresa');
    const token = localStorage.getItem('token');
    
    if (candidatoData && token) {
      const candidato = JSON.parse(candidatoData);
      this.userType = 'candidato';
      this.userName = candidato.nome;
      this.showNavigation = true;
      this.activeView = 'empresas'; // View padrão para candidatos
    } else if (empresaData && token) {
      const empresa = JSON.parse(empresaData);
      this.userType = 'empresa';
      this.userName = empresa.nomeEmpresa;
      this.showNavigation = true;
      this.activeView = 'candidatos'; // View padrão para empresas
    } else {
      this.userType = null;
      this.userName = '';
      this.showNavigation = false;
    }
  }

  updateActiveViewFromRoute(url: string) {
    if (url.includes('/vagas')) {
      this.activeView = 'vagas';
    } else if (url.includes('/empresas')) {
      this.activeView = 'empresas';
    } else if (url.includes('/candidatos')) {
      this.activeView = 'candidatos';
    } else if (url.includes('/perfil-candidato')) {
      this.activeView = 'empresas'; // Manter empresas como padrão no perfil do candidato
    } else if (url.includes('/perfil-empresa')) {
      this.activeView = 'candidatos'; // Manter candidatos como padrão no perfil da empresa
    }
  }

  setActiveView(view: 'empresas' | 'vagas' | 'candidatos') {
    this.activeView = view;
    
    // Navegar para a rota correspondente
    if (view === 'empresas') {
      this.router.navigate(['/empresas']);
    } else if (view === 'vagas') {
      this.router.navigate(['/vagas']);
    } else if (view === 'candidatos') {
      this.router.navigate(['/candidatos']);
    }
  }

  onLogout() {
    // Limpar todos os dados do usuário
    localStorage.removeItem('candidato');
    localStorage.removeItem('empresa');
    localStorage.removeItem('candidatoData');
    localStorage.removeItem('empresaData');
    localStorage.removeItem('token');
    
    // Atualizar estado
    this.showNavigation = false;
    this.userType = null;
    this.userName = '';
    
    // Mostrar mensagem de logout
    alert('Logout realizado com sucesso!');
    
    // Redirecionar para home
    this.router.navigate(['/']);
  }
}
