# Console-Game

Tento projekt představuje návrh a implementaci konzolové aplikace (CLI), která slouží k řízení a monitorování objektů ve virtuálním nebo simulovaném prostředí. Hlavní myšlenkou je vytvořit univerzální textové rozhraní, pomocí kterého může uživatel komunikovat se systémem prostřednictvím příkazů.

Aplikace je postavena na principu oddělení konzole a samotného světa. Konzole zajišťuje zpracování vstupu uživatele, interpretaci příkazů a zobrazování textové odezvy. Virtuální svět tvoří samostatnou logickou vrstvu, která obsahuje objekty, jejich vlastnosti a chování. Díky tomuto rozdělení je možné svět upravovat nebo kompletně vyměnit bez zásahů do samotné konzole.

Uživatel komunikuje se systémem pomocí textových příkazů. Tyto příkazy umožňují například:

- získávat informace o aktuálním stavu objektů,
- měnit jejich vlastnosti,
- ovládat jejich pohyb nebo chování,
- zobrazovat přehled systému,
- pracovat s více objekty současně.

Projekt klade důraz na modularitu, přehlednost a rozšiřitelnost. Architektura je navržena tak, aby bylo možné snadno přidávat nové příkazy, nové typy objektů nebo dokonce zcela nový typ světa bez nutnosti zásadních úprav existujícího kódu. Konzole funguje jako obecné rozhraní, které není pevně svázáno s konkrétní implementací.

Virtuální svět může představovat například herní prostředí, technický systém, simulaci robota, jednoduchý model města nebo jiný abstraktní systém. Konkrétní podoba světa není předem pevně daná – důležitá je samotná struktura aplikace a způsob komunikace mezi uživatelem a systémem.

Cílem projektu je pochopení principů návrhu univerzálního rozhraní, práce s příkazovým systémem a oddělení jednotlivých vrstev aplikace. Důležitou součástí je také čitelnost a struktura kódu, aby bylo řešení dlouhodobě udržitelné a připravené na další rozšiřování.

---

## Použité technologie

Projekt je v současné fázi realizován pomocí následujících technologií:

- **HTML5** – struktura aplikace a vytvoření rozhraní (herní plocha a konzole)
- **CSS3** – stylování aplikace, rozložení prvků a vizuální podoba konzole
- **JavaScript (ES6+)** – aplikační logika, zpracování příkazů, práce s objekty a řízení virtuálního světa

K vykreslování vizuální části světa je využíván **HTML5 Canvas**, který umožňuje dynamické zobrazování objektů a jejich změn v reálném čase.

Do budoucna je možné projekt dále rozšířit například o práci se serverem, ukládání dat nebo pokročilejší uživatelské rozhraní.
