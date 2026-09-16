namespace Market.Application.Modules.Catalog.ProductReservations;

public static class ProductReservationRules
{
    public static ReservationStateType GetState(bool isCancelled, DateTime reservedUntilUtc, DateTime utcToday)
    {
        if (isCancelled)
            return ReservationStateType.Otkazana;

        return reservedUntilUtc.Date < utcToday.Date
            ? ReservationStateType.Istekla
            : ReservationStateType.Aktivna;
    }

    public static decimal GetReservationValue(decimal productPrice, int quantity)
        => Math.Round(
            productPrice * quantity,
            2,
            MidpointRounding.AwayFromZero);
}
