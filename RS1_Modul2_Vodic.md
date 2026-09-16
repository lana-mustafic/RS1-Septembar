# RS1 — Modul 2 — Vodič (09.09.2026.)

> **Cilj ovog dokumenta:** Da možeš drugi modul doslovno pratiti korak po korak.  
> **Pravilo:** Prvo pročitaj šta starter već ima, zatim dopuni. Uzorak za 1:N je `Order` + `OrderItem`.  
> **Izvor:** PDF `RS1-ispit-2026-09-09-starter-projekat-II-modul.pdf` + starter projekat.  
> **Mjerodavan je tekst zadatka**, ne slike u PDF-u.  
> **Ovaj vodič je samostalan** — ne trebaš imati urađen Modul 1 da radiš predračune.

---

## Sadržaj

1. [Šta se traži](#1-šta-se-traži)
2. [Šta ovaj vodič NIJE](#2-šta-ovaj-vodič-nije)
3. [Razlika između Modula 1 i Modula 2](#3-razlika-između-modula-1-i-modula-2)
4. [Priprema okruženja na ispitu](#4-priprema-okruženja-na-ispitu)
5. [Šta starter već ima, a šta ti moraš napraviti](#5-šta-starter-već-ima-a-šta-ti-moraš-napraviti)
6. [Pregled arhitekture](#6-pregled-arhitekture)
7. [Mapa pojmova](#7-mapa-pojmova)
8. [Kako čitati ovaj zadatak](#8-kako-čitati-ovaj-zadatak)
9. [Bodovna tabela](#9-bodovna-tabela)
10. [Backend — korak po korak](#10-backend--korak-po-korak)
11. [Frontend — korak po korak](#11-frontend--korak-po-korak)
12. [Vizuelni tok rješenja](#12-vizuelni-tok-rješenja)
13. [Kako testirati](#13-kako-testirati)
14. [Najčešće greške i debug](#14-najčešće-greške-i-debug)
15. [Završna checklista prije predaje](#15-završna-checklist-prije-predaje)
16. [Kako razmišljati na ispitu](#16-kako-razmišljati-na-ispitu)
17. [Rječnik pojmova](#17-rječnik-pojmova)

---

## 1. Šta se traži

Na ispitu iz **Razvoja softvera I** od **09.09.2026.**, **Modul 2** su **Predračuni**.

U sidebaru: **„Modul 2 — Predračuni“** → `/admin/proformas`.

Predračun je dokument kojim se kupcu **unaprijed iskazuje cijena**. Jedan predračun ima:

- **Zaglavlje (master):** broj, kupac, napomena
- **Stavke (detail):** više redova proizvoda

To je **master-detail**, nije klasičan CRUD.

### Šta korisnik radi

1. Vidi **listu** predračuna (paginacija). Na početku je lista **prazna** — to je OK, seed nema predračuna.
2. Klikne **Novi predračun**.
3. Unese zaglavlje + jednu ili više stavki.
4. Sačuva. Sistem snimi **roditelja i djecu zajedno**, izračuna iznose na backendu, vrati se na listu.

**Nema** uređivanja predračuna. **Nema** brisanja predračuna. **Nema** modala. Uklanjanje reda iz forme nije brisanje iz baze.

### Master-detail jednom rečenicom

Jedan `ProformaEntity` ima više `ProformaItemEntity`. U Angularu to je `FormGroup` + `FormArray`. U bazi relacija **1:N**. Jedan `POST /Proformas` šalje cijeli dokument.

### Obavezna pravila (crveni okvir)

- Backend: **CQRS**
- Frontend: **Reactive Forms** (ovdje i `FormArray`)
- **Toast** za uspjeh i grešku
- **Paginacija** na listi
- II modul **nema** delete ni potvrdni modal
- Ne troši vrijeme na dizajn
- **Ne mijenjaj** `Product.Price` ni `Product.StockQuantity`
- Predračun **ne mijenja zalihu**
- Ne koristi narudžbe, plaćanja ni popuste

### Obavezne rute (imena se ne smiju mijenjati)

```
GET  /Proformas?paging.page=1&paging.pageSize=5
POST /Proformas
{
  "number": "PR-0001",
  "customerName": "Kupac d.o.o.",
  "note": "opcionalno",
  "items": [ { "productId": 1, "quantity": 3 } ]
}
```

Uspjeh vraća **novi Id**.

Klijent **ne šalje** `unitPrice`, `lineAmount`, `totalAmount`, `itemsCount`. To backend sam računa iz baze.

---

## 2. Šta ovaj vodič NIJE

### Ovo NIJE Modul 1

Modul 1 su **Rezervacije proizvoda** (`RS1_Modul1_Vodic.md`). Ne dodaješ edit/delete kolone na predračune „jer su bile u Modulu 1“.

### Ovo NIJE januarski Modul 2 (Fakture)

Januar je imao ulaznu/izlaznu fakturu i **promjenu zaliha**. Ovaj ispit to **izričito zabranjuje**.

### Šta NE smiješ izmišljati

- Update/Delete predračuna
- GetById predračuna (nije u PDF-u)
- filter na listi predračuna
- unique indeks u bazi
- frontend uniqueness endpoint
- spajanje duplih proizvoda u jednu stavku
- slanje cijene s frontenda kao autoritativne
- cache kataloga
- vlastiti transakcijski framework — dovoljan je jedan `SaveChangesAsync`

---

## 3. Razlika između Modula 1 i Modula 2

| | Modul 1 (Rezervacije) | Modul 2 (Predračuni) |
|---|----------------------|----------------------|
| Operacije | Create, Read, Update, Delete | **Samo lista + Create** |
| Forma | Jedan `FormGroup` | `FormGroup` + **`FormArray`** |
| Novi entitet | Ne | **Da** — `ProformaItemEntity` + migracija |
| Veza | FK na Product | 1:N stavke + FK na Product |
| Paginacija | Ti pišeš i BE i FE | BE lista **već radi**; FE paginator spojiš |
| Modal | Da | **Ne** |
| Zaliha | Provjerava zbir rezervacija | **Ne dira zalihu** |
| Trajanje | 100+20 min | 90+10 min |

Ako znaš CQRS iz Modula 1, ovdje je novi dio: **child entitet, migracija, FormArray, snimak cijene**.

Ako radiš samo Modul 2: lista GET već postoji. Ti praviš child model + POST + FE.

---

## 4. Priprema okruženja na ispitu

Isto okruženje kao i za cijeli ispit. Ako si već pokrenula projekat za Modul 1, **ne radi ovo ispočetka**.

### 4.1. Alati

| Alat | Za šta |
|------|--------|
| Visual Studio 2026 | Backend, migracija |
| VS Code | Frontend |
| SSMS | Provjera nove tabele stavki |
| Browser | UI + Swagger |

### 4.2. Baza

- Server: `10.10.10.18`
- User: `sa` / Password: `test`
- Baza: **broj indeksa**

### 4.3. Connection string

`rs1_backend-2025-26/Market.API/appsettings.json` → `ConnectionStrings:Main` → `Database=TVOJ_INDEKS`.

### 4.4. FTP (na pravom ispitu)

- `ftp.fit.ba` / `student_aj` / `student_aj`
- `RS1-ispit-2026-09-09-starter-projekat.zip`

### 4.5. NPM

U terminalu prvo `cmd`, zatim `npm install` i `npm start`.  
Nove komponente **ne trebaš** generisati — list i add već postoje.

### 4.6. Pokretanje

1. Backend F5 → `http://localhost:7001/swagger`
2. Frontend → `http://localhost:4200`
3. Login: `admin@market.local` / `Admin123!`

Pri startu ide `MigrateAsync` + seed proizvoda. **Predračuna u seedu nema.**

### 4.7. Trajanje i predaja

- Trajanje ovog modula na papiru: **90 min + 10 min dodatno**
- Upload: jedan ZIP backend+frontend, **bez `node_modules`**

---

## 5. Šta starter već ima, a šta ti moraš napraviti

### Već postoji

| Šta | Gdje |
|-----|------|
| `ProformaEntity` **bez kolekcije stavki** | `Market.Domain/Entities/Sales/ProformaEntity.cs` |
| Constraints (Number 20, Customer 200, Note 500, qty 1–1000) | ista klasa |
| EF config roditelja | `ProformaConfiguration.cs` |
| `DbSet<ProformaEntity> Proformas` | Context + `IAppDbContext` |
| TODO: `DbSet` za stavke | ista dva fajla |
| List query/DTO/handler | `Modules/Sales/Proformas/Queries/List/` |
| `GET /Proformas` | `ProformasController` — **nema POST** |
| FE list API `list()` + DTO | `proformas-api.service.ts` / `proformas-api.models.ts` |
| Create modeli na FE već skicirani | `CreateProformaRequest` + `CreateProformaItemRequest` |
| TODO za `create()` | u servisu |
| Kostur liste s DEMO redovima | `proformas.component.ts/html` |
| Kostur add + `FormArray` add/remove | `proforma-add` |
| Lookup proizvoda | `GET /ExamProducts/lookup` |

### Ti moraš napraviti

**Backend**

- `ProformaItemEntity`
- kolekcija `Items` na `ProformaEntity`
- EF konfiguracija stavke
- `DbSet` u `DatabaseContext` i `IAppDbContext`
- **nova migracija**
- `CreateProformaCommand` + Handler + Validator
- `POST` u `ProformasController`

**Frontend**

- `create()` u API servisu (modeli za create već postoje)
- lista: zamijeni DEMO, spoji paginator
- add: lookup, validatori, iznosi, reset količine, submit, toast, redirect

### Šta je namjerno pokvareno

1. `ProformaEntity` ima komentar TODO umjesto kolekcije.
2. Nema tabele stavki.
3. Lista zove prazan `load()`, prikazuje DEMO-0001.
4. Paginator nije povezan.
5. `products = []`, lookup se ne zove.
6. Nema validatora; `onSubmit` / `save` prazan.
7. `productFor`, `lineAmountFor`, `totalAmount` vraćaju `undefined`/`null`.
8. Nema POST metode u servisu.

---

## 6. Pregled arhitekture

```
rs1_backend-2025-26/     ← VS
rs1-frontend-2025-26/    ← VS Code
```

| Projekt | Šta diraš u Modulu 2 |
|---------|----------------------|
| Market.Domain | Novi `ProformaItemEntity` + kolekcija na `ProformaEntity` |
| Market.Application | Create CQRS; List **ne diraš** (već radi) |
| Market.Infrastructure | Config stavke, DbSet, migracija |
| Market.API | POST u postojeći `ProformasController` |

MediatR/FluentValidation se registruju sami. Handler ne moraš javljati u `Program.cs`.

---

## 7. Mapa pojmova

| Pojam | Lokacija |
|-------|----------|
| Roditelj | `ProformaEntity` |
| Dijete | `ProformaItemEntity` (ti kreiraš) |
| 1:N u EF | `HasOne().WithMany(x => x.Items).HasForeignKey()` |
| List GET | već `ListProformasQueryHandler` |
| Create POST | `Commands/Create/` |
| Lookup cijena (samo prikaz) | `ExamProductsApiService.lookup()` |
| Autoritativna cijena | `Product.Price` u Create handleru |
| FormArray | `form.controls.items` |
| Paging | `PageResult` + `buildHttpParams` |
| 400 | FluentValidation (format, qty, prazna lista, nepostojeći proizvod) |
| 409 | dupli broj, dupli proizvod, napomena kad ima > 5 stavki |

---

## 8. Kako čitati ovaj zadatak

### Tri prolaza

**UI:** lista kolona, Novi predračun, forma sa stavkama, paginacija, toast.

**Baza:** nova tabela stavki, FK na Proformas i Products, `ItemsCount` i `TotalAmount` na roditelju.

**Pravila:** duplikat proizvoda, napomena ako > 5 stavki, unique broj, cijena sa servera, atomičnost.

### Ključne riječi

| Fraza | Šta radiš |
|-------|-----------|
| „1:N“ | `ProformaItemEntity.ProformaId` + kolekcija `Items` |
| „Restrict na proizvod“ | `OnDelete(DeleteBehavior.Restrict)` prema Product |
| „stavka ne može bez roditelja“ | Cascade (ili obavezni FK) prema Proforma |
| „WithMany()“ | ne moraš kolekciju na `ProductEntity` |
| „snimak cijene“ | `UnitPrice = product.Price` u trenutku create; kasnije se ne preračunava |
| „klijentski izračun nije autoritativan“ | FE samo preview; BE ponovo čita bazu |
| „Trim i case-insensitive“ (broj) | unique `Number` u handleru → 409 |
| „PR- case-sensitive“ | format prefixa; `pr-0001` je 400 |
| „više od pet stavki“ | `items.Count > 5` → napomena mora imati non-whitespace nakon Trim |
| „nema spajanja“ | dva ista `productId` → 409, ne sabirati količine |
| „jedan SaveChangesAsync“ | sve provjere prije Add, zatim jedan save |
| „reset količine“ | kad se **promijeni** proizvod u tom redu; isti Id ponovo ne resetuje |
| „prazna lista nije greška“ | nemoj toast na prazan GET |

---

## 9. Bodovna tabela

Iz PDF-a. Stavke 2–5 nemaju BE bodove jer su list/paging/lookup/kostur **dati**.

| Br. | Funkcionalnost | BE | FE | Ukupno |
|-----|----------------|----|----|--------|
| 1 | Child model + migracija | 10 | — | 10 |
| 2 | Lista iz API-ja | — | 6 | 6 |
| 3 | Paginacija | — | 4 | 4 |
| 4 | Reactive forma master/child | — | 6 | 6 |
| 5 | Lookup i promjena proizvoda | — | 5 | 5 |
| 6 | Zaglavlje (broj, kupac, unique) | 4 | 2 | 6 |
| 7 | Validacija stavki | 5 | 2 | 7 |
| 8 | Duplikat proizvoda | 6 | 2 | 8 |
| 9 | Napomena kod > 5 stavki | 6 | 2 | 8 |
| 10 | Snimak i račun stavke | 7 | 3 | 10 |
| 11 | Zbir i audit | 7 | — | 7 |
| 12 | Snimanje atomično, zaliha nedirnuta | 13 | — | 13 |
| 13 | Tok i isSaving | — | 5 | 5 |
| 14 | Toast | — | 5 | 5 |
| | **Ukupno** | **58** | **42** | **100** |

Ako uradiš samo migraciju + POST u Swaggeru, to je već većina BE. Lista bez DEMO redova je jeftinih 6+4 FE boda — uradi je rano.

---

## 10. Backend — korak po korak

**Uzorak 1:N:** `OrderEntity` + `OrderItemEntity` + `OrderItemConfiguration` + `CreateOrderCommandHandler`.

**Uzorak unique/409:** isti stil kao konflikt naziva kategorije, ali ovdje `MarketConflictException`.

Folder Create:

```
Market.Application/Modules/Sales/Proformas/
├── Queries/List/          ← NE DIRATI
└── Commands/Create/       ← TI PRAVIŠ
    ├── CreateProformaCommand.cs
    ├── CreateProformaCommandHandler.cs
    └── CreateProformaCommandValidator.cs
```

---

### Korak 1 — Pročitaj dato

Otvori:

1. `ProformaEntity.cs` — TODO za kolekciju; `Constraints`
2. `ProformasController.cs` — samo GET, TODO za POST
3. `ListProformasQueryHandler.cs` — sort `CreatedAtUtc` desc, `Id` desc (već urađeno)
4. `OrderItemEntity.cs` + `OrderItemConfiguration.cs`
5. `CreateOrderCommandValidator.cs` — `RuleForEach`, `NotEmpty` items
6. `proforma-add.component.html` — hintovi: prefix `PR-`, napomena kad > 5 stavki

### Provjera

GET `/Proformas?paging.page=1&paging.pageSize=5` u Swaggeru već vraća prazan `items` i `totalItems: 0`. To je tačno.

---

### Korak 2 — Entitet stavke

**Gdje:** `Market.Domain/Entities/Sales/`

**Fajl:** `ProformaItemEntity.cs`

**Klasa:** `ProformaItemEntity` nasljeđuje `BaseEntity` (dobijaš `Id`, `IsDeleted`, `CreatedAtUtc`, `ModifiedAtUtc` — ne piši ih ponovo).

Polja iz PDF-a:

| Polje | Tip |
|-------|-----|
| `ProformaId` | FK na roditelja |
| `ProductId` | FK na proizvod |
| `Quantity` | `int` |
| `UnitPrice` | `decimal(18,2)` — cijena **pročitana na backendu** |
| `LineAmount` | `decimal(18,2)` — iznos stavke |
| navigacije | `Proforma`, `Product` (opciono, kao kod OrderItem) |

```csharp
using Market.Domain.Common;
using Market.Domain.Entities.Catalog;

namespace Market.Domain.Entities.Sales;

public class ProformaItemEntity : BaseEntity
{
    public int ProformaId { get; set; }
    public ProformaEntity? Proforma { get; set; }

    public int ProductId { get; set; }
    public ProductEntity? Product { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal LineAmount { get; set; }
}
```

**Zašto nisu u commandu `UnitPrice`/`LineAmount`:** klijent ih ne smije slati. Handler ih puni.

### Provjera

Build. Još nema tabele.

---

### Korak 3 — Kolekcija na roditelju

**Fajl:** `ProformaEntity.cs`

Zamijeni TODO:

```csharp
// TODO (student): kolekcija stavki (1:N prema ProformaItemEntity).
```

sa:

```csharp
public ICollection<ProformaItemEntity> Items { get; set; } = new List<ProformaItemEntity>();
```

Ostala polja (`Number`, `CustomerName`, `Note`, `ItemsCount`, `TotalAmount`, `Constraints`) **ne diraj**.

`ItemsCount` i `TotalAmount` ostaju na roditelju — handler ih postavlja pri create. List handler već čita ta polja, zato lista može prikazati zbir **bez Include stavki**.

### Provjera

Isti fajl se i dalje kompajlira. Navigacija još nije u EF configu.

---

### Korak 4 — EF konfiguracija stavke

**Gdje:** `Market.Infrastructure/Database/Configurations/Sales/`

**Fajl:** `ProformaItemConfiguration.cs`

**Uzorak:** `OrderItemConfiguration.cs`

PDF:

- FK prema **proizvodu = Restrict**
- stavka ne može bez roditelja → kao OrderItem: **Cascade** na Proforma
- nije obavezna kolekcija na `ProductEntity` → `WithMany()` bez lambde

Precision decimala projekat već postavlja globalno (`HavePrecision(18, 2)`).

```csharp
using Market.Domain.Entities.Sales;

namespace Market.Infrastructure.Database.Configurations.Sales;

public sealed class ProformaItemConfiguration : IEntityTypeConfiguration<ProformaItemEntity>
{
    public void Configure(EntityTypeBuilder<ProformaItemEntity> builder)
    {
        builder.ToTable("ProformaItems");

        builder.Property(x => x.Quantity).IsRequired();
        builder.Property(x => x.UnitPrice).HasPrecision(18, 2).IsRequired();
        builder.Property(x => x.LineAmount).HasPrecision(18, 2).IsRequired();

        builder
            .HasOne(x => x.Product)
            .WithMany()
            .HasForeignKey(x => x.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder
            .HasOne(x => x.Proforma)
            .WithMany(x => x.Items)
            .HasForeignKey(x => x.ProformaId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
```

`EntityTypeBuilder` i `DeleteBehavior` dolaze iz Infrastructure `GlobalUsings`.

### Provjera

Klasa se pokupi sama: `ApplyConfigurationsFromAssembly` u `OnModelCreating`.

---

### Korak 5 — DbSet na oba mjesta

PDF i starter TODO-ovi traže **oba** fajla. Ako zaboraviš `IAppDbContext`, handler ne vidi `ProformaItems`.

**Fajl 1:** `Market.Infrastructure/Database/DatabaseContext.cs`

Zamijeni:

```csharp
public DbSet<ProformaEntity> Proformas => Set<ProformaEntity>();
// TODO (student): DbSet za stavke predracuna.
```

sa:

```csharp
public DbSet<ProformaEntity> Proformas => Set<ProformaEntity>();
public DbSet<ProformaItemEntity> ProformaItems => Set<ProformaItemEntity>();
```

**Fajl 2:** `Market.Application/Abstractions/IAppDbContext.cs`

```csharp
DbSet<ProformaEntity> Proformas { get; }
DbSet<ProformaItemEntity> ProformaItems { get; }
```

Na vrhu `IAppDbContext` već ima `using Market.Domain.Entities.Sales;` — `ProformaItemEntity` je u tom namespaceu.

### Provjera

Build. Još nema tabele u SQL-u — treba migracija.

---

### Korak 6 — Migracija

Bez ovoga child model **ne nosi 10 bodova**.

PDF dozvoljava `update-database` **ili** da aplikacija sama migrira pri startu. Ipak **moraš kreirati** migraciju (fajl u `Migrations/`).

U **Package Manager Console** (Default project = `Market.Infrastructure`):

```
Add-Migration ProformaItems
```

Ili u CMD iz foldera `rs1_backend-2025-26`:

```
dotnet ef migrations add ProformaItems --project Market.Infrastructure --startup-project Market.API
```

Zatim ili:

```
Update-Database
```

ili samo pokreni API — `DatabaseInitializer` zove `MigrateAsync()`.

Očekuj novu tabelu `ProformaItems` s kolonama `ProformaId`, `ProductId`, `Quantity`, `UnitPrice`, `LineAmount` + audit iz `BaseEntity`.

**Ne radi unique indeks** na `Proformas.Number`. PDF: unique se provjerava u handleru.

### Provjera

SSMS → tvoja baza → Tables → `ProformaItems`.  
Pokretanje API-ja bez greške. GET `/Proformas` i dalje radi.

---

### Korak 7 — Create command

**Folder:** `Market.Application/Modules/Sales/Proformas/Commands/Create/`

Imena polja **propisana**: `number`, `customerName`, `note`, `items[].productId`, `items[].quantity`.

```csharp
namespace Market.Application.Modules.Sales.Proformas.Commands.Create;

public sealed class CreateProformaCommand : IRequest<int>
{
    public required string Number { get; set; }
    public required string CustomerName { get; set; }
    public string? Note { get; set; }
    public List<CreateProformaItemDto> Items { get; set; } = [];
}

public sealed class CreateProformaItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}
```

**Nemoj** staviti `UnitPrice` / `LineAmount` / `TotalAmount` na command. Ako ih staviš, student će ih slati s FE — PDF to kažnjava.

---

### Korak 8 — Create validator (400)

PDF: osnovna validacija = **400**.

U validator ide:

- broj: Trim, 5–20, počinje sa `PR-` **case-sensitive**
- kupac: obavezan, Trim, max 200
- napomena: Trim, max 500 (prazna je OK **osim** pravila > 5 stavki — to je **409 u handleru**, ne ovdje)
- najmanje jedna stavka
- svaka stavka: `ProductId > 0`, količina 1–1000

Dupli proizvod i unique broj **nisu** ovdje, jer moraju biti **409**.

```csharp
namespace Market.Application.Modules.Sales.Proformas.Commands.Create;

public sealed class CreateProformaCommandValidator : AbstractValidator<CreateProformaCommand>
{
    public CreateProformaCommandValidator()
    {
        RuleFor(x => x.Number)
            .Must(v =>
            {
                var n = v?.Trim() ?? string.Empty;
                return n.Length is >= 5 and <= 20 && n.StartsWith("PR-");
            })
            .WithMessage("Broj predračuna mora imati 5–20 znakova i počinjati sa PR-.");

        RuleFor(x => x.CustomerName)
            .Cascade(CascadeMode.Stop)
            .Must(v => !string.IsNullOrWhiteSpace(v))
            .WithMessage("Kupac je obavezan.")
            .Must(v => v!.Trim().Length <= ProformaEntity.Constraints.CustomerNameMaxLength)
            .WithMessage("Kupac smije imati najviše 200 znakova.");

        RuleFor(x => x.Note)
            .Must(v => string.IsNullOrWhiteSpace(v) || v.Trim().Length <= ProformaEntity.Constraints.NoteMaxLength)
            .WithMessage("Napomena smije imati najviše 500 znakova.");

        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("Predračun mora imati najmanje jednu stavku.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId)
                .GreaterThan(0)
                .WithMessage("Proizvod je obavezan.");

            item.RuleFor(i => i.Quantity)
                .InclusiveBetween(
                    ProformaEntity.Constraints.QuantityMin,
                    ProformaEntity.Constraints.QuantityMax)
                .WithMessage("Količina mora biti cijeli broj od 1 do 1000.");
        });
    }
}
```

`ProformaEntity` je u `Market.Domain.Entities.Sales`. Application `GlobalUsings` trenutno uvozi Catalog, ne Sales — dodaj:

```csharp
using Market.Domain.Entities.Sales;
```

na vrh validatora (i handlera).

### Provjera

`pr-0001` → 400. Prazan `items` → 400. `quantity: 0` → 400. Dupli proizvod ovdje još **ne** puca — to je sljedeći korak.

---

### Korak 9 — Create handler (izračun + 409 + atomičnost)

Ovo nosi najviše BE bodova (snimak cijene, zbir, audit, atomičnost).

Redoslijed **svih provjera prije bilo kojeg `Add`**:

1. Trim polja
2. Unique `Number` među neobrisanim → 409
3. Dupli `ProductId` u zahtjevu → 409 (nema spajanja)
4. Ako `items.Count > 5` i napomena nakon Trim nema non-whitespace → 409
5. Učitaj sve proizvode iz baze; ako neki Id nedostaje → **400** (ne 500/FK)
6. Računaj `UnitPrice` / `LineAmount` iz `Product.Price`
7. `Add` roditelja i stavki, `ItemsCount`, `TotalAmount`
8. **Jedan** `SaveChangesAsync`

`CreatedAtUtc` postavlja interceptor sam. PDF kaže „serversko UTC sada“ — to interceptor i radi. Ne šalji ga s klijenta.

```csharp
using FluentValidation.Results;
using Market.Domain.Entities.Sales;

namespace Market.Application.Modules.Sales.Proformas.Commands.Create;

public sealed class CreateProformaCommandHandler(IAppDbContext ctx)
    : IRequestHandler<CreateProformaCommand, int>
{
    public async Task<int> Handle(CreateProformaCommand request, CancellationToken ct)
    {
        var number = request.Number.Trim();
        var customerName = request.CustomerName.Trim();
        var note = string.IsNullOrWhiteSpace(request.Note) ? null : request.Note.Trim();

        var numberExists = await ctx.Proformas
            .AnyAsync(x => x.Number.ToLower() == number.ToLower(), ct);

        if (numberExists)
            throw new MarketConflictException("Broj predračuna već postoji.");

        var productIds = request.Items.Select(i => i.ProductId).ToList();
        if (productIds.Count != productIds.Distinct().Count())
            throw new MarketConflictException("Isti proizvod se ne smije pojaviti više puta u predračunu.");

        if (request.Items.Count > 5 && string.IsNullOrWhiteSpace(note))
        {
            throw new MarketConflictException(
                "Napomena je obavezna kada predračun ima više od pet stavki.");
        }

        var products = await ctx.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(ct);

        var productsMap = products.ToDictionary(p => p.Id);

        foreach (var item in request.Items)
        {
            if (!productsMap.ContainsKey(item.ProductId))
            {
                throw new ValidationException(new[]
                {
                    new ValidationFailure(
                        nameof(item.ProductId),
                        $"Proizvod {item.ProductId} ne postoji.")
                });
            }
        }

        var proforma = new ProformaEntity
        {
            Number = number,
            CustomerName = customerName,
            Note = note,
            ItemsCount = 0,
            TotalAmount = 0m
        };

        ctx.Proformas.Add(proforma);

        decimal total = 0m;
        foreach (var item in request.Items)
        {
            var product = productsMap[item.ProductId];
            var unitPrice = product.Price;
            var lineAmount = Math.Round(
                item.Quantity * unitPrice,
                2,
                MidpointRounding.AwayFromZero);

            ctx.ProformaItems.Add(new ProformaItemEntity
            {
                Proforma = proforma,
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = unitPrice,
                LineAmount = lineAmount
            });

            total += lineAmount;
        }

        proforma.ItemsCount = request.Items.Count;
        proforma.TotalAmount = total;

        await ctx.SaveChangesAsync(ct);
        return proforma.Id;
    }
}
```

**Zašto `Proforma = proforma` umjesto `ProformaId`:** roditelj još nema Id. EF popuni FK pri save. Isto radi Order handler.

**Zašto ne diraš `product.StockQuantity`:** 13 bodova za atomičnost kaže da zaliha ostaje ista.

**Primjer iz PDF-a:** cijena 20,00 × 3 = `LineAmount` 60,00. Druga stavka 300,00 → `TotalAmount` 360,00, `ItemsCount` 2.

### Provjera (kad bude POST)

- POST jedne stavke → 201, GET lista pokaže `itemsCount` i `totalAmount` s backenda
- isti `number` ponovo (druga veličina slova) → 409, **nema** drugog reda
- dva puta isti `productId` → 409, ništa u bazi
- 6 stavki bez napomene → 409
- 6 stavki s `"   "` → 409 (samo whitespace)
- `productId: 99999` → 400, ne 500
- cijena proizvoda u bazi poslije create **nepromijenjena**; `UnitPrice` na stavci ostaje stari snimak ako kasnije (hipotetski) mijenjaš produkt — ti produkt **ne smiješ** mijenjati

---

### Korak 10 — POST u kontroleru

**Fajl:** `Market.API/Controllers/ProformasController.cs`

Zamijeni TODO:

```csharp
using Market.Application.Modules.Sales.Proformas.Commands.Create;
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

    [HttpPost]
    public async Task<ActionResult<int>> Create(
        CreateProformaCommand command,
        CancellationToken ct)
    {
        var id = await sender.Send(command, ct);
        return CreatedAtAction(nameof(List), new { id }, id);
    }
}
```

Nema `GetById` u starteru. `CreatedAtAction(nameof(List), ...)` je dovoljno; bitan je **body = Id**. Ako ti smeta `nameof(List)`, može i `return Ok(id);` — PDF traži da uspjeh vrati novi Id.

GET list **ne diraj**. Sort i paging već odgovaraju PDF-u.

### Provjera — Swagger prije frontenda

```json
POST /Proformas
{
  "number": "PR-0001",
  "customerName": "Kupac d.o.o.",
  "note": null,
  "items": [
    { "productId": <id Monitora>, "quantity": 2 },
    { "productId": <id Tastature>, "quantity": 3 }
  ]
}
```

Monitor 150 × 2 = 300, Tastatura 20 × 3 = 60, total **360,00**, itemsCount **2**.

Zatim GET lista — vidiš jedan red, ne 500 grešku.

**Ne nastavljaj FE dok POST ne upiše stavke u `ProformaItems`.**

---

## 11. Frontend — korak po korak

Rute `/admin/proformas` i `/admin/proformas/add` već postoje. Komponente su u `AdminModule`.

---

### Korak 11 — API create metoda

**Fajl:** `src/app/api-services/proformas/proformas-api.service.ts`

Modeli `CreateProformaRequest` / `CreateProformaItemRequest` **već postoje**. Samo dopuni servis.

```ts
import {
  CreateProformaRequest,
  ListProformasRequest,
  ListProformasResponse,
} from './proformas-api.models';

// unutar klase, umjesto TODO-a:

create(payload: CreateProformaRequest): Observable<number> {
  return this.http.post<number>(this.baseUrl, payload);
}
```

Importuj `Observable` ako već nije. `list()` ne diraj.

**Ne stavljaj toast u servis.**

### Provjera

`baseUrl` je `${environment.apiUrl}/Proformas` — mora se poklapati s kontrolerom.

---

### Korak 12 — Lista HTML (paginator)

**Fajl:** `proformas.component.html`

Tabela i kolone su gotove. Spoji paginator. PDF: početno **5**, opcije **5 i 10**. Datum pipe već ima `dd.MM.yyyy` i UTC. Napomena već ima `row.note || '-'`. Iznos već ima `number:'1.2-2'`.

Zamijeni paginator:

```html
<mat-paginator
  [length]="totalItems"
  [pageIndex]="pageIndex"
  [pageSize]="pageSize"
  [pageSizeOptions]="[5, 10]"
  (page)="pageChanged($event)">
</mat-paginator>
```

**Ne dodaji** kolone Uredi/Obriši.

---

### Korak 13 — Lista TypeScript

**Fajl:** `proformas.component.ts`

Zamijeni DEMO redove. `ProformasApiService.list()` već postoji.

```ts
import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ProformasApiService } from '../../../../api-services/proformas/proformas-api.service';
import {
  ListProformasQueryDto,
  ListProformasRequest,
} from '../../../../api-services/proformas/proformas-api.models';
import { ToasterService } from '../../../../core/services/toaster.service';
import { getErrorMessage } from '../../../../core/interceptors/error-logging-interceptor.service';

@Component({
  selector: 'app-proformas',
  standalone: false,
  templateUrl: './proformas.component.html',
  styleUrl: './proformas.component.scss',
})
export class ProformasComponent implements OnInit {
  private readonly api = inject(ProformasApiService);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);

  readonly displayedColumns = [
    'number', 'createdAtUtc', 'customerName', 'itemsCount', 'totalAmount', 'note',
  ];

  rows: ListProformasQueryDto[] = [];
  totalItems = 0;
  pageSize = 5;
  pageIndex = 0;
  isLoading = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const request = new ListProformasRequest();
    request.paging.page = this.pageIndex + 1;
    request.paging.pageSize = this.pageSize;

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

  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.load();
  }

  add(): void {
    this.router.navigate(['/admin/proformas/add']);
  }
}
```

Prazna lista: HTML već ima *„Još nema snimljenih predračuna.“* **Nemoj** to tretirati kao grešku (nema toast).

### Provjera

Prije ijednog POST-a: prazna tabela, nije DEMO-0001.  
Nakon 6 predračuna u Swaggeru: strana 1 ima 5, strana 2 ima 1.

---

### Korak 14 — Validatori forme (zaglavlje, stavke, duplikat, napomena)

Dodaj na vrh `proforma-add.component.ts` (ili poseban fajl pored).

```ts
import {
  AbstractControl, FormArray, FormGroup, ValidationErrors, Validators,
} from '@angular/forms';

function prNumberValidator(control: AbstractControl): ValidationErrors | null {
  const v = (control.value ?? '').toString().trim();
  if (!v) return { required: true };
  if (v.length < 5 || v.length > 20) return { length: true };
  if (!v.startsWith('PR-')) return { prefix: true };
  return null;
}

function customerValidator(control: AbstractControl): ValidationErrors | null {
  const v = (control.value ?? '').toString().trim();
  if (!v) return { required: true };
  if (v.length > 200) return { maxlength: true };
  return null;
}

function noteMaxValidator(control: AbstractControl): ValidationErrors | null {
  const v = (control.value ?? '').toString().trim();
  if (v.length > 500) return { maxlength: true };
  return null;
}

function integerQuantityValidator(control: AbstractControl): ValidationErrors | null {
  const v = control.value;
  if (v === null || v === undefined || v === '') return { required: true };
  if (!Number.isInteger(Number(v))) return { integer: true };
  const n = Number(v);
  if (n < 1 || n > 1000) return { range: true };
  return null;
}

function duplicateProductsValidator(control: AbstractControl): ValidationErrors | null {
  const items = control.get('items') as FormArray | null;
  if (!items) return null;
  const ids = items.controls
    .map(c => c.get('productId')?.value)
    .filter((id): id is number => id != null && id !== '');
  if (ids.length !== new Set(ids).size) return { duplicateProducts: true };
  return null;
}

function noteRequiredWhenManyItems(control: AbstractControl): ValidationErrors | null {
  const items = control.get('items') as FormArray | null;
  const note = (control.get('note')?.value ?? '').toString().trim();
  if (items && items.length > 5 && !note) return { noteRequired: true };
  return null;
}
```

**Zašto form-level validator za duplikat i napomenu:** PDF traži poruke forme (TODO u HTML-u), ne nužno uz svaki input. CSS klasa `.form-error` već postoji u scss-u.

---

### Korak 15 — Add HTML: greške forme i disabled Sačuvaj

**Fajl:** `proforma-add.component.html`

Kontrole već imaju `formControlName`. Dodaj `mat-error` na zaglavlje i stavke, blok za form-level greške (TODO), i `[disabled]` na submit.

Ispod `formArray` TODO zamijeni sa:

```html
@if (form.hasError('duplicateProducts') && form.touched) {
  <div class="form-error">
    <mat-icon>error</mat-icon>
    Isti proizvod se ne smije pojaviti više puta.
  </div>
}
@if (form.hasError('noteRequired') && form.touched) {
  <div class="form-error">
    <mat-icon>error</mat-icon>
    Napomena je obavezna kada predračun ima više od pet stavki.
  </div>
}
```

Na količinu i proizvod u redu dodaj `mat-error`.

Dugme:

```html
<button
  mat-flat-button
  color="primary"
  type="submit"
  [disabled]="form.invalid || isSaving">
  <mat-icon>save</mat-icon>Sačuvaj predračun
</button>
```

Hint 0/500 na napomeni već postoji.

---

### Korak 16 — Add TypeScript: lookup, FormArray, iznosi, reset, save

**Fajl:** `proforma-add.component.ts`

Ključna pravila iz PDF-a:

- početno **jedna prazna stavka** (starter već zove `addItem()` u konstruktoru)
- lookup `GET /ExamProducts/lookup`
- `productFor(i)` → proizvod iz lookupa za prikaz cijene
- `lineAmountFor(i)` → cijena × količina; ako red nije kompletan → `null` (HTML crta `-`)
- `totalAmount()` → suma samo kad su **svi** redovi kompletni, inače `null`
- promjena proizvoda **u tom redu** briše količinu; **isti Id ponovo ne resetuje**; drugi redovi i zaglavlje nedirnuti
- `updateValueAndValidity` poslije add/remove da se napomena i duplikat revalidiraju
- uspjeh: toast + lista; greška: toast, ostani, `isSaving = false`

```ts
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamProductsApiService } from '../../../../../api-services/exam-products/exam-products-api.service';
import { ExamProductLookupItem } from '../../../../../api-services/exam-products/exam-products-api.models';
import { ProformasApiService } from '../../../../../api-services/proformas/proformas-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { getErrorMessage } from '../../../../../core/interceptors/error-logging-interceptor.service';
// + validator funkcije iz Koraka 14

@Component({
  selector: 'app-proforma-add',
  standalone: false,
  templateUrl: './proforma-add.component.html',
  styleUrl: './proforma-add.component.scss',
})
export class ProformaAddComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productsApi = inject(ExamProductsApiService);
  private readonly api = inject(ProformasApiService);
  private readonly router = inject(Router);
  private readonly toaster = inject(ToasterService);

  products: ExamProductLookupItem[] = [];
  isSaving = false;

  readonly form = this.fb.group(
    {
      number: ['', [prNumberValidator]],
      customerName: ['', [customerValidator]],
      note: ['', [noteMaxValidator]],
      items: this.fb.array<FormGroup>([]),
    },
    { validators: [duplicateProductsValidator, noteRequiredWhenManyItems] },
  );

  constructor() {
    this.addItem();
  }

  ngOnInit(): void {
    this.productsApi.lookup().subscribe({
      next: (items) => (this.products = items),
      error: (err) => this.toaster.error(getErrorMessage(err)),
    });
  }

  get items(): FormArray<FormGroup> {
    return this.form.controls.items;
  }

  addItem(): void {
    const group = this.fb.group({
      productId: [null as number | null, [Validators.required]],
      quantity: [null as number | null, [integerQuantityValidator]],
    });

    let previousId = group.controls.productId.value;
    group.controls.productId.valueChanges.subscribe((id) => {
      if (id !== previousId) {
        group.controls.quantity.reset(null);
        previousId = id;
      }
      this.form.updateValueAndValidity();
    });

    group.controls.quantity.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity();
    });

    this.items.push(group);
    this.form.updateValueAndValidity();
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.form.updateValueAndValidity();
  }

  productFor(index: number): ExamProductLookupItem | undefined {
    const id = this.items.at(index).controls['productId'].value;
    return this.products.find(p => p.id === id);
  }

  lineAmountFor(index: number): number | null {
    const product = this.productFor(index);
    const quantity = this.items.at(index).controls['quantity'].value;
    if (!product || quantity === null || quantity === undefined || quantity === '') {
      return null;
    }
    const q = Number(quantity);
    if (!Number.isInteger(q) || q < 1) return null;
    return Math.round(product.price * q * 100) / 100;
  }

  totalAmount(): number | null {
    if (this.items.length === 0) return null;
    let sum = 0;
    for (let i = 0; i < this.items.length; i++) {
      const line = this.lineAmountFor(i);
      if (line === null) return null;
      sum += line;
    }
    return Math.round(sum * 100) / 100;
  }

  cancel(): void {
    this.router.navigate(['/admin/proformas']);
  }

  save(): void {
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      this.items.controls.forEach(c => c.markAllAsTouched());
      return;
    }

    this.isSaving = true;
    const v = this.form.getRawValue();

    this.api.create({
      number: (v.number ?? '').trim(),
      customerName: (v.customerName ?? '').trim(),
      note: (v.note ?? '').trim() || null,
      items: (v.items ?? []).map((item: any) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
      })),
    }).subscribe({
      next: () => {
        this.isSaving = false;
        this.toaster.success('Predračun je snimljen.');
        this.router.navigate(['/admin/proformas']);
      },
      error: (err) => {
        this.isSaving = false;
        this.toaster.error(getErrorMessage(err));
      },
    });
  }
}
```

**Zašto `previousId`:** PDF: *„Ponovni izbor istog Id-a ne resetuje unos.“* `valueChanges` se može javiti i kad patchuješ istu vrijednost; usporedi sa starim Id-om.

**Zašto preview `Math.round(x * 100) / 100`:** samo prikaz. Backend koristi `MidpointRounding.AwayFromZero` i to je autoritativno. PDF boduje FE pregled odvojeno (3 boda) od BE računa (7).

**Payload namjerno nema cijenu.** Šalješ samo `productId` i `quantity`.

### Provjera

1. Dropdown proizvoda nije prazan.
2. Odaberi Monitor — vidiš `150,00 KM`. Unesi 2 — iznos stavke `300,00 KM`. Dok ima jedan nekompletan red, ukupno je `-`.
3. Dodaj Tastatura × 3 → ukupno `360,00 KM` (primjer iz PDF-a).
4. Promijeni proizvod u prvom redu → količina tog reda prazna, drugi red nedirnut.
5. Isti proizvod u dva reda → form error, Sačuvaj sivo, **ne** spaja količine.
6. 6 stavki bez napomene → form error; unesi razmak u napomenu → i dalje invalid; unesi `ok` → validno.
7. Snimi → lista pokazuje backend `itemsCount` i `totalAmount`, ne FE preview.
8. Namjerni dupli `PR-0001` → 409 toast, forma ostaje, dugme opet klikabilno.

---

## 12. Vizuelni tok rješenja

```
[Lista prazna] --Novi predračun--> [Add FormArray]
                                      |
                                      | lookup proizvoda (prikaz cijene)
                                      | POST { number, customerName, note, items[] }
                                      v
                               Handler: unique, duplikat, napomena,
                                        proizvodi iz baze, Round cijene,
                                        jedan SaveChanges
                                      |
                         uspjeh ------+------ greška
                            |                    |
                     toast + lista          toast, isSaving=false,
                     novi red s BE          unosi ostaju
                     ItemsCount/Total
```

Atomičnost:

```
bilo koja 400/409  →  nijedan INSERT u Proformas niti ProformaItems
sve OK             →  roditelj + sve stavke u jednom SaveChangesAsync
```

---

## 13. Kako testirati

U seedu **nema** predračuna. Proizvodi:

| Naziv | Cijena | Zaliha (ne diraš je) |
|-------|--------|----------------------|
| Tastatura | 20.00 | 10 |
| Mis | 10.00 | 50 |
| Monitor | 150.00 | 50 |
| USB memorija | 12.50 | 15 |
| Slusalice | 50.00 | 0 |
| Web kamera | 40.00 | 6 |
| USB kabl | 5.00 | 20 |
| Adapter | 8.00 | 50 |

Zaliha 0 na Slušalicama **ne smije** spriječiti predračun — predračun ne gleda zalihu.

### Brzi scenario (PDF 360,00)

1. Monitor × 2 + Tastatura × 3
2. Preview 360,00
3. Snimi
4. Lista: stavki 2, iznos 360,00 KM, datum danas
5. U SSMS: 1 red `Proformas`, 2 reda `ProformaItems`, `UnitPrice` 150 i 20
6. `Products.StockQuantity` **isti** kao prije

### Paging

Snimi 6 predračuna (`PR-0001` … `PR-0006`). Strana 5+1.

### Konflikti

| Ulaz | HTTP |
|------|------|
| `pr-0001` | 400 |
| isti broj `PR-0001` / `pr-0001` unique | 409 na drugi pokušaj validnog `PR-0001` |
| dva ista proizvoda | 409 |
| 6 stavki, note `""` | 409 |
| nepostojeći productId | 400 |

---

## 14. Najčešće greške i debug

| Simptom | Uzrok | Šta uraditi |
|---------|-------|-------------|
| DEMO redovi | `load()` prazan | spoji `api.list` |
| Paginator ne radi | šalješ `pageIndex` kao page | `page = pageIndex + 1` |
| 500 pri POST | nema migracije / nema DbSet | `ProformaItems` tabela + oba DbSet-a |
| 500 „FK“ | nisi provjerio postojanje proizvoda | 400 *prije* SaveChanges |
| Stavke se ne snime | samo `Add(proforma)` bez items | `ctx.ProformaItems.Add` ili `proforma.Items.Add` |
| Total 0 | računaš na FE i šalješ, BE ignoriše pa zaboraviš setovati | setuj `TotalAmount` u handleru |
| Unique ne vidi `pr-0001` vs `PR-0001` | nisi `ToLower` | unique je case-insensitive; prefix je case-sensitive |
| 6. stavka bez poruke | validator samo na `note` required uvijek | pravilo je `Count > 5`, form-level |
| Duplikat se spoji | sabrao količine | zabranjeno; 409 |
| Reset svih količina | `valueChanges` na cijelom formi | samo taj red, samo ako se Id **promijeni** |
| Cijena s FE u bazi | stavio `unitPrice` na command | obriši; čitaj `product.Price` |
| Zaliha palo | kopirao januarsku fakturu | **ne** diraj StockQuantity |
| Toast generički 409 | nisi `getErrorMessage` | `error.error.message` |
| Dugme ostane disabled poslije greške | `isSaving` ostao true | u `error:` stavi `false` |
| `CreatedAtAction` GetById ne postoji | nema get endpointa | `Ok(id)` ili `nameof(List)` |

Ako `Add-Migration` ne vidi novi entitet: provjeri namespace, `DbSet`, i da je config u assembly-ju Infrastructure.

---

## 15. Završna checklista prije predaje

### Backend

- [ ] `ProformaItemEntity` + `Items` na roditelju
- [ ] Restrict na Product, veza na Proforma, `WithMany()`
- [ ] DbSet u Context **i** `IAppDbContext`
- [ ] Migracija primijenjena, tabela postoji
- [ ] POST `/Proformas` vraća Id
- [ ] Body samo number, customerName, note, items[].productId/quantity
- [ ] `UnitPrice = Product.Price`, `LineAmount = Round(qty * price, 2, AwayFromZero)`
- [ ] `ItemsCount`, `TotalAmount` na roditelju
- [ ] Unique broj Trim+ToLower → 409
- [ ] Dupli proizvod → 409, bez spajanja
- [ ] > 5 stavki i prazna napomena → 409
- [ ] Nepostojeći proizvod → 400, ne 500
- [ ] Jedan `SaveChangesAsync` nakon svih provjera
- [ ] Zaliha proizvoda nepromijenjena
- [ ] GET lista netaknuta i i dalje radi

### Frontend

- [ ] Nema DEMO redova; prazna lista OK
- [ ] Paginator 5/10, total s BE
- [ ] Lookup proizvoda
- [ ] FormArray add/remove, početno 1 red
- [ ] Preview cijene i iznosa; `-` dok red nije kompletan
- [ ] Reset količine samo pri **promjeni** proizvoda
- [ ] Validatori: `PR-`, kupac, qty 1–1000, duplikat, napomena > 5
- [ ] Sačuvaj disabled dok `invalid \|\| isSaving`
- [ ] Payload bez cijena
- [ ] Uspjeh → lista + novi red; greška → ostanak + toast + ponovni pokušaj
- [ ] Nema edit/delete/modal
- [ ] ZIP bez `node_modules`

---

## 16. Kako razmišljati na ispitu

1. **Migracija prva.** Bez tabele nema 10 bodova child modela ni 13 bodova snimanja.
2. **POST u Swaggeru** s dva proizvoda (360,00) prije Angular forme.
3. **Lista je jeftina.** Spoji `load()` + paginator čim GET radi — 10 FE bodova.
4. **FormArray validator na formi**, ne u servisu.
5. Ako zapneš na reset količine: `previousId !== id` u `valueChanges`.
6. Nemoj dirati Modul 1 fajlove da „popraviš“ predračun.
7. Zadnjih 10 minuta: POST + lista bez DEMO + jedan uspješan submit s toastom.

---

## 17. Rječnik pojmova

| Pojam | Značenje ovdje |
|-------|----------------|
| **Master-detail** | Jedan predračun + N stavki, jedan POST |
| **FormArray** | Dinamička lista `FormGroup` redova |
| **Snimak cijene** | `UnitPrice` kopija `Product.Price` u trenutku izrade |
| **LineAmount** | `Round(Quantity * UnitPrice, 2, AwayFromZero)` |
| **ItemsCount** | `items.Count` na roditelju |
| **Atomičnost** | Sve ili ništa u jednom `SaveChangesAsync` |
| **409** | Dupli broj, dupli proizvod, nedostaje napomena za > 5 stavki |
| **400** | Format, količina, prazna kolekcija, nepostojeći ProductId |
| **Restrict** | Ne možeš obrisati proizvod ako ima stavki (ti proizvod ne brišeš) |
| **Cascade** | Brisanje predračuna pokupilo bi stavke — ti predračun ne brišeš |
| **pageIndex** | Angular 0-based; backend page 1-based |
| **getErrorMessage** | Čita `error.error.message` iz `ErrorDto` |

---

**Rezervacije proizvoda su prvi modul.** Ne miješaj ih s ovim fajlom. Vidi `RS1_Modul1_Vodic.md`.
