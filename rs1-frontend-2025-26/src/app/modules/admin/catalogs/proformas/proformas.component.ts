import { Component } from '@angular/core';

/**
 * KOSTUR. Redovi ispod su DEMO podaci. Backend lista i paging su gotovi
 * (GET /Proformas) i pozivaju se preko ProformasApiService.list().
 * Povezivanje liste i paginatora je studentov posao.
 */
@Component({
  selector: 'app-proformas',
  standalone: false,
  templateUrl: './proformas.component.html',
  styleUrl: './proformas.component.scss',
})
export class ProformasComponent {
  readonly displayedColumns = ['number', 'createdAtUtc', 'customerName', 'itemsCount', 'totalAmount', 'note'];

  // TODO (student): zamijeniti DEMO redove odgovorom API-ja.
  rows: any[] = [
    { id: 0, number: 'DEMO-0001', customerName: 'Demo kupac', note: null, itemsCount: 2, totalAmount: 100, createdAtUtc: '2026-01-01T00:00:00Z' },
    { id: 0, number: 'DEMO-0002', customerName: 'Demo kupac', note: 'demo napomena', itemsCount: 6, totalAmount: 250, createdAtUtc: '2026-01-01T00:00:00Z' },
  ];

  totalItems = 0;
  isLoading = false;

  // TODO (student): ucitavanje liste s paginacijom.
  load(): void {}

  // TODO (student): reagovati na promjenu stranice/velicine stranice.
  pageChanged(event: any): void {}

  // TODO (student): navigacija na formu za dodavanje.
  add(): void {}
}
