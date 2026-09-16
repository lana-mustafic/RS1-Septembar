// Dato u starteru: izvedeni status rezervacije i njegovi nazivi za prikaz.
// Ostale modele (list request/response, details, create/update) pise student,
// prema nazivima polja propisanim u tekstu zadatka.

export enum ReservationStateType {
  Aktivna = 1,
  Istekla = 2,
  Otkazana = 3,
}

export const RESERVATION_STATE_LABELS: Record<ReservationStateType, string> = {
  [ReservationStateType.Aktivna]: 'Aktivna',
  [ReservationStateType.Istekla]: 'Istekla',
  [ReservationStateType.Otkazana]: 'Otkazana',
};
