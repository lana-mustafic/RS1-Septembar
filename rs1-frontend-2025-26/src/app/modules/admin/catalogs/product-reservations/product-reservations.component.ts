import { Component } from '@angular/core';
import {
  RESERVATION_STATE_LABELS,
  ReservationStateType,
} from '../../../../api-services/product-reservations/product-reservations-api.models';

/**
 * KOSTUR. Redovi ispod su DEMO podaci i moraju se zamijeniti podacima
 * s API-ja (GET /ProductReservations). Filteri, paginacija, brisanje i
 * navigacija nisu implementirani.
 */
@Component({
  selector: 'app-product-reservations',
  standalone: false,
  templateUrl: './product-reservations.component.html',
  styleUrl: './product-reservations.component.scss',
})
export class ProductReservationsComponent {
  readonly displayedColumns = ['code', 'product', 'price', 'quantity', 'value', 'reservedUntil', 'state', 'actions'];
  readonly stateLabels = RESERVATION_STATE_LABELS;
  readonly stateType = ReservationStateType;

  // TODO (student): lookup proizvoda za filter (GET /ExamProducts/lookup).
  products: any[] = [];

  // TODO (student): zamijeniti DEMO redove odgovorom API-ja.
  rows: any[] = [
    {
      id: 0, code: 'DEMO-0001', productId: 0, productName: 'Demo proizvod',
      productPrice: 10, quantity: 2, reservationValue: 20,
      reservedUntilUtc: '2026-01-01T00:00:00Z', isCancelled: false,
      state: ReservationStateType.Aktivna,
    },
    {
      id: 0, code: 'DEMO-0002', productId: 0, productName: 'Demo proizvod',
      productPrice: 10, quantity: 1, reservationValue: 10,
      reservedUntilUtc: '2026-01-01T00:00:00Z', isCancelled: true,
      state: ReservationStateType.Otkazana,
    },
  ];

  totalItems = 0;
  isLoading = false;

  stateLabel(state: ReservationStateType): string {
    return this.stateLabels[state];
  }

  // TODO (student): ucitavanje liste s filterima i paginacijom.
  load(): void {}

  // TODO (student): promjena filtera vraca na prvu stranicu i ponovo ucitava.
  filtersChanged(): void {}

  // TODO (student): reagovati na promjenu stranice/velicine stranice.
  pageChanged(event: any): void {}

  // TODO (student): navigacija na formu za dodavanje.
  add(): void {}

  // TODO (student): navigacija na formu za izmjenu.
  edit(id: number): void {}

  // TODO (student): potvrda u modalu, poziv DELETE i osvjezavanje liste.
  delete(row: any): void {}
}
