using Market.Application.Modules.Sales.Proformas.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "Staff")]
public sealed class ProformasController(ISender sender) : ControllerBase
{
    [HttpGet]
    public Task<PageResult<ListProformasQueryDto>> List(
        [FromQuery] ListProformasQuery query,
        CancellationToken ct) => sender.Send(query, ct);

    // TODO (student): POST /Proformas - kreiranje predracuna sa stavkama.
}
