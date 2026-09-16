import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

/**
 * KOSTUR master-detail forme.
 * Dato: FormArray, genericke add/remove metode i layout.
 * Nije uradjeno: validatori, pravila (duplikat proizvoda, napomena),
 * pregled iznosa i slanje na backend.
 */
@Component({
  selector: 'app-proforma-add',
  standalone: false,
  templateUrl: './proforma-add.component.html',
  styleUrl: './proforma-add.component.scss',
})
export class ProformaAddComponent {
  private readonly fb = inject(FormBuilder);

  // TODO (student): ucitati proizvode (GET /ExamProducts/lookup).
  products: any[] = [];
  isSaving = false;

  // TODO (student): dodati validatore zaglavlja i pravila na nivou forme.
  readonly form = this.fb.group({
    number: [''],
    customerName: [''],
    note: [''],
    items: this.fb.array<FormGroup>([]),
  });

  constructor() { this.addItem(); }

  get items(): FormArray<FormGroup> { return this.form.controls.items; }

  addItem(): void {
    // TODO (student): dodati validatore stavke i reset kolicine pri promjeni proizvoda.
    this.items.push(this.fb.group({
      productId: [null as number | null],
      quantity: [null as number | null],
    }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // TODO (student): odabrani proizvod reda, za prikaz jedinicne cijene.
  productFor(index: number): any { return undefined; }

  // TODO (student): iznos stavke iz lookup cijene i unesene kolicine.
  lineAmountFor(index: number): number | null { return null; }

  // TODO (student): ukupan pregled kada su svi redovi kompletni.
  totalAmount(): number | null { return null; }

  // TODO (student): povratak na listu.
  cancel(): void {}

  // TODO (student): POST /Proformas, toast i tok nakon akcije.
  save(): void {}
}
