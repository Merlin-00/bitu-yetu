import { Component, ElementRef, HostListener, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Product } from '../../../core/models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  template: `
    <div class="search-container" #searchContainer>
      <div class="search-input-wrapper">
        <svg
          class="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 -960 960 960"
          width="20px"
          fill="#888888"
        >
          <path
            d="M784-120 532-372q-30 24-70.5 38t-81.5 14q-115 0-195.5-80.5T104-596q0-115 80.5-195.5T380-872q115 0 195.5 80.5T656-596q0 41-14 81.5T604-444l252 252-72 72ZM380-240q83 0 141.5-58.5T580-440q0-83-58.5-141.5T380-640q-83 0-141.5 58.5T180-440q0 83 58.5 141.5T380-240Z"
          />
        </svg>
        <input
          type="text"
          [(ngModel)]="query"
          (input)="onSearch()"
          (focus)="onFocus()"
          placeholder="Rechercher un vêtement, bijou, électronique..."
          class="search-input"
        />
        @if (query()) {
          <button class="clear-button" (click)="clearSearch()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="#888888"
            >
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
              />
            </svg>
          </button>
        }
      </div>

      @if (showDropdown() && (loading() || filteredProducts().length > 0 || query())) {
        <div class="search-dropdown">
          @if (loading()) {
            <div class="search-feedback">
              <div class="spinner"></div>
              <span>Recherche dans le catalogue...</span>
            </div>
          } @else if (filteredProducts().length > 0) {
            <div class="results-list">
              @for (product of filteredProducts(); track product.id) {
                <div class="result-item" (click)="navigateToProduct(product.id)">
                  <img [src]="product.image" [alt]="product.title" class="result-image" />
                  <div class="result-details">
                    <span class="result-title">{{ product.title }}</span>
                    <span class="result-meta">
                      <span class="result-category">{{ product.category }}</span>
                      <b class="result-price">$ {{ product.price }}</b>
                    </span>
                  </div>
                </div>
              }
            </div>
          } @else if (query().trim().length >= 2) {
            <div class="search-feedback no-results">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="#ff6b6b"
              >
                <path
                  d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
              <span>Aucun produit trouvé pour "{{ query() }}"</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .search-container {
      position: relative;
      width: 100%;
      max-width: 500px;
    }

    .search-input-wrapper {
      display: flex;
      align-items: center;
      background: #f5f6f8;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 0 0.75rem;
      height: 40px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:focus-within {
        background: #ffffff;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }
    }

    .search-icon {
      flex-shrink: 0;
      margin-right: 8px;
    }

    .search-input {
      width: 100%;
      border: none;
      background: transparent;
      outline: none;
      font-size: 0.9rem;
      color: #1e293b;
      font-family: inherit;

      &::placeholder {
        color: #94a3b8;
      }
    }

    .clear-button {
      border: none;
      background: transparent;
      padding: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background 0.2s;

      &:hover {
        background: #e2e8f0;
        scale: 1;
        opacity: 1;
      }
    }

    .search-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      max-height: 380px;
      overflow-y: auto;
      z-index: 1000;
      animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .search-feedback {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 2rem 1.5rem;
      color: #64748b;
      font-size: 0.9rem;
      text-align: center;
    }

    .no-results {
      color: #94a3b8;
      font-weight: 500;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid #e2e8f0;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .results-list {
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.2s;

      &:hover {
        background-color: #f1f5f9;
        transform: translateX(4px);
      }
    }

    .result-image {
      width: 44px;
      height: 44px;
      object-fit: contain;
      background: white;
      border-radius: 6px;
      padding: 4px;
      border: 1px solid #f1f5f9;
      flex-shrink: 0;
    }

    .result-details {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .result-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2px;
    }

    .result-category {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: capitalize;
    }

    .result-price {
      font-size: 0.85rem;
      color: #6366f1;
    }
  `,
})
export class SearchBarComponent implements OnInit {
  query = signal('');
  showDropdown = signal(false);
  loading = signal(false);
  
  private products: Product[] = [];
  filteredProducts = signal<Product[]>([]);
  
  private api = inject(ApiService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  ngOnInit() {
    this.loading.set(true);
    this.api.getPro().subscribe({
      next: (data) => {
        this.products = data;
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    const text = this.query().trim().toLowerCase();
    if (text.length < 2) {
      this.filteredProducts.set([]);
      return;
    }
    
    const matched = this.products.filter((p) =>
      p.title.toLowerCase().includes(text) ||
      p.category.toLowerCase().includes(text) ||
      p.description.toLowerCase().includes(text)
    );
    this.filteredProducts.set(matched.slice(0, 5)); // limit 5 results
  }

  onFocus() {
    this.showDropdown.set(true);
  }

  clearSearch() {
    this.query.set('');
    this.filteredProducts.set([]);
  }

  navigateToProduct(id: number) {
    this.showDropdown.set(false);
    this.router.navigate(['/product', id]);
    this.clearSearch();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.showDropdown.set(false);
  }
}
