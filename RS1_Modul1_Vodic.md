# RS1 — Modul 1 — Vodič (09.09.2026.)

> **Cilj ovog dokumenta:** Da možeš ispit doslovno pratiti korak po korak.  
> **Pravilo:** Prvo pročitaj šta starter već ima, zatim piši. Koristi `ProductCategories` i `Products` kao obrazac, ne kao gotovo rješenje.  
> **Izvor:** PDF `RS1-ispit-2026-09-09-starter-projekat-I-modul.pdf` + starter projekat.  
> **Mjerodavan je tekst zadatka**, ne slike u PDF-u.

---

## Sadržaj

1. [Šta se traži](#1-šta-se-traži)
2. [Šta ovaj vodič NIJE](#2-šta-ovaj-vodič-nije)
3. [Priprema okruženja na ispitu](#3-priprema-okruženja-na-ispitu)
4. [Šta starter već ima, a šta ti moraš napraviti](#4-šta-starter-već-ima-a-šta-ti-moraš-napraviti)
5. [Pregled arhitekture](#5-pregled-arhitekture)
6. [Mapa pojmova](#6-mapa-pojmova)
7. [Kako čitati ovaj zadatak](#7-kako-čitati-ovaj-zadatak)
8. [Bodovna tabela](#8-bodovna-tabela)
9. [Backend — korak po korak](#9-backend--korak-po-korak)
10. [Frontend — korak po korak](#10-frontend--korak-po-korak)
11. [Vizuelni tok rješenja](#11-vizuelni-tok-rješenja)
12. [Kako testirati](#12-kako-testirati)
13. [Najčešće greške i debug](#13-najčešće-greške-i-debug)
14. [Završna checklista prije predaje](#14-završna-checklist-prije-predaje)
15. [Kako razmišljati na ispitu](#15-kako-razmišljati-na-ispitu)
16. [Rječnik pojmova](#16-rječnik-pojmova)

---

## 1. Šta se traži

Na ispitu iz **Razvoja softvera I** od **09.09.2026.**, **Modul 1** je administratorski **CRUD za rezervacije proizvoda**.

U starteru je to eksplicitno označeno u sidebaru:

- **„Modul 1 — Rezervacije proizvoda“** → ruta `/admin/product-reservations`

**CRUD** znači:

| Slovo | Operacija | Šta korisnik radi |
|-------|-----------|-------------------|
| **C**reate | Dodavanje | Klikne „Nova rezervacija“, popuni formu, sačuva |
| **R**ead | Čitanje | Vidi tabelu + učita jednu rezervaciju za edit |
| **U**pdate | Izmjena | Klikne olovku, mijenja podatke (uključujući otkazanost) |
| **D**elete | Brisanje | Klikne kantu, potvrdi u modalu; smije se obrisati **samo otkazana** |

Radiš **dva sloja iste funkcionalnosti**:

| Sloj | Tehnologija | Gdje pišeš |
|------|-------------|------------|
| **Backend** | .NET Web API + CQRS | Visual Studio, `rs1_backend-2025-26.sln` |
| **Frontend** | Angular + Reactive Forms | VS Code, folder `rs1-frontend-2025-26` |

### Jednom rečenicom

Rezervacija veže **jedan proizvod**, **količinu** i **datum do kojeg važi**. Status (**Aktivna / Istekla / Otkazana**) se **ne čuva u bazi** — izračunava se. Vrijednost rezervacije se također **ne čuva** — računa se kao `cijena × količina`.

### Polja entiteta (već postoje)

| Polje | Tip | Značenje |
|-------|-----|----------|
| `Id` | `int` | Iz `BaseEntity` — ne pišeš ga |
| `Code` | `string` | Oznaka, npr. `REZ-0001`, max 20 |
| `ProductId` | `int` | FK na proizvod |
| `Product` | navigacija | Veza na `ProductEntity` |
| `Quantity` | `int` | Rezervisana količina |
| `ReservedUntilUtc` | `DateTime` | Datum do kojeg važi |
| `IsCancelled` | `bool` | Da li je otkazana |
| `CreatedAtUtc`, `ModifiedAtUtc`, `IsDeleted` | audit | Iz `BaseEntity` — ne diraš ručno |

### Status (`ReservationStateType`) — DAT, ne pišeš ga

| Vrijednost | Broj | Pravilo |
|------------|------|---------|
| `Aktivna` | 1 | nije otkazana **i** datum važenja **nije prije** današnjeg UTC datuma |
| `Istekla` | 2 | nije otkazana **i** datum važenja je **prije** današnjeg UTC datuma |
| `Otkazana` | 3 | `IsCancelled = true`, **nezavisno od datuma** |

Redoslijed iz PDF-a:

1. Ako je `IsCancelled = true` → **Otkazana**
2. Inače, ako je datum važenja prije `DateTime.UtcNow.Date` → **Istekla**
3. Inače → **Aktivna**

Rezervacija čiji je datum **jednak današnjem UTC datumu** smatra se **aktivnom** (npr. seed `REZ-0004`).

Ovo je već urađeno u `ProductReservationRules.GetState()`. **Ne pišeš tu klasu. Samo je pozivaš u list i get handleru.**

### Obavezna pravila (crveni okvir na ispitu)

- Backend: **CQRS** (Command / Query / Handler / Validator)
- Frontend: **Reactive Forms** za create i edit
- **Toast** za uspjeh i grešku
- **Paginacija** na listi
- **Modal** prije brisanja
- Ne troši vrijeme na dizajn — HTML/CSS već postoji
- **Ne mijenjaj** `Product.Price`, `Product.StockQuantity` niti postojeće module
- Rezervacije **ne mijenjaju zalihu** — samo je **provjeravaju**
- Za ovaj modul **nije potrebna nova migracija** niti izmjena postojećih entiteta

### Obavezne rute (ne smiješ mijenjati imena)

```
GET    /ProductReservations?productId=3&onlyActive=true&paging.page=1&paging.pageSize=5
GET    /ProductReservations/{id}
POST   /ProductReservations   { code, productId, quantity, reservedUntilUtc }
PUT    /ProductReservations/{id}   { code, productId, quantity, reservedUntilUtc, isCancelled }
DELETE /ProductReservations/{id}
```

---

## 2. Šta ovaj vodič NIJE

### Ovo NIJE Modul 2

Sidebar ima i **„Modul 2 — Predračuni“**. To je drugi ispit (`RS1_Modul2_Vodic.md`). **Ne radi predračune ovdje.**

### Šta NE smiješ izmišljati

Ako to **ne piše** u PDF-u Modula 1:

- novi entitet / novi enum / nova migracija (sve već postoji)
- mijenjanje `StockQuantity` proizvoda
- cache (`ICatalogCacheVersionService`)
- FormArray / stavke predračuna
- edit/delete predračuna
- poseban frontend endpoint „provjeri zalihu prije snimanja“ — PDF kaže da se **ne zahtijeva**
- novi exception handler / nova infrastruktura
- unique indeks u bazi — PDF kaže uniqueness u handleru, case-insensitive, uz ignorisanje obrisanih

---

## 3. Priprema okruženja na ispitu

### 3.1. Alati

| Alat | Za šta |
|------|--------|
| **Visual Studio 2026** | Backend |
| **VS Code** | Frontend |
| **SSMS** | Baza |
| **Browser** | Testiranje + Swagger |

### 3.2. Baza (SSMS)

1. Otvori **SQL Server Management Studio**
2. Server: `10.10.10.18`
3. Authentication: **SQL Server Authentication**
   - User: `sa`
   - Password: `test`
4. Kreiraj **novu bazu** imenom tvog **broja indeksa**

### 3.3. Connection string

Otvori: `rs1_backend-2025-26/Market.API/appsettings.json`

U `ConnectionStrings` → `Main` zamijeni `Database=` na **ime tvoje baze**.

Starter trenutno ima:

```
Server=10.10.10.18,1433;Database=_broj_indeksa2026-09-09;User ID=sa;Password=test;...
```

Stavi svoj indeks umjesto `_broj_indeksa2026-09-09`.

### 3.4. Preuzimanje (na pravom ispitu)

- FTP: `ftp.fit.ba`
- Username / password: `student_aj`
- Fajl: `RS1-ispit-2026-09-09-starter-projekat.zip`
- Kopiraj ZIP na desktop i otpakuj

### 3.5. NPM u učionici

PowerShell blokira `npm.ps1`.

1. U terminalu ukucaj `cmd` i Enter
2. Zatim: `npm install` pa `npm start`

Ako `ng` nije prepoznat:

```
npx ng g c naziv-komponente
```

**Za ovaj ispit ne trebaš generisati nove komponente** — list/add/edit već postoje.

### 3.6. Redoslijed pokretanja

1. **Prvo backend** — `Market.API` (F5). Swagger: `http://localhost:7001/swagger`
2. **Zatim frontend** — u `rs1-frontend-2025-26`: `npm install` → `npm start`
3. Frontend: `http://localhost:4200`
4. Prijava (seed): `admin@market.local` / `Admin123!`

Aplikacija pri startu sama radi `MigrateAsync` i seed. Testni podaci (8 proizvoda + 12 rezervacija) ulaze automatski.

### 3.7. Trajanje i predaja

- Trajanje: **100 min + 20 min dodatno**
- Upload: **jedan ZIP** (backend + frontend), **obriši `node_modules`**

---

## 4. Šta starter već ima, a šta ti moraš napraviti

### Već postoji — NE DIRATI

| Šta | Gdje |
|-----|------|
| `ProductReservationEntity` | `Market.Domain/Entities/Catalog/ProductReservationEntity.cs` |
| Enum `ReservationStateType` | `ReservationStateType.cs` |
| `ProductReservationRules.GetState()` i `GetReservationValue()` | `Market.Application/Modules/Catalog/ProductReservations/ProductReservationRules.cs` |
| EF konfiguracija + tabela + migracija `Init` | `ProductReservationConfiguration.cs`, `20260909001905_Init` |
| `DbSet<ProductReservationEntity> ProductReservations` | `DatabaseContext` i `IAppDbContext` |
| Seed 12 rezervacija + 8 ispitnih proizvoda | `DynamicDataSeeder.cs` |
| `GET /ExamProducts/lookup` | backend + `ExamProductsApiService` |
| Sidebar, rute, AdminModule deklaracije | već registrovano |
| Kostur liste, add i edit HTML/TS | `catalogs/product-reservations/` |
| Paging, toast, dialog, error interceptor | `core/` i `shared/` |
| Enum + labele na frontendu | `product-reservations-api.models.ts` |

### Ti moraš napraviti

**Backend (nema ničega od CQRS/kontrolera):**

- `Queries/List` — query, DTO, handler
- `Queries/GetById` — query, DTO, handler
- `Commands/Create` — command, handler, validator
- `Commands/Update` — command, handler, validator
- `Commands/Delete` — command, handler
- `ProductReservationsController`

**Frontend:**

- dopuniti modele u `product-reservations-api.models.ts`
- **kreirati** `product-reservations-api.service.ts` (ne postoji)
- povezati listu, filtere, paginator, delete modal
- validatori + submit na add i edit
- toast, redirect, disabled Sačuvaj / Obriši

### Šta je namjerno pokvareno (profesor to očekuje)

1. Lista ima **DEMO redove**, ne API.
2. Filteri nisu povezani (`mat-select` i `mat-checkbox` bez bindinga).
3. Paginator nema `length` / `pageIndex` / `(page)`.
4. `load()`, `add()`, `edit()`, `delete()` su prazni.
5. Add/edit forme nemaju validatore, lookup ni HTTP poziv.
6. Nema API servisa za rezervacije.
7. Dugme Obriši je aktivno za sve redove — smije samo za **Otkazana**.

---

## 5. Pregled arhitekture

```
RS1-ispit-2026-09-09-share/
├── rs1_backend-2025-26/     ← Visual Studio
└── rs1-frontend-2025-26/    ← VS Code
```

| Projekt | Uloga | Gdje pišeš za ovaj zadatak |
|---------|-------|----------------------------|
| **Market.Domain** | Entiteti, enumi | **Ne diraš** — već gotovo |
| **Market.Application** | CQRS | `Modules/Catalog/ProductReservations/` |
| **Market.Infrastructure** | Baza, EF | **Ne diraš** |
| **Market.API** | REST | `Controllers/ProductReservationsController.cs` |
| **Market.Shared** | Opcije, ErrorDto | **Ne diraš** |

**Nema Repository patterna.** Handler koristi `IAppDbContext`.

MediatR i FluentValidation se **sami registruju** iz assembly-ja. Novi handler/validator se ne registruje ručno.

---

## 6. Mapa pojmova

| Pojam sa starijih predmeta | Gdje je ovdje |
|----------------------------|---------------|
| Model | `ProductReservationEntity` — već postoji |
| DbContext | `DatabaseContext` — već ima `DbSet` |
| Repository | **Ne postoji** — `IAppDbContext` u handleru |
| Status kolona | **Ne postoji** — `ProductReservationRules.GetState()` |
| Forma | `.component.html` + Reactive Forms |
| Tabela | `mat-table` |
| ComboBox | `mat-select` |
| Validacija BE | `*Validator.cs` + poslovna pravila u handleru |
| Validacija FE | `Validators` na `FormGroup` |
| Toast | `ToasterService` |
| Modal | `DialogHelperService` |
| Soft delete | `Remove()` → interceptor stavi `IsDeleted = true` |
| Greška 400/404/409 | `ValidationException` / `MarketNotFoundException` / `MarketConflictException` |

---

## 7. Kako čitati ovaj zadatak

### Tri pitanja

1. **Koji entitet?** → `ProductReservationEntity` (već postoji)
2. **Koje operacije?** → List + GetById + Create + Update + Delete
3. **Koja poslovna pravila?** → jedinstvena oznaka, zbir aktivnih ≤ zaliha, datum danas/budućnost samo pri create, brisanje samo otkazanih

### Ključne riječi iz PDF-a

| Fraza | Šta znači za tebe |
|-------|-------------------|
| „status je izveden“ | Ne čuvaš `State` u bazi. Pozivaš `GetState()` u handleru. |
| „vrijednost ne snimati“ | `GetReservationValue()` u list DTO, ne nova kolona |
| „Trim i case-insensitive“ | `Trim()` pa `ToLower()` pri usporedbi oznake |
| „izuzimanje trenutnog Id-a“ | `x.Id != request.Id` pri update |
| „ignorisanje obrisanih“ | Globalni filter već skriva `IsDeleted`; ne radi `IgnoreQueryFilters` |
| „AND filteri“ | `productId` i `onlyActive` zajedno, na backendu, prije `Count` |
| „HTTP 409“ | `throw new MarketConflictException("...")` |
| „HTTP 404“ | nepostojeći Id rezervacije |
| „HTTP 400“ | FluentValidation (format, količina, datum pri create, proizvod) |
| „soft delete“ | `Remove(entity)` — ne `IsDeleted = true` ručno |
| „CreatedAtUtc se ne mijenja“ | U update handleru ne diraj to polje |
| „IsCancelled = false pri create“ | Checkbox se ne šalje; handler postavlja `false` |
| „Sačuvaj disabled“ | `[disabled]="form.invalid \|\| isSaving"` |
| „backend poruku onako kako je vraća“ | `getErrorMessage(err)` — ne generički tekst |

---

## 8. Bodovna tabela

Iz PDF-a. Ako uradiš samo BE ili samo FE, boduje se urađena strana.

| Br. | Funkcionalnost | BE | FE | Ukupno |
|-----|----------------|----|----|--------|
| 1 | Lista | 6 | 3 | 9 |
| 2 | Paginacija | 4 | 2 | 6 |
| 3 | Dva filtera | 6 | 3 | 9 |
| 4 | FE validacija | — | 9 | 9 |
| 5 | BE osnovna validacija | 9 | — | 9 |
| 6 | Jedinstvena oznaka | 7 | — | 7 |
| 7 | Zbir rezervacija i zaliha | 9 | — | 9 |
| 8 | Create | 9 | — | 9 |
| 9 | Get/update | 9 | — | 9 |
| 10 | Datum rezervacije | 6 | — | 6 |
| 11 | Modal i delete | 6 | 5 | 11 |
| 12 | Tok nakon akcija | — | 3 | 3 |
| 13 | Toaster | — | 4 | 4 |
| | **Ukupno** | **71** | **29** | **100** |

**Ne boduje se** pisanje `ProductReservationRules` niti enuma — dati su. Moraš ih **pozvati**.

---

## 9. Backend — korak po korak

**Uzorak za CRUD:** `Market.Application/Modules/Catalog/ProductCategories/` i `Market.API/Controllers/ProductCategoriesController.cs`.

**Uzorak za policy:** `ExamProductsController` koristi `[Authorize(Policy = "Staff")]` — isto stavi na rezervacije.

**Ne kopiraj** `ICatalogCacheVersionService` iz kategorija. To nije dio ovog zadatka.

Folder koji praviš:

```
Market.Application/Modules/Catalog/ProductReservations/
├── ProductReservationRules.cs          ← VEĆ POSTOJI
├── Queries/
│   ├── List/
│   │   ├── ListProductReservationsQuery.cs
│   │   ├── ListProductReservationsQueryDto.cs
│   │   └── ListProductReservationsQueryHandler.cs
│   └── GetById/
│       ├── GetProductReservationByIdQuery.cs
│       ├── GetProductReservationByIdQueryDto.cs
│       └── GetProductReservationByIdQueryHandler.cs
└── Commands/
    ├── Create/
    │   ├── CreateProductReservationCommand.cs
    │   ├── CreateProductReservationCommandHandler.cs
    │   └── CreateProductReservationCommandValidator.cs
    ├── Update/
    │   ├── UpdateProductReservationCommand.cs
    │   ├── UpdateProductReservationCommandHandler.cs
    │   └── UpdateProductReservationCommandValidator.cs
    └── Delete/
        ├── DeleteProductReservationCommand.cs
        └── DeleteProductReservationCommandHandler.cs
```

Plus:

```
Market.API/Controllers/ProductReservationsController.cs
```

---

### Korak 1 — Pročitaj dato, ništa ne piši

Otvori redom:

1. `ProductReservationEntity.cs` — polja i `Constraints` (`CodeMaxLength = 20`, `QuantityMin = 1`, `QuantityMax = 1000`)
2. `ReservationStateType.cs`
3. `ProductReservationRules.cs`
4. `DynamicDataSeeder.SeedProductReservationsAsync` — komentari su **test scenariji**
5. `ListProductCategoriesQueryHandler.cs` — obrazac liste
6. `CreateProductCategoryCommandValidator.cs` — obrazac validatora

**Zašto:** Da ne kreneš praviti entitet i migraciju. PDF kaže da to već postoji.

### Provjera

- `Constraints.QuantityMax` je 1000 — to koristiš u validatoru.
- `GetState(isCancelled, reservedUntilUtc, utcToday)` i `GetReservationValue(price, quantity)` postoje.
- Seed kaže: Tastatura 10 na stanju / 5 aktivno → nova količina 5 prolazi, 6 pada.

---

### Korak 2 — List DTO

**Gdje:** `Market.Application/Modules/Catalog/ProductReservations/Queries/List/`

**Fajl:** `ListProductReservationsQueryDto.cs`

**Klasa:** `ListProductReservationsQueryDto`

PDF traži u listi: oznaku, naziv proizvoda, cijenu, količinu, vrijednost, datum, tekstualni status. Frontend HTML već očekuje tačno ova imena (camelCase JSON).

`Id` moraš vratiti zbog edit/delete. `IsCancelled` nije nužan ako vraćaš `State`, ali ne smeta.

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Queries.List;

public sealed class ListProductReservationsQueryDto
{
    public required int Id { get; init; }
    public required string Code { get; init; }
    public required int ProductId { get; init; }
    public required string ProductName { get; init; }
    public required decimal ProductPrice { get; init; }
    public required int Quantity { get; init; }
    public required decimal ReservationValue { get; init; }
    public required DateTime ReservedUntilUtc { get; init; }
    public required bool IsCancelled { get; init; }
    public required ReservationStateType State { get; init; }
}
```

**Zašto `State` i `ReservationValue` na backendu?** PDF: *„Status i vrijednost vratiti iz list DTO-a; frontend ih ne računa ponovo.“*

### Provjera

Build prolazi. Još nema handler — to je OK.

---

### Korak 3 — List query (filteri + paging)

**Fajl:** `ListProductReservationsQuery.cs`

Nasljeđuje `BasePagedQuery<T>` — to već nosi `Paging.Page` i `Paging.PageSize`.

Imena query parametara su **propisana**: `productId`, `onlyActive`.

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Queries.List;

public sealed class ListProductReservationsQuery
    : BasePagedQuery<ListProductReservationsQueryDto>
{
    public int? ProductId { get; init; }
    public bool? OnlyActive { get; init; }
}
```

**Zašto `int?` i `bool?`:** prazan dropdown = svi proizvodi (`null`). Checkbox isključen = sva tri statusa (`null` ili `false`). Filtriraš **samo** kad je `OnlyActive == true`.

`?` stoji na **upitu**, jer je filter opcioni. Na entitetu `ProductId` nema `?`: svaka rezervacija u bazi mora imati proizvod. Na create/update komandi `ProductId` je isto običan `int`, a `ProductId > 0` je tamo validacija (`.GreaterThan(0)`), ne filter liste.

### Provjera

U Swaggeru kasnije moraš vidjeti `productId`, `onlyActive`, `paging.page`, `paging.pageSize`.

---

### Korak 4 — List handler

**Fajl:** `ListProductReservationsQueryHandler.cs`

**Uzorak pagiranja:** `ListProformasQueryHandler` (ručni `Count` + `Skip/Take`) ili `PageResult.FromQueryableAsync`.

**Važno:** `ProductReservationRules.GetState()` EF **ne može** prevesti u SQL unutar `.Select()`. Zato:

1. filtriraj i paginiraj u SQL
2. zatim u memoriji pozovi `GetState` i `GetReservationValue`

Jedna referentna vrijednost današnjeg datuma **po zahtjevu** (PDF). Ime je `todayUtc`, isto kao na augustu:

```csharp
var todayUtc = DateTime.UtcNow.Date;
```

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Queries.List;

public sealed class ListProductReservationsQueryHandler(IAppDbContext ctx)
    : IRequestHandler<ListProductReservationsQuery, PageResult<ListProductReservationsQueryDto>>
{
    public async Task<PageResult<ListProductReservationsQueryDto>> Handle(
        ListProductReservationsQuery request,
        CancellationToken ct)
    {
        var todayUtc = DateTime.UtcNow.Date;

        var q = ctx.ProductReservations.AsNoTracking();

        if (request.ProductId is > 0)
            q = q.Where(x => x.ProductId == request.ProductId);

        if (request.OnlyActive == true)
        {
            q = q.Where(x => !x.IsCancelled && x.ReservedUntilUtc.Date >= todayUtc);
        }

        q = q
            .OrderByDescending(x => x.CreatedAtUtc)
            .ThenByDescending(x => x.Id);

        var total = await q.CountAsync(ct);

        var raw = await q
            .Skip(request.Paging.SkipCount)
            .Take(request.Paging.PageSize)
            .Select(x => new
            {
                x.Id,
                x.Code,
                x.ProductId,
                ProductName = x.Product!.Name,
                ProductPrice = x.Product.Price,
                x.Quantity,
                x.ReservedUntilUtc,
                x.IsCancelled
            })
            .ToListAsync(ct);

        var items = raw.Select(x =>
        {
            var state = ProductReservationRules.GetState(x.IsCancelled, x.ReservedUntilUtc, todayUtc);

            return new ListProductReservationsQueryDto
            {
                Id = x.Id,
                Code = x.Code,
                ProductId = x.ProductId,
                ProductName = x.ProductName,
                ProductPrice = x.ProductPrice,
                Quantity = x.Quantity,
                ReservationValue = ProductReservationRules.GetReservationValue(x.ProductPrice, x.Quantity),
                ReservedUntilUtc = DateTime.SpecifyKind(x.ReservedUntilUtc, DateTimeKind.Utc),
                IsCancelled = x.IsCancelled,
                State = state
            };
        }).ToList();

        return new PageResult<ListProductReservationsQueryDto>
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
```

**Zašto `is > 0`:** isto kao august. `request.ProductId` je `int?`. `is > 0` pušta samo stvarni id, pa se `Where` ne doda kad dropdown stoji na „Svi proizvodi“. Unutar `Where` ostaje `request.ProductId`. `is int productId` ne pišeš: `0` bi prošao i vratio praznu stranicu.

**Zašto filter prije `Count`:** PDF: *„Oba filtera rade na backendu prije brojanja i paginacije.“* Ako filtriraš tek na frontendu, total će biti 12 umjesto 4.

**Zašto `ReservedUntilUtc.Date >= todayUtc`:** isto pravilo kao `GetState` za Aktivna. Ako `Date` u LINQ-u baci problem pri prevodu u SQL, koristi `x.ReservedUntilUtc >= todayUtc` — seed datumi su ponoć UTC.

`SpecifyKind(..., Utc)` je isti razlog kao na augustu: date pipe sa `'UTC'` ne smije pomjeriti dan.

**Ne filtriraj obrisane ručno.** Globalni query filter već radi `IsDeleted == false`.

### Provjera

Još nemaš kontroler — sljedeći koraci. Kad kontroler bude gotov:

- bez filtera, `pageSize=5` → 5 redova, `totalItems=12`
- `onlyActive=true` → `totalItems=4`
- `REZ-0004` ostaje u aktivnima (današnji datum)

---

### Korak 5 — GetById

**Folder:** `Queries/GetById/`

PDF: forma se puni podacima dohvaćenim po Id-u. Nepostojeći Id → **404**.

Pozovi `GetState` i ovdje (PDF: *„student ih poziva iz svojih list i get handlera“*). Formi trebaju polja za prefill: `code`, `productId`, `quantity`, `reservedUntilUtc`, `isCancelled`.

`GetProductReservationByIdQuery.cs`

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Queries.GetById;

public sealed class GetProductReservationByIdQuery : IRequest<GetProductReservationByIdQueryDto>
{
    public int Id { get; init; }
}
```

`GetProductReservationByIdQueryDto.cs`

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Queries.GetById;

public sealed class GetProductReservationByIdQueryDto
{
    public required int Id { get; init; }
    public required string Code { get; init; }
    public required int ProductId { get; init; }
    public required int Quantity { get; init; }
    public required DateTime ReservedUntilUtc { get; init; }
    public required bool IsCancelled { get; init; }
    public required ReservationStateType State { get; init; }
    public required decimal ReservationValue { get; init; }
}
```

`GetProductReservationByIdQueryHandler.cs`

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Queries.GetById;

public sealed class GetProductReservationByIdQueryHandler(IAppDbContext ctx)
    : IRequestHandler<GetProductReservationByIdQuery, GetProductReservationByIdQueryDto>
{
    public async Task<GetProductReservationByIdQueryDto> Handle(
        GetProductReservationByIdQuery request,
        CancellationToken ct)
    {
        var todayUtc = DateTime.UtcNow.Date;

        var row = await ctx.ProductReservations
            .AsNoTracking()
            .Where(x => x.Id == request.Id)
            .Select(x => new
            {
                x.Id,
                x.Code,
                x.ProductId,
                x.Quantity,
                x.ReservedUntilUtc,
                x.IsCancelled,
                Price = x.Product!.Price
            })
            .FirstOrDefaultAsync(ct);

        if (row is null)
            throw new MarketNotFoundException($"Rezervacija (ID={request.Id}) nije pronađena.");

        var state = ProductReservationRules.GetState(row.IsCancelled, row.ReservedUntilUtc, todayUtc);

        return new GetProductReservationByIdQueryDto
        {
            Id = row.Id,
            Code = row.Code,
            ProductId = row.ProductId,
            Quantity = row.Quantity,
            ReservedUntilUtc = DateTime.SpecifyKind(row.ReservedUntilUtc, DateTimeKind.Utc),
            IsCancelled = row.IsCancelled,
            State = state,
            ReservationValue = ProductReservationRules.GetReservationValue(row.Price, row.Quantity)
        };
    }
}
```

`MarketNotFoundException` dolazi iz `Market.Application.Common.Exceptions` preko `GlobalUsings` — ne dodaji novi using ako build već vidi klasu.

### Provjera

GET postojeći Id → 200 i polja forme. GET `99999` → 404.

---

### Korak 6 — Create command + validator

**Folder:** `Commands/Create/`

Body iz PDF-a: `{ code, productId, quantity, reservedUntilUtc }` — **nema** `isCancelled`.

`CreateProductReservationCommand.cs`

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Commands.Create;

public sealed class CreateProductReservationCommand : IRequest<int>
{
    public required string Code { get; init; }
    public required int ProductId { get; init; }
    public required int Quantity { get; init; }
    public required DateTime ReservedUntilUtc { get; init; }
}
```

`CreateProductReservationCommandValidator.cs`

Osnovna validacija = **400** (FluentValidation pipeline već baca `ValidationException`).

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Commands.Create;

public sealed class CreateProductReservationCommandValidator
    : AbstractValidator<CreateProductReservationCommand>
{
    public CreateProductReservationCommandValidator()
    {
        RuleFor(x => x.Code)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Oznaka je obavezna.")
            .Must(code => code.Trim().Length is >= 5 and <= 20)
                .WithMessage("Oznaka mora imati 5 do 20 znakova.")
            .Must(code => code.Trim().StartsWith("REZ-", StringComparison.Ordinal))
                .WithMessage("Oznaka mora počinjati sa REZ-.");

        RuleFor(x => x.ProductId)
            .GreaterThan(0)
            .WithMessage("Proizvod je obavezan.");

        RuleFor(x => x.Quantity)
            .InclusiveBetween(1, 1000)
            .WithMessage("Količina mora biti cijeli broj od 1 do 1000.");

        RuleFor(x => x.ReservedUntilUtc)
            .Cascade(CascadeMode.Stop)
            .Must(date => date != default)
                .WithMessage("Datum važenja je obavezan.")
            .Must(date => date.Date >= DateTime.UtcNow.Date)
                .WithMessage("Datum važenja mora biti današnji ili budući UTC datum.");
    }
}
```

**Zašto `StartsWith(..., StringComparison.Ordinal)`:** PDF kaže **case-sensitive**. `REZ-` prolazi, `rez-` ne prolazi. `CascadeMode.Stop` zaustavlja dalja pravila ako je oznaka prazna, pa se `Trim()` ne zove na `null`.

**Zašto datum samo ovdje:** PDF: *„Pri kreiranju mora biti današnji ili budući UTC datum. Pri izmjeni se datum ne provjerava dodatno.“*

### Provjera

Pogrešan prefix, količina 0, jučerašnji datum → 400. Još nema handler.

---

### Korak 7 — Create handler (snimanje + 409 pravila)

**Fajl:** `CreateProductReservationCommandHandler.cs`

Redoslijed u handleru, isti kao kod ponuda:

1. Trim koda.
2. Proizvod mora postojati (obrisane skida globalni filter). Ako ne postoji → **400**. Ovde ne ide `AnyAsync`: za zalihu treba `StockQuantity`, pa `Select` i `FirstOrDefaultAsync`.
3. Jedinstvena oznaka, `ToLower`, među neobrisanim → **409**.
4. Zbir aktivnih količina + nova količina ne smije preći zalihu → **409**. Aktivna = nije otkazana i `ReservedUntilUtc.Date >= todayUtc`.
5. Snimi. `IsCancelled = false`. `CreatedAtUtc` ne postavljaj.

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

`using FluentValidation.Results` ostaje: `ValidationFailure` nije u globalnom `using FluentValidation`. String `new ValidationException("...")` ne koristi. `MarketExceptionHandler` za 400 čita samo `Errors`, a taj konstruktor ostavi listu praznu, pa toast pokaže `Validation failed:`.

**Zašto `SumAsync((int?)x.Quantity) ?? 0`:** ako nema redova, `Sum` na praznom skupu integera zna baciti. Nullable suma vraća `null` → 0. August ovdje ima `AnyAsync`, jer tamo pravilo pita postoji li već aktivna ponuda. Ovdje se količine sabiraju.

**Zašto `IsCancelled = false`:** PDF: checkbox se pri dodavanju ne prikazuje; backend postavlja neotkazanost. Isti obrazac kao `IsEnabled = true` na ponudi.

**Zašto ne postavljaš `CreatedAtUtc`:** `ApplyAuditAndSoftDelete` to radi sam.

### Provjera (kad bude kontroler)

Seed Tastatura, zaliha 10, aktivno 5:

- `quantity: 5` → 201/200 i novi Id
- `quantity: 6` → **409**
- isti `code` kao `REZ-0001` (bilo koje veličine slova) → **409**
- `productId: 99999` → **400**
- jučerašnji datum → **400**

---

### Korak 8 — Update command + validator

**Folder:** `Commands/Update/`

Body: `{ code, productId, quantity, reservedUntilUtc, isCancelled }`. Id dolazi iz URL-a.

Kao kod kategorija: `[JsonIgnore] public int Id` da klijent ne može podmetnuti tuđi Id u bodyju.

`UpdateProductReservationCommand.cs`

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Commands.Update;

public sealed class UpdateProductReservationCommand : IRequest<Unit>
{
    [JsonIgnore]
    public int Id { get; set; }

    public required string Code { get; init; }
    public required int ProductId { get; init; }
    public required int Quantity { get; init; }
    public required DateTime ReservedUntilUtc { get; init; }
    public required bool IsCancelled { get; init; }
}
```

Validator — **ista pravila kao create, osim datuma**:

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Commands.Update;

public sealed class UpdateProductReservationCommandValidator
    : AbstractValidator<UpdateProductReservationCommand>
{
    public UpdateProductReservationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);

        RuleFor(x => x.Code)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Oznaka je obavezna.")
            .Must(code => code.Trim().Length is >= 5 and <= 20)
                .WithMessage("Oznaka mora imati 5 do 20 znakova.")
            .Must(code => code.Trim().StartsWith("REZ-", StringComparison.Ordinal))
                .WithMessage("Oznaka mora počinjati sa REZ-.");

        RuleFor(x => x.ProductId)
            .GreaterThan(0)
            .WithMessage("Proizvod je obavezan.");

        RuleFor(x => x.Quantity)
            .InclusiveBetween(1, 1000)
            .WithMessage("Količina mora biti cijeli broj od 1 do 1000.");

        RuleFor(x => x.ReservedUntilUtc)
            .Must(date => date != default)
            .WithMessage("Datum važenja je obavezan.");
    }
}
```

Nema `Must(d => d.Date >= UtcNow.Date)` — PDF to zabranjuje pri izmjeni.

---

### Korak 9 — Update handler

Razlike u odnosu na create:

- 404 ako zapis ne postoji
- jedinstvenost **izuzima trenutni Id**
- zbir aktivnih **izuzima trenutni Id**
- ako se mijenja u otkazanu (`IsCancelled = true`), **provjera zalihe se ne radi**
- **ne diraj** `CreatedAtUtc`

```csharp
using FluentValidation.Results;

namespace Market.Application.Modules.Catalog.ProductReservations.Commands.Update;

public sealed class UpdateProductReservationCommandHandler(IAppDbContext ctx)
    : IRequestHandler<UpdateProductReservationCommand, Unit>
{
    public async Task<Unit> Handle(UpdateProductReservationCommand request, CancellationToken ct)
    {
        var todayUtc = DateTime.UtcNow.Date;
        var code = request.Code.Trim();

        var entity = await ctx.ProductReservations
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Rezervacija (ID={request.Id}) nije pronađena.");

        var product = await ctx.Products
            .AsNoTracking()
            .Where(p => p.Id == request.ProductId)
            .Select(p => new { p.StockQuantity })
            .FirstOrDefaultAsync(ct);

        if (product is null)
        {
            throw new ValidationException(new[]
            {
                new ValidationFailure(nameof(request.ProductId), "Proizvod ne postoji ili je obrisan.")
            });
        }

        var codeTaken = await ctx.ProductReservations.AnyAsync(
            x => x.Id != request.Id && x.Code.ToLower() == code.ToLower(),
            ct);

        if (codeTaken)
            throw new MarketConflictException("Oznaka rezervacije već postoji.");

        if (!request.IsCancelled)
        {
            var activeSum = await ctx.ProductReservations
                .Where(x => x.Id != request.Id
                    && x.ProductId == request.ProductId
                    && !x.IsCancelled
                    && x.ReservedUntilUtc.Date >= todayUtc)
                .SumAsync(x => (int?)x.Quantity, ct) ?? 0;

            if (activeSum + request.Quantity > product.StockQuantity)
            {
                throw new MarketConflictException(
                    "Zbir aktivnih rezervacija prelazi zalihu proizvoda.");
            }
        }

        entity.Code = code;
        entity.ProductId = request.ProductId;
        entity.Quantity = request.Quantity;
        entity.ReservedUntilUtc = request.ReservedUntilUtc;
        entity.IsCancelled = request.IsCancelled;
        // CreatedAtUtc NE DIRATI

        await ctx.SaveChangesAsync(ct);
        return Unit.Value;
    }
}
```

**Tipična greška:** u zbir uračunati isteklu ili otkazanu. Seed namjerno ima:

- USB memorija: aktivno 5, istekla 10 — ko saberu 15, odbija sve
- Web kamera: otkazana 2, zaliha 6 — ko saberu otkazanu, krivo odbija

### Provjera

- PUT nepostojeći Id → 404
- PUT `REZ-0001` na tuđi kod `REZ-0002` → 409
- PUT istu svoju oznaku → prolazi (izuzet Id)
- otkaži rezervaciju čak i kad bi zbir bio prekoračen → prolazi
- `CreatedAtUtc` u bazi ostaje isti

---

### Korak 10 — Delete

**Folder:** `Commands/Delete/`

PDF:

- smije se brisati **samo otkazana**
- backend ponavlja provjeru
- zabranjeni zahtjev → **409**, bez izmjene
- brisanje je **meko** (`Remove` → `IsDeleted = 1`)

`DeleteProductReservationCommand.cs`

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Commands.Delete;

public sealed class DeleteProductReservationCommand : IRequest<Unit>
{
    public required int Id { get; init; }
}
```

`DeleteProductReservationCommandHandler.cs`

```csharp
namespace Market.Application.Modules.Catalog.ProductReservations.Commands.Delete;

public sealed class DeleteProductReservationCommandHandler(IAppDbContext ctx)
    : IRequestHandler<DeleteProductReservationCommand, Unit>
{
    public async Task<Unit> Handle(DeleteProductReservationCommand request, CancellationToken ct)
    {
        var entity = await ctx.ProductReservations
            .FirstOrDefaultAsync(x => x.Id == request.Id, ct);

        if (entity is null)
            throw new MarketNotFoundException($"Rezervacija (ID={request.Id}) nije pronađena.");

        if (!entity.IsCancelled)
        {
            throw new MarketConflictException(
                "Rezervacija se može obrisati samo ako je otkazana.");
        }

        ctx.ProductReservations.Remove(entity);
        await ctx.SaveChangesAsync(ct);

        return Unit.Value;
    }
}
```

**Ne kopiraj** `if (!appCurrentUser.IsAdmin)` iz `DeleteProductCommandHandler`. To nije u PDF-u.

**Ne radi** `entity.IsDeleted = true` ručno. `Remove` + interceptor.

Istekla **nije** otkazana — DELETE na `REZ-0002` mora biti 409.

### Provjera

- DELETE `REZ-0003` (otkazana) → 204, nestane s liste
- DELETE aktivne ili istekle → 409
- DELETE isti Id ponovo → 404 (globalni filter je više ne vidi)

---

### Korak 11 — Kontroler

**Gdje:** `Market.API/Controllers/`

**Fajl:** `ProductReservationsController.cs`

**Uzorak:** `ProductCategoriesController` za 5 akcija, `ExamProductsController` za `[Authorize(Policy = "Staff")]` i `[Route("[controller]")]`.

Ime kontrolera **mora** biti `ProductReservationsController` da ruta bude `/ProductReservations`.

```csharp
using Market.Application.Modules.Catalog.ProductReservations.Commands.Create;
using Market.Application.Modules.Catalog.ProductReservations.Commands.Delete;
using Market.Application.Modules.Catalog.ProductReservations.Commands.Update;
using Market.Application.Modules.Catalog.ProductReservations.Queries.GetById;
using Market.Application.Modules.Catalog.ProductReservations.Queries.List;

namespace Market.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "Staff")]
public sealed class ProductReservationsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<PageResult<ListProductReservationsQueryDto>> List(
        [FromQuery] ListProductReservationsQuery query,
        CancellationToken ct)
    {
        return await sender.Send(query, ct);
    }

    [HttpGet("{id:int}")]
    public async Task<GetProductReservationByIdQueryDto> GetById(int id, CancellationToken ct)
    {
        return await sender.Send(new GetProductReservationByIdQuery { Id = id }, ct);
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create(
        CreateProductReservationCommand command,
        CancellationToken ct)
    {
        var id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    [HttpPut("{id:int}")]
    public async Task Update(
        int id,
        UpdateProductReservationCommand command,
        CancellationToken ct)
    {
        command.Id = id;
        await sender.Send(command, ct);
    }

    [HttpDelete("{id:int}")]
    public async Task Delete(int id, CancellationToken ct)
    {
        await sender.Send(new DeleteProductReservationCommand { Id = id }, ct);
    }
}
```

**Zašto `command.Id = id`:** PDF i postojeći projekat: Id iz rute ima prednost.

**Zašto `new { id }`:** isti `CreatedAtAction` obrazac kao kategorije i august. Frontend ne čita body, samo čeka uspjeh.

### Provjera — NE IDI NA FRONTEND DOK OVO NE RADI

U Swaggeru (uloguj se pa Authorize):

| Poziv | Očekivano |
|-------|-----------|
| GET `/ProductReservations?paging.page=1&paging.pageSize=5` | 5 redova, `totalItems=12` |
| GET `onlyActive=true` | `totalItems=4` |
| GET `/{id}` seed zapisa | 200, forma polja |
| GET `/99999` | 404 |
| POST validan na Adapter (nema aktivnih) | 201 + Id |
| POST `code: "rez-0099"` | 400 (prefix case-sensitive) |
| POST `code: "REZ-0001"` | 409 |
| POST Tastatura `quantity: 6` | 409 |
| PUT otkaži | 204 |
| DELETE neotkazane | 409 |
| DELETE otkazane | 204 |

Ako lista radi u Swaggeru, backend je dovoljan za većinu od 71 boda. Frontend je preostalih 29.

---

## 10. Frontend — korak po korak

Rute, sidebar i deklaracije **već postoje**. Ne dodaješ komponentu, ne diraj `AdminModule` osim ako build traži nešto novo (neće).

**Uzorak servisa:** `product-categories-api.service.ts`  
**Uzorak modela:** `product-categories-api.model.ts`  
**Uzorak lookup:** `exam-products-api.service.ts`  
**Pravila:** `src/app/api-services/readme.md`

---

### Korak 12 — API modeli

**Fajl (postoji, dopuni):**  
`rs1-frontend-2025-26/src/app/api-services/product-reservations/product-reservations-api.models.ts`

Enum i labele **ostavi**. Dodaj request/response/command tipove. Imena moraju pratiti backend **camelCase**.

```ts
import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

export enum ReservationStateType {
  Aktivna = 1,
  Istekla = 2,
  Otkazana = 3,
}

export const RESERVATION_STATE_LABELS: Record<ReservationStateType, string> = {
  [ReservationStateType.Aktivna]: 'Aktivna',
  [ReservationStateType.Istekla]: 'Istekla',
  [ReservationStateType.Otkazana]: 'Otkazana',
};

export class ListProductReservationsRequest extends BasePagedQuery {
  productId?: number | null;
  onlyActive?: boolean | null;
}

export interface ListProductReservationsQueryDto {
  id: number;
  code: string;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  reservationValue: number;
  reservedUntilUtc: string;
  isCancelled: boolean;
  state: ReservationStateType;
}

export type ListProductReservationsResponse = PageResult<ListProductReservationsQueryDto>;

export interface GetProductReservationByIdQueryDto {
  id: number;
  code: string;
  productId: number;
  quantity: number;
  reservedUntilUtc: string;
  isCancelled: boolean;
  state: ReservationStateType;
  reservationValue: number;
}

export interface CreateProductReservationCommand {
  code: string;
  productId: number;
  quantity: number;
  reservedUntilUtc: string;
}

export interface UpdateProductReservationCommand {
  code: string;
  productId: number;
  quantity: number;
  reservedUntilUtc: string;
  isCancelled: boolean;
}
```

### Provjera

Nema `subscribe` ovdje. Samo tipovi. `ListProductReservationsRequest` nasljeđuje `paging`.

---

### Korak 13 — API servis (novi fajl)

**Gdje:** isti folder  
**Fajl:** `product-reservations-api.service.ts`  
**Klasa:** `ProductReservationsApiService`

Starter ovaj fajl **nema**. Moraš ga kreirati.

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import {
  CreateProductReservationCommand,
  GetProductReservationByIdQueryDto,
  ListProductReservationsRequest,
  ListProductReservationsResponse,
  UpdateProductReservationCommand,
} from './product-reservations-api.models';

@Injectable({ providedIn: 'root' })
export class ProductReservationsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ProductReservations`;

  list(request: ListProductReservationsRequest): Observable<ListProductReservationsResponse> {
    return this.http.get<ListProductReservationsResponse>(this.baseUrl, {
      params: buildHttpParams(request as any),
    });
  }

  getById(id: number): Observable<GetProductReservationByIdQueryDto> {
    return this.http.get<GetProductReservationByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateProductReservationCommand): Observable<{ id: number } | number> {
    return this.http.post<{ id: number } | number>(this.baseUrl, payload);
  }

  update(id: number, payload: UpdateProductReservationCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```

**Ne stavljaj** toast, `map`, `filter` ni `subscribe` u servis. Readme to zabranjuje.

`buildHttpParams` pretvara `{ paging: { page: 1, pageSize: 5 } }` u `paging.page=1&paging.pageSize=5`. To PDF eksplicitno traži.

### Provjera

`providedIn: 'root'` — ne moraš ga dodavati u `AdminModule.providers`.

---

### Korak 14 — Lista: HTML filteri, paginator, Obriši

**Fajl:** `product-reservations.component.html`

Layout ostaje. Dodaš bindinge koje TODO traži.

1. `mat-select` → `[(ngModel)]="productId"` + `(selectionChange)="filtersChanged()"`
2. `mat-checkbox` → `[(ngModel)]="onlyActive"` + `(change)="filtersChanged()"`
3. paginator → `length`, `pageIndex` je `page - 1`, `pageSize`, `(page)`
4. Obriši → `[disabled]="!row.isCancelled"` (isto mjesto kao augustov `[disabled]="row.isEnabled"`)

`FormsModule` je već exportovan iz `SharedModule`, pa `ngModel` radi.

Zamijeni blok filtera, akcije i paginator ovako (ostatak tabele ne diraj):

```html
<div class="filters">
  <mat-form-field appearance="outline">
    <mat-label>Proizvod</mat-label>
    <mat-select [(ngModel)]="productId" (selectionChange)="filtersChanged()">
      <mat-option [value]="null">Svi proizvodi</mat-option>
      @for (product of products; track product.id) {
        <mat-option [value]="product.id">{{ product.name }}</mat-option>
      }
    </mat-select>
  </mat-form-field>
  <mat-checkbox [(ngModel)]="onlyActive" (change)="filtersChanged()">
    Samo aktivne
  </mat-checkbox>
</div>
```

Akcije:

```html
<button mat-icon-button title="Uredi" (click)="edit(row.id)">
  <mat-icon>edit</mat-icon>
</button>
<button
  mat-icon-button
  title="Obriši"
  [disabled]="!row.isCancelled"
  (click)="delete(row)">
  <mat-icon>delete</mat-icon>
</button>
```

Paginator:

```html
<mat-paginator
  [length]="totalItems"
  [pageIndex]="page - 1"
  [pageSize]="pageSize"
  [pageSizeOptions]="[5, 10]"
  (page)="onPage($event)">
</mat-paginator>
```

**Zašto `[value]="null"` a ne `undefined`:** da „Svi proizvodi“ stvarno pošalje prazan filter. `buildHttpParams` preskače `null`.

### Provjera

Dugme Obriši na DEMO otkazanom redu izgleda aktivno, na aktivnom sivo — još uvijek demo, sljedeći korak spaja API.

---

### Korak 15 — Lista: TypeScript

**Fajl:** `product-reservations.component.ts`

`page` u komponenti je **1-based**, isto kao backend. Paginatorov `pageIndex` je 0-based, zato u HTML-u ide `page - 1`, a u `onPage` nazad `event.pageIndex + 1`.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ExamProductsApiService } from '../../../../api-services/exam-products/exam-products-api.service';
import { ExamProductLookupItem } from '../../../../api-services/exam-products/exam-products-api.models';
import { ProductReservationsApiService } from '../../../../api-services/product-reservations/product-reservations-api.service';
import {
  ListProductReservationsQueryDto,
  ListProductReservationsRequest,
  RESERVATION_STATE_LABELS,
  ReservationStateType,
} from '../../../../api-services/product-reservations/product-reservations-api.models';
import { ToasterService } from '../../../../core/services/toaster.service';
import { getErrorMessage } from '../../../../core/interceptors/error-logging-interceptor.service';
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { DialogButton, DialogType } from '../../../shared/models/dialog-config.model';

@Component({
  selector: 'app-product-reservations',
  standalone: false,
  templateUrl: './product-reservations.component.html',
  styleUrl: './product-reservations.component.scss',
})
export class ProductReservationsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly api = inject(ProductReservationsApiService);
  private readonly productsApi = inject(ExamProductsApiService);
  private readonly toaster = inject(ToasterService);
  private readonly dialog = inject(DialogHelperService);

  readonly displayedColumns = [
    'code', 'product', 'price', 'quantity', 'value', 'reservedUntil', 'state', 'actions',
  ];
  readonly stateLabels = RESERVATION_STATE_LABELS;
  readonly stateType = ReservationStateType;

  products: ExamProductLookupItem[] = [];
  rows: ListProductReservationsQueryDto[] = [];

  productId: number | null = null;
  onlyActive = false;
  page = 1;
  pageSize = 5;
  totalItems = 0;
  isLoading = false;

  ngOnInit(): void {
    this.loadProducts();
    this.load();
  }

  stateLabel(state: ReservationStateType): string {
    return this.stateLabels[state];
  }

  add(): void {
    this.router.navigate(['/admin/product-reservations/add']);
  }

  edit(id: number): void {
    this.router.navigate(['/admin/product-reservations/edit', id]);
  }

  filtersChanged(): void {
    this.page = 1;
    this.load();
  }

  onPage(event: PageEvent): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }

  delete(row: ListProductReservationsQueryDto): void {
    if (!row.isCancelled) {
      return;
    }

    this.dialog.open({
      type: DialogType.WARNING,
      title: 'Potvrda brisanja',
      message: `Da li želite obrisati rezervaciju ${row.code}?`,
      icon: 'delete_forever',
      buttons: [
        { type: DialogButton.CANCEL },
        { type: DialogButton.DELETE, color: 'warn' },
      ],
    }).subscribe(result => {
      if (!result || result.button !== DialogButton.DELETE) {
        return;
      }

      this.api.delete(row.id).subscribe({
        next: () => {
          this.toaster.success('Rezervacija je obrisana.');
          this.page = 1;
          this.load();
        },
        error: (err) => this.toaster.error(getErrorMessage(err)),
      });
    });
  }

  private loadProducts(): void {
    this.productsApi.lookup().subscribe({
      next: (items) => (this.products = items),
      error: (err) => this.toaster.error(getErrorMessage(err)),
    });
  }

  private load(): void {
    const request = new ListProductReservationsRequest();
    request.paging.page = this.page;
    request.paging.pageSize = this.pageSize;
    request.productId = this.productId;
    request.onlyActive = this.onlyActive ? true : null;

    this.isLoading = true;
    this.api.list(request).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.totalItems = res.totalItems;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toaster.error(getErrorMessage(err));
      },
    });
  }
}
```

**Zašto `getErrorMessage(err)`:** PDF: *„Backend poruku greške prikazati onako kako je backend vraća, ne generičkim tekstom.“* Helper čita `error.error.message`. Interceptor **samo loguje** — toast ide iz komponente.

**Zašto `page = 1` u `filtersChanged` i poslije brisanja:** PDF: promjena filtera vraća na **prvu stranicu**. Poslije brisanja lista se osvježi uz iste filtere, sa prve stranice — isti tok kao na augustu.

**Zašto `onlyActive ? true : null`:** da isključeni checkbox ne šalje `onlyActive=false`. Handler filtrira samo kad je `== true`. `buildHttpParams` preskače `null`.

**Zašto `dialog.open` umjesto `confirmDelete`:** `confirmDelete` koristi i18n ključeve. `open` s `message` daje tačan tekst sa oznakom. Odustajanje (`CANCEL`) ne zove API.

**Odustajanje:** ako korisnik klikne Cancel, `result.button` nije `DELETE` — ništa se ne zove. PDF to boduje.

### Provjera

1. Uloguj se, otvori Modul 1.
2. Vidiš seed redove, ne DEMO-0001.
3. Cijene na 2 decimale, datum `dd.MM.yyyy` (pipe već postoji u HTML-u).
4. Paginator: 5 pa 10.
5. Samo aktivne → 4 reda (`REZ-0001`, `REZ-0004`, `REZ-0006`, `REZ-0008`).
6. Filter Tastatura + samo aktivne → 1 red.
7. Obriši sivo na aktivnim/isteklim.
8. Obriši na otkazanoj → modal → Odustani ništa ne mijenja; Potvrdi skida red i toast.

---

### Korak 16 — Zajednički validatori forme

Add i edit dijele ista lokalna pravila (osim datuma). Možeš ih staviti u isti TS fajl komponenata, ili napraviti male funkcije iznad klase.

Pravila iz PDF-a:

- Oznaka nakon Trim: 5–20 i počinje sa `REZ-` (case-sensitive)
- Proizvod obavezan
- Količina cijeli broj 1–1000
- Datum obavezan; **samo pri create** danas ili budućnost

Isti oblik kao na augustu: `ValidatorFn` na **dnu** TS fajla, a poruke u metodi `errorText` unutar klase. Ne pravi poseban fajl.

```ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function reservationCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString();
    if (!value.trim()) return { required: true };
    const trimmed = value.trim();
    if (trimmed.length < 5 || trimmed.length > 20) return { codeLength: true };
    if (!trimmed.startsWith('REZ-')) return { codePrefix: true };
    return null;
  };
}

function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return Number.isInteger(Number(value)) ? null : { integer: true };
  };
}

function notPastUtcDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString();
    if (!value) return null;
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      .toISOString()
      .slice(0, 10);
    return value < today ? { pastDate: true } : null;
  };
}

function toUtcDateOnly(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}
```

`input type="date"` daje `yyyy-MM-dd`. `toUtcDateOnly` šalje ponoć UTC, da se dan ne pomjeri — ista uloga kao augustov helper za datepicker.

---

### Korak 17 — Add HTML: poruke i disabled Sačuvaj

**Fajl:** `product-reservation-add.component.html`

PDF: poruke uz polje; Sačuvaj onemogućen dok forma nije ispravna.

Na svaki `mat-form-field` dodaj `mat-error`. Na submit dugme `[disabled]`.

Primjer za oznaku:

```html
<mat-form-field appearance="outline">
  <mat-label>Oznaka</mat-label>
  <input matInput formControlName="code" placeholder="REZ-0001">
  <mat-hint>5-20 znakova, prefiks REZ-</mat-hint>
  <mat-error>{{ errorText('code') }}</mat-error>
</mat-form-field>
```

Isto za `productId`, `quantity`, `reservedUntilUtc`.

Dugme:

```html
<button
  mat-flat-button
  color="primary"
  type="submit"
  [disabled]="form.invalid || isSaving">
  <mat-icon>save</mat-icon>Sačuvaj
</button>
```

Hint ispod forme već postoji: *„Zbir aktivnih rezervacija ne smije preći zalihu proizvoda.“* To je samo info — zalihu **ne** provjeravaš na FE posebnim API-jem.

---

### Korak 18 — Add TypeScript

**Fajl:** `product-reservation-add.component.ts`

```ts
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamProductsApiService } from '../../../../../api-services/exam-products/exam-products-api.service';
import { ExamProductLookupItem } from '../../../../../api-services/exam-products/exam-products-api.models';
import { ProductReservationsApiService } from '../../../../../api-services/product-reservations/product-reservations-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { getErrorMessage } from '../../../../../core/interceptors/error-logging-interceptor.service';

@Component({
  selector: 'app-product-reservation-add',
  standalone: false,
  templateUrl: './product-reservation-add.component.html',
  styleUrl: './product-reservation-add.component.scss',
})
export class ProductReservationAddComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly api = inject(ProductReservationsApiService);
  private readonly productsApi = inject(ExamProductsApiService);
  private readonly toaster = inject(ToasterService);

  products: ExamProductLookupItem[] = [];
  isSaving = false;

  readonly form = this.fb.group({
    code: ['', [reservationCodeValidator()]],
    productId: [null as number | null, [Validators.required, Validators.min(1)]],
    quantity: [null as number | null, [
      Validators.required,
      Validators.min(1),
      Validators.max(1000),
      integerValidator(),
    ]],
    reservedUntilUtc: ['', [Validators.required, notPastUtcDateValidator()]],
  });

  ngOnInit(): void {
    this.productsApi.lookup().subscribe({
      next: (items) => (this.products = items),
      error: (err) => this.toaster.error(getErrorMessage(err)),
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/product-reservations']);
  }

  save(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.isSaving = true;

    this.api.create({
      code: (raw.code ?? '').trim(),
      productId: raw.productId!,
      quantity: Number(raw.quantity),
      reservedUntilUtc: toUtcDateOnly(raw.reservedUntilUtc!),
    }).subscribe({
      next: () => {
        this.toaster.success('Rezervacija je snimljena.');
        this.router.navigate(['/admin/product-reservations']);
      },
      error: (err) => {
        this.isSaving = false;
        this.toaster.error(getErrorMessage(err));
      },
    });
  }

  errorText(name: string): string {
    const c = this.form.get(name);
    if (!c || !c.errors || !(c.touched || c.dirty)) {
      return '';
    }
    if (name === 'quantity' && (c.errors['min'] || c.errors['max'] || c.errors['integer'])) {
      return 'Količina mora biti cijeli broj od 1 do 1000.';
    }
    if (c.errors['required'] || c.errors['min']) return 'Polje je obavezno.';
    if (c.errors['codeLength']) return 'Oznaka mora imati 5 do 20 znakova.';
    if (c.errors['codePrefix']) return 'Oznaka mora počinjati sa REZ-.';
    if (c.errors['pastDate']) return 'Datum mora biti današnji ili budući.';
    return 'Neispravna vrijednost.';
  }
}

function toUtcDateOnly(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

function reservationCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString();
    if (!value.trim()) return { required: true };
    const trimmed = value.trim();
    if (trimmed.length < 5 || trimmed.length > 20) return { codeLength: true };
    if (!trimmed.startsWith('REZ-')) return { codePrefix: true };
    return null;
  };
}

function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return Number.isInteger(Number(value)) ? null : { integer: true };
  };
}

function notPastUtcDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString();
    if (!value) return null;
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
      .toISOString()
      .slice(0, 10);
    return value < today ? { pastDate: true } : null;
  };
}
```

**Tok iz PDF-a:**

- uspjeh → toast + **povratak na listu**
- greška → toast s backend porukom + **ostani na formi** (unosi ostaju jer ne resetuješ formu)
- `isSaving` ostaje `true` samo dok traje zahtjev; u `error` se vraća na `false`

### Provjera

- Prazna forma: Sačuvaj sivo.
- `abc` u oznaci: poruka uz polje.
- `rez-0001`: poruka prefix.
- Jučerašnji datum: poruka.
- Validno na Adapter (zaliha slobodna): lista se osvježi, vidiš novi red.
- Tastatura količina 6: ostaneš na formi, toast 409, polja i dalje popunjena.

---

### Korak 19 — Edit HTML

Isti `mat-error` i `[disabled]="form.invalid || isSaving"` kao na add.

Checkbox `Otkazana` već ima `formControlName="isCancelled"`. Ne diraj tekst ispod njega — PDF ga već objašnjava.

Datum na edit **nema** `notPastUtcDateValidator` — samo `Validators.required`.

---

### Korak 20 — Edit TypeScript

**Fajl:** `product-reservation-edit.component.ts`

Id je već u starteru: `Number(this.route.snapshot.paramMap.get('id'))`.

Datum iz API-ja je ISO (`2026-09-20T00:00:00Z`). `input type="date"` hoće `yyyy-MM-dd`:

```ts
reservedUntilUtc: dto.reservedUntilUtc.slice(0, 10)
```

```ts
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamProductsApiService } from '../../../../../api-services/exam-products/exam-products-api.service';
import { ExamProductLookupItem } from '../../../../../api-services/exam-products/exam-products-api.models';
import { ProductReservationsApiService } from '../../../../../api-services/product-reservations/product-reservations-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { getErrorMessage } from '../../../../../core/interceptors/error-logging-interceptor.service';

@Component({
  selector: 'app-product-reservation-edit',
  standalone: false,
  templateUrl: './product-reservation-edit.component.html',
  styleUrl: '../product-reservation-add/product-reservation-add.component.scss',
})
export class ProductReservationEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ProductReservationsApiService);
  private readonly productsApi = inject(ExamProductsApiService);
  private readonly toaster = inject(ToasterService);

  protected readonly id = Number(this.route.snapshot.paramMap.get('id'));

  products: ExamProductLookupItem[] = [];
  isSaving = false;
  isLoading = false;

  readonly form = this.fb.group({
    code: ['', [reservationCodeValidator()]],
    productId: [null as number | null, [Validators.required, Validators.min(1)]],
    quantity: [null as number | null, [
      Validators.required,
      Validators.min(1),
      Validators.max(1000),
      integerValidator(),
    ]],
    reservedUntilUtc: ['', [Validators.required]],
    isCancelled: [false],
  });

  ngOnInit(): void {
    this.productsApi.lookup().subscribe({
      next: (items) => (this.products = items),
      error: (err) => this.toaster.error(getErrorMessage(err)),
    });

    this.isLoading = true;
    this.api.getById(this.id).subscribe({
      next: (dto) => {
        this.form.patchValue({
          code: dto.code,
          productId: dto.productId,
          quantity: dto.quantity,
          reservedUntilUtc: dto.reservedUntilUtc.slice(0, 10),
          isCancelled: dto.isCancelled,
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toaster.error(getErrorMessage(err));
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/product-reservations']);
  }

  save(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.isSaving = true;

    this.api.update(this.id, {
      code: (raw.code ?? '').trim(),
      productId: raw.productId!,
      quantity: Number(raw.quantity),
      reservedUntilUtc: toUtcDateOnly(raw.reservedUntilUtc!),
      isCancelled: !!raw.isCancelled,
    }).subscribe({
      next: () => {
        this.toaster.success('Rezervacija je izmijenjena.');
        this.router.navigate(['/admin/product-reservations']);
      },
      error: (err) => {
        this.isSaving = false;
        this.toaster.error(getErrorMessage(err));
      },
    });
  }

  errorText(name: string): string {
    const c = this.form.get(name);
    if (!c || !c.errors || !(c.touched || c.dirty)) {
      return '';
    }
    if (name === 'quantity' && (c.errors['min'] || c.errors['max'] || c.errors['integer'])) {
      return 'Količina mora biti cijeli broj od 1 do 1000.';
    }
    if (c.errors['required'] || c.errors['min']) return 'Polje je obavezno.';
    if (c.errors['codeLength']) return 'Oznaka mora imati 5 do 20 znakova.';
    if (c.errors['codePrefix']) return 'Oznaka mora počinjati sa REZ-.';
    return 'Neispravna vrijednost.';
  }
}

function toUtcDateOnly(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

function reservationCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '').toString();
    if (!value.trim()) return { required: true };
    const trimmed = value.trim();
    if (trimmed.length < 5 || trimmed.length > 20) return { codeLength: true };
    if (!trimmed.startsWith('REZ-')) return { codePrefix: true };
    return null;
  };
}

function integerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return Number.isInteger(Number(value)) ? null : { integer: true };
  };
}
```

### Provjera

- Otvori `REZ-0001` — forma popunjena, datum vidljiv.
- Promijeni količinu na 5 (granica Tastature) → uspjeh, lista.
- Promijeni na 6 → 409, ostaneš na formi.
- Štikliraj Otkazana i sačuvaj → na listi status Otkazana, Obriši postane aktivno.
- Prošli datum na edit **smije** proći (nema create pravila).

---

## 11. Vizuelni tok rješenja

```
[Lista] --Nova rezervacija--> [Add forma]
    ^                            |
    |  uspjeh: toast + navigate  | POST /ProductReservations
    |<---------------------------| greška: toast, ostani

[Lista] --Uredi--> [Edit forma] GET /ProductReservations/{id}
    ^                     |
    |                     | PUT /ProductReservations/{id}
    |<--------------------|

[Lista] --Obriši (samo Otkazana)--> [Modal]
                                      | Odustani → ništa
                                      | Potvrdi → DELETE → toast → load()
```

Filteri i paging:

```
promjena filtera → page=1 → GET sa productId/onlyActive/paging
promjena paginatora → onPage → paging.page = pageIndex + 1
```

Backend create/update:

```
FluentValidation (400)
  → proizvod postoji? (400)
  → oznaka unique? (409)
  → ako nije otkazana: zbir aktivnih + qty <= zaliha? (409)
  → SaveChanges
```

---

## 12. Kako testirati

Seed (komentari u `DynamicDataSeeder`) je namjerno pisan kao ispitni ključ.

### Proizvodi i prostor za novu rezervaciju

| Proizvod | Zaliha | Aktivno | Slobodno | Namjena |
|----------|--------|---------|----------|---------|
| Tastatura | 10 | 5 | 5 | 5 prolazi, 6 pada |
| Mis | 50 | 3 | 47 | slobodno testiranje |
| Monitor | 50 | 1 | 49 | slobodno |
| Adapter | 50 | 0 | 50 | najlakši create |
| USB memorija | 15 | 5 | 10 | **ne sabirati** isteklu 10 |
| Web kamera | 6 | 0 | 6 | **ne sabirati** otkazanu 2 |
| USB kabl | 20 | 0 | 20 | **ne sabirati** isteklu 50 |
| Slusalice | 0 | 0 | 0 | svaka količina 409 |

### Filter „Samo aktivne“

Od 12 ostaju **4**: `REZ-0001`, `REZ-0004` (danas = aktivna), `REZ-0006`, `REZ-0008`.

### Brisanje

Otkazane u seedu: `REZ-0003`, `REZ-0007`, `REZ-0011`. Samo njih smiješ obrisati.

### Redoslijed testa na ispitu (brzo)

1. Swagger GET lista + onlyActive
2. Swagger POST Adapter `REZ-0100` qty 1, datum danas
3. Swagger POST Tastatura qty 6 → 409
4. UI lista, filteri, paging
5. UI add, UI edit otkaži, UI delete + odustani pa potvrdi
6. Namjerna greška na formi — vidiš toast i ostaješ

---

## 13. Najčešće greške i debug

| Simptom | Uzrok | Šta uraditi |
|---------|-------|-------------|
| DEMO redovi i dalje | `load()` prazan | spoji `api.list` |
| Paginator ne mijenja podatke | nije `(page)="onPage($event)"` ili šalješ `pageIndex` umjesto `pageIndex + 1` | `page` u komponenti kreće od 1 |
| `totalItems` uvijek 12 uz filter | filtriraš na FE ili nakon Take | filter **prije** Count |
| `onlyActive` ostavi 5 umjesto 4 | uračunao si `REZ-0004` kao isteklu ili sabrao otkazane | danas = aktivna; otkazane van |
| 409 na USB memoriji qty 10 | sabrao isteklu | u zbir samo `!IsCancelled && Date >= today` |
| Unique ne radi za `rez-0001` | nisi `ToLower()` | uniqueness je **case-insensitive**; prefix `REZ-` je **case-sensitive** |
| Prefix `rez-` prođe | `StartsWith` s IgnoreCase | mora pasti na 400 |
| Datum create prošlost prođe | nisi stavio pravilo u **Create** validator | Update **ne** smije imati to pravilo |
| Delete istekle prođe | provjeravaš datum umjesto `IsCancelled` | smije samo otkazana |
| Zapis nestane iz baze | `ExecuteDelete` / SQL DELETE | koristi `Remove` (soft delete) |
| Toast „Conflict. The operation…“ | nisi `getErrorMessage` | čitaj `error.error.message` |
| 401 na API | nisi ulogovan / nije Staff | admin@market.local |
| Forma se prazni poslije 409 | radiš `form.reset()` u error | nemoj |
| Edit datum prazan | nisi `slice(0, 10)` | date input ne razumije ISO sa `T` |
| `CreatedAtUtc` se promijeni | ručno ga setuješ u update | ne diraj ga |
| Nova migracija | nisi smio | Modul 1 **ne** dira bazu |

Ako `x.ReservedUntilUtc.Date` u LINQ baci runtime grešku (SQL translate):

```csharp
x.ReservedUntilUtc >= todayUtc
```

Seed i create handler koriste ponoć, pa je to ekvivalentno.

---

## 14. Završna checklista prije predaje

### Backend

- [ ] Nema nove migracije, entitet nije mijenjan
- [ ] Kontroler: GET lista, GET id, POST, PUT, DELETE
- [ ] Query imena: `productId`, `onlyActive`, `paging.page`, `paging.pageSize`
- [ ] Sort: `CreatedAtUtc` desc, `Id` desc
- [ ] Filteri AND, prije Count
- [ ] `GetState` i `GetReservationValue` pozvani u list i get
- [ ] Code Trim, 5–20, `REZ-` case-sensitive
- [ ] Unique Trim + ToLower, exclude Id, bez obrisanih
- [ ] Create: `IsCancelled = false`, datum danas/budućnost
- [ ] Update: datum bez „budućnost“ pravila, `CreatedAtUtc` netaknut
- [ ] Zbir samo aktivnih; exclude Id; skip ako `IsCancelled`
- [ ] Delete samo `IsCancelled`; inače 409
- [ ] Soft delete
- [ ] 400 / 404 / 409 postojećim exception klasama

### Frontend

- [ ] Nema demo redova
- [ ] Lookup proizvoda na list/add/edit
- [ ] Paginator 5 i 10, `totalItems` s backenda
- [ ] Filter vraća na stranu 1
- [ ] Reactive Forms
- [ ] Poruke uz polja, Sačuvaj disabled
- [ ] Toast uspjeh + backend greška
- [ ] Redirect na uspjeh, ostanak na grešci
- [ ] Modal delete, Odustani ne briše
- [ ] Obriši disabled ako nije Otkazana
- [ ] `node_modules` nije u ZIP-u

---

## 15. Kako razmišljati na ispitu

1. **Swagger prvo.** Ako lista/filter/409 ne rade u Swaggeru, frontend neće spasiti bodove (71 je na BE).
2. **Ne crtaj UI.** HTML je dat. Samo binding, validatori, HTTP.
3. **Ne diraj proizvode.** Zaliha se čita, ne piše.
4. **Jedna `todayUtc` po requestu.**
5. Ako zapneš: otvori `ProductCategories` i uradi **isti folder pattern** s drugim imenom.
6. Ako ostane 15 minuta: lista + paging + create u Swaggeru + FE lista. To je već veliki dio bodova.

---

## 16. Rječnik pojmova

| Pojam | Značenje ovdje |
|-------|----------------|
| **CQRS** | Odvojene klase za čitanje (Query) i pisanje (Command) |
| **Handler** | Klasa koja izvršava jednu Query/Command |
| **DTO** | Objekat koji ide kroz HTTP, nije entitet |
| **Izvedeni status** | Nije kolona; `GetState()` |
| **ReservationValue** | `Round(Price * Quantity, 2)`, nije kolona |
| **Soft delete** | Red ostaje, `IsDeleted=1`, filter ga krije |
| **409 Conflict** | Unique oznaka, prekoračena zaliha, delete neotkazane |
| **Staff policy** | Admin/manager/employee smiju; `[Authorize(Policy = "Staff")]` |
| **page** | U komponenti 1, 2, 3… Paginatorov `pageIndex` je 0, 1, 2… |
| **onlyActive** | Checkbox; `true` = samo status Aktivna |
| **Trim** | Skini razmake prije dužine, prefixa i unique usporedbe |

---

**Predračuni su drugi modul.** Ne miješaj ih s ovim fajlom. Vidi `RS1_Modul2_Vodic.md`.
