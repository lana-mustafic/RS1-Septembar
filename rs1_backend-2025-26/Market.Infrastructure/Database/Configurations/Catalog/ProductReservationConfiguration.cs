namespace Market.Infrastructure.Database.Configurations.Catelog;

public sealed class ProductReservationConfiguration : IEntityTypeConfiguration<ProductReservationEntity>
{
    public void Configure(EntityTypeBuilder<ProductReservationEntity> builder)
    {
        builder.ToTable("ProductReservations");

        builder
            .Property(x => x.Code)
            .IsRequired()
            .HasMaxLength(ProductReservationEntity.Constraints.CodeMaxLength);

        builder
            .Property(x => x.Quantity)
            .IsRequired();

        builder
            .Property(x => x.ReservedUntilUtc)
            .IsRequired();

        builder
            .Property(x => x.IsCancelled)
            .IsRequired();

        builder
            .HasOne(x => x.Product)
            .WithMany()
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
