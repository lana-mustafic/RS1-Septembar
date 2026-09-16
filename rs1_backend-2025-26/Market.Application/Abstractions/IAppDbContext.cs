using Market.Domain.Entities.Sales;

namespace Market.Application.Abstractions;

// Application layer
public interface IAppDbContext
{
    DbSet<ProductEntity> Products { get; }
    DbSet<ProductCategoryEntity> ProductCategories { get; }
    DbSet<PromotionEntity> Promotions { get; }
    DbSet<ProductReservationEntity> ProductReservations { get; }
    DbSet<MarketUserEntity> Users { get; }
    DbSet<RefreshTokenEntity> RefreshTokens { get; }

    DbSet<OrderEntity> Orders{ get; }
    DbSet<OrderItemEntity> OrderItems { get; }


    DbSet<ProformaEntity> Proformas { get; }
    // TODO (student): DbSet za stavke predracuna.

    Task<int> SaveChangesAsync(CancellationToken ct);
}
