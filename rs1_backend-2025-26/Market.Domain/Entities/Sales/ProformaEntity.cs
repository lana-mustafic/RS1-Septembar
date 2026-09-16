using Market.Domain.Common;

namespace Market.Domain.Entities.Sales;

public class ProformaEntity : BaseEntity
{
    public required string Number { get; set; }

    public required string CustomerName { get; set; }

    public string? Note { get; set; }

    public int ItemsCount { get; set; }

    public decimal TotalAmount { get; set; }

    // TODO (student): kolekcija stavki (1:N prema ProformaItemEntity).

    public static class Constraints
    {
        public const int NumberMaxLength = 20;
        public const int CustomerNameMaxLength = 200;
        public const int NoteMaxLength = 500;
        public const int QuantityMin = 1;
        public const int QuantityMax = 1000;
    }
}
