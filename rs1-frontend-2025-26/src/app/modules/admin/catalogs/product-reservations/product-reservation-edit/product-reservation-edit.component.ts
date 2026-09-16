import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/**
 * KOSTUR. Forma se ne popunjava podacima postojece rezervacije i ne salje izmjenu.
 */
@Component({
  selector: 'app-product-reservation-edit',
  standalone: false,
  templateUrl: './product-reservation-edit.component.html',
  styleUrl: '../product-reservation-add/product-reservation-add.component.scss',
})
export class ProductReservationEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  protected readonly id = Number(this.route.snapshot.paramMap.get('id'));

  // TODO (student): ucitati proizvode (GET /ExamProducts/lookup).
  products: any[] = [];
  isSaving = false;
  isLoading = false;

  // TODO (student): dodati validatore i poruke prema tekstu zadatka.
  readonly form = this.fb.group({
    code: [''],
    productId: [null as number | null],
    quantity: [null as number | null],
    reservedUntilUtc: [''],
    isCancelled: [false],
  });

  // TODO (student): GET /ProductReservations/{id} i popunjavanje forme.

  // TODO (student): povratak na listu.
  cancel(): void {}

  // TODO (student): PUT /ProductReservations/{id}, toast i tok nakon akcije.
  save(): void {}
}
