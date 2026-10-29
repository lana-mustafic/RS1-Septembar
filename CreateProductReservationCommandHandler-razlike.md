# CreateProductReservationCommandHandler — šta stoji i šta treba

Fajl: `rs1_backend-2025-26/Market.Application/Modules/Catalog/ProductReservations/Commands/Create/CreateProductReservationCommandHandler.cs`

Izvor ispravnog koda: korak 7 u `RS1_Modul1_Vodic.md`.

Tri mjesta se ne poklapaju. Ostalo (trim, učitavanje zalihe, jedinstvena oznaka, `SumAsync`, `SaveChangesAsync`) prati vodič.

## 1. Nepostojeći proizvod

Kod koji stoji ne kompajlira se. `ValidationException` nema konstruktor `(string, string)`, a `MarketExceptionHandler` za 400 čita samo listu `Errors`.

```csharp
if (product is null)
    throw new ValidationException(new[]
    {
        new ValidationException(nameof(request.ProductId), "Product is not found.")
    });
```

Kod koji treba da stoji. Na vrhu fajla treba `using FluentValidation.Results;`, jer `ValidationFailure` nije u globalnom `using FluentValidation`.

```csharp
if (product is null)
    throw new ValidationException(new[]
    {
        new ValidationFailure(nameof(request.ProductId), "Proizvod ne postoji ili je obrisan.")
    });
```

## 2. Zbir aktivnih rezervacija

Aktivna rezervacija nije otkazana i datum joj nije prije današnjeg UTC datuma. Trenutni uslov uzima otkazane, a prave aktivne izbacuje. Zato Tastatura (zaliha 10, aktivno 5) ne drži granicu: količina 5 treba proći, 6 treba vratiti 409.

```csharp
var activeSum = await context.ProductReservations
    .Where(x => x.ProductId == request.ProductId
    && x.IsCancelled
    && x.ReservedUntilUtc.Date >= todayUtc)
    .SumAsync(x => (int?)x.Quantity, cancellationToken) ?? 0;
```

```csharp
var activeSum = await ctx.ProductReservations
    .Where(x => x.ProductId == request.ProductId
         && !x.IsCancelled
         && x.ReservedUntilUtc.Date >= todayUtc)
    .SumAsync(x => (int?)x.Quantity, ct) ?? 0;
```

## 3. Snimanje nove rezervacije

Pri dodavanju se checkbox ne šalje. Backend mora snimiti neotkazanu rezervaciju.

```csharp
var entity = new ProductReservationEntity
{
    Code = code,
    ProductId = request.ProductId,
    Quantity = request.Quantity,
    ReservedUntilUtc = request.ReservedUntilUtc,
    IsCancelled = true
};
```

```csharp
var entity = new ProductReservationEntity
{
    Code = code,
    ProductId = request.ProductId,
    Quantity = request.Quantity,
    ReservedUntilUtc = request.ReservedUntilUtc,
    IsCancelled = false
};
```

## Cijeli handler koji treba da stoji

```csharp
using FluentValidation.Results;

namespace Market.Application.Modules.Catalog.ProductReservations.Commands.Create;

public sealed class CreateProductReservationCommandHandler(IAppDbContext ctx)
    : IRequestHandler<CreateProductReservationCommand, int>
{
    public async Task<int> Handle(CreateProductReservationCommand request, CancellationToken ct)
    {
        var todayUtc = DateTime.UtcNow.Date;
        var code = request.Code.Trim();

        var product = await ctx.Products
            .Where(p => p.Id == request.ProductId)
            .Select(p => new { p.StockQuantity })
            .FirstOrDefaultAsync(ct);

        if (product is null)
            throw new ValidationException(new[]
            {
                new ValidationFailure(nameof(request.ProductId), "Proizvod ne postoji ili je obrisan.")
            });

        var codeTaken = await ctx.ProductReservations.AnyAsync(
            x => x.Code.ToLower() == code.ToLower(),
            ct);

        if (codeTaken)
            throw new MarketConflictException("Oznaka rezervacije već postoji.");

        var activeSum = await ctx.ProductReservations
            .Where(x => x.ProductId == request.ProductId
                 && !x.IsCancelled
                 && x.ReservedUntilUtc.Date >= todayUtc)
            .SumAsync(x => (int?)x.Quantity, ct) ?? 0;

        if (activeSum + request.Quantity > product.StockQuantity)
        {
            throw new MarketConflictException(
                "Zbir aktivnih rezervacija prelazi zalihu proizvoda.");
        }

        var entity = new ProductReservationEntity
        {
            Code = code,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            ReservedUntilUtc = request.ReservedUntilUtc,
            IsCancelled = false
        };

        ctx.ProductReservations.Add(entity);
        await ctx.SaveChangesAsync(ct);

        return entity.Id;
    }
}
```
