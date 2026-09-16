namespace Market.Application.Modules.Sales.Proformas.Queries.List;

public sealed class ListProformasQueryDto
{
    public required int Id { get; init; }
    public required string Number { get; init; }
    public required string CustomerName { get; init; }
    public string? Note { get; init; }
    public required int ItemsCount { get; init; }
    public required decimal TotalAmount { get; init; }
    public required DateTime CreatedAtUtc { get; init; }
}
