import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { inject } from '@angular/core';

/**
 * KOSTUR. Forma je povezana s markupom, ali nema validatora, poruka,
 * ucitavanja proizvoda ni slanja na backend.
 */
@Component({
  selector: 'app-product-reservation-add',
  standalone: false,
  templateUrl: './product-reservation-add.component.html',
  styleUrl: './product-reservation-add.component.scss',
})
export class ProductReservationAddComponent {
  private readonly fb = inject(FormBuilder);

  // TODO (student): ucitati proizvode (GET /ExamProducts/lookup).
  products: any[] = [];
  isSaving = false;

  // TODO (student): dodati validatore i poruke prema tekstu zadatka.
  readonly form = this.fb.group({
    code: [''],
    productId: [null as number | null],
    quantity: [null as number | null],
    reservedUntilUtc: [''],
  });

  // TODO (student): povratak na listu.
  cancel(): void {}

  // TODO (student): POST /ProductReservations, toast i tok nakon akcije.
  save(): void {}
}
