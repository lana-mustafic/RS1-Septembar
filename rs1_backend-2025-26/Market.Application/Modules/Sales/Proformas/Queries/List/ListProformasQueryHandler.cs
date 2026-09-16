namespace Market.Application.Modules.Sales.Proformas.Queries.List;

public sealed class ListProformasQueryHandler(IAppDbContext ctx)
    : IRequestHandler<ListProformasQuery, PageResult<ListProformasQueryDto>>
{
    public async Task<PageResult<ListProformasQueryDto>> Handle(
        ListProformasQuery request,
        CancellationToken ct)
    {
        var query = ctx.Proformas.AsNoTracking();

        var total = await query.CountAsync(ct);
        var items = await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .ThenByDescending(x => x.Id)
            .Skip(request.Paging.SkipCount)
            .Take(request.Paging.PageSize)
            .Select(x => new ListProformasQueryDto
            {
                Id = x.Id,
                Number = x.Number,
                CustomerName = x.CustomerName,
                Note = x.Note,
                ItemsCount = x.ItemsCount,
                TotalAmount = x.TotalAmount,
                CreatedAtUtc = x.CreatedAtUtc
            })
            .ToListAsync(ct);

        return new PageResult<ListProformasQueryDto>
        {
            Items = items,
            PageSize = request.Paging.PageSize,
            CurrentPage = request.Paging.Page,
            IncludedTotal = true,
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)request.Paging.PageSize)
        };
    }
}
