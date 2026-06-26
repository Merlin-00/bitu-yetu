import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container max-width">
        <div class="left-container">
          <div>
            <p class="footer-title"><b>PRODUITS</b></p>
            <a routerLink="/products/electronics" class="footer-link">Électroniques</a>
            <a routerLink="/products/jewelery" class="footer-link">Bijoux</a>
            <a routerLink="/products/men's clothing" class="footer-link">Vêtements pour hommes</a>
            <a routerLink="/products/women's clothing" class="footer-link">Vêtements pour femmes</a>
          </div>
          <div>
            <p class="footer-title"><b>AIDE & CONTACT</b></p>
            <a href="#" class="footer-link">Service client</a>
            <a href="#" class="footer-link">Conditions Générales de Vente</a>
            <a href="#" class="footer-link">Politique de confidentialité</a>
            <a href="#" class="footer-link">Mentions légales</a>
          </div>
        </div>
        <div class="right-container">
          <p class="footer-brand"><b>bitu-yetu</b></p>
          <p class="footer-copyright">
            &copy; {{ date.getFullYear() }} bitu-yetu. Tous droits réservés.<br />
            Votre destination d'exception pour vos articles préférés au quotidien.
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      background: var(--bg-sub);
      border-top: 1px solid var(--border-light);
      padding: 3rem 1rem;
      color: var(--text-main);
    }
    
    .footer-container {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 2.5rem;
    }
    
    .left-container {
      display: flex;
      flex-wrap: wrap;
      gap: 4rem;
    }

    .footer-title {
      font-size: 0.8rem;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
      color: var(--text-main);
    }
    
    .footer-link {
      display: block;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin: 0.5rem 0;
      transition: color 0.2s ease;

      &:hover {
        color: var(--text-main);
        opacity: 1;
      }
    }

    .right-container {
      text-align: left;
      @media (min-width: 768px) {
        text-align: right;
      }
    }

    .footer-brand {
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.01em;
      margin: 0 0 0.5rem 0;
    }

    .footer-copyright {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0;
    }
  `,
})
export class FooterComponent {
  date = new Date();
}
