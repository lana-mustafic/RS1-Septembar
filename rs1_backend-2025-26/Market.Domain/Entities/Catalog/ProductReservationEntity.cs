using Market.Domain.Common;

namespace Market.Domain.Entities.Catalog;

public class ProductReservationEntity : BaseEntity
{
    public required string Code { get; set; }

    public int ProductId { get; set; }

    public ProductEntity? Product { get; set; }

    public int Quantity { get; set; }

    public DateTime ReservedUntilUtc { get; set; }

    public bool IsCancelled { get; set; }

    public static class Constraints
    {
        public const int CodeMaxLength = 20;
        public const int QuantityMin = 1;
        public const int QuantityMax = 1000;
    }
}
