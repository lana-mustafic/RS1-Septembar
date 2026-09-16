import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

export class ListProformasRequest extends BasePagedQuery {}

export interface ListProformasQueryDto {
  id: number;
  number: string;
  customerName: string;
  note?: string | null;
  itemsCount: number;
  totalAmount: number;
  createdAtUtc: string;
}

export type ListProformasResponse = PageResult<ListProformasQueryDto>;

export interface CreateProformaItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateProformaRequest {
  number: string;
  customerName: string;
  note?: string | null;
  items: CreateProformaItemRequest[];
}
