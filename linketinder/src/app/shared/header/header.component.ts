import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showNavigation = false;
  activeView: 'empresas' | 'vagas' = 'empresas';

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
    // Verificar se existe dados de usuário logado
    const userData = localStorage.getItem('candidato') || localStorage.getItem('empresa');
    this.showNavigation = !!userData;
  }

  updateActiveViewFromRoute(url: string) {
    if (url.includes('/vagas')) {
      this.activeView = 'vagas';
    } else if (url.includes('/empresas')) {
      this.activeView = 'empresas';
    }
  }

  setActiveView(view: 'empresas' | 'vagas') {
    this.activeView = view;
    
    // Navegar para a rota correspondente
    if (view === 'empresas') {
      this.router.navigate(['/empresas']);
    } else {
      this.router.navigate(['/vagas']);
    }
  }

  onLogout() {
    // Limpar dados do usuário
    localStorage.removeItem('candidato');
    localStorage.removeItem('empresa');
    localStorage.removeItem('token');
    
    // Atualizar estado
    this.showNavigation = false;
    
    // Redirecionar para home
    this.router.navigate(['/']);
  }
}
