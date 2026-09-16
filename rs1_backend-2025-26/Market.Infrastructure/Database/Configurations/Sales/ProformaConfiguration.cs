using Market.Domain.Entities.Sales;

namespace Market.Infrastructure.Database.Configurations.Sales;

public sealed class ProformaConfiguration : IEntityTypeConfiguration<ProformaEntity>
{
    public void Configure(EntityTypeBuilder<ProformaEntity> builder)
    {
        builder.ToTable("Proformas");

        builder.Property(x => x.Number)
            .IsRequired()
            .HasMaxLength(ProformaEntity.Constraints.NumberMaxLength);

        builder.Property(x => x.CustomerName)
            .IsRequired()
            .HasMaxLength(ProformaEntity.Constraints.CustomerNameMaxLength);

        builder.Property(x => x.Note)
            .HasMaxLength(ProformaEntity.Constraints.NoteMaxLength);

        builder.Property(x => x.TotalAmount).HasPrecision(18, 2).IsRequired();
        builder.Property(x => x.ItemsCount).IsRequired();
    }
}
