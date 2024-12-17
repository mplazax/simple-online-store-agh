## Ogólna koncepcja aplikacji

Aplikacja będzie prostym sklepem internetowym, umożliwiającym użytkownikom przeglądanie dostępnych produktów, wyszukiwanie ich po nazwie, przeglądanie szczegółów wybranego produktu, dodawanie produktów do koszyka oraz finalizację zamówienia. Dodatkowo dostępna będzie funkcjonalność logowania i rejestracji nowych użytkowników (z użyciem JWT). Użytkownicy zalogowani będą mogli dodawać opinie do produktów, a także zarządzać swoim koszykiem. W projekcie wystąpi co najmniej dwóch poziomów uprawnień: użytkownik zwykły oraz administrator. Administrator może usuwać opinie wszystkich użytkowników oraz zarządzać bazą produktów.

## Zakres funkcjonalny (minimalny, z możliwością rozszerzeń)

- **Strona główna**:

  - Wyświetlenie listy wszystkich produktów (pobranie z API, np. `https://fakestoreapi.com/products` lub z lokalnego mocka/danych w bazie).
  - Możliwość wyszukiwania produktów po nazwie.
  - Podział na kategorie (opcjonalne, zależnie od danych).

- **Lista produktów**:

  - Lista wszystkich dostępnych produktów: nazwa, krótki opis, cena, ew. kategoria.
  - Filtrowanie / wyszukiwanie po nazwie.

- **Szczegóły produktu**:

  - Wyświetlenie szczegółowych informacji: nazwa, opis, cena, dostępna ilość.
  - Pole do wyboru ilości i przycisk "Dodaj do koszyka".
  - Możliwość dodania opinii (jeśli zalogowany użytkownik).
    - Opinie zawierają e-mail (z konta lub wprowadzony przez użytkownika), treść, ocenę w gwiazdkach.
    - Walidacja formularza opinii (np. minimalna długość, poprawny format e-maila).
    - Każdy zalogowany użytkownik może dodać tylko jedną opinię do danego produktu.
    - Administracja opiniami:
      - Użytkownik może edytować/usunąć tylko swoją opinię.
      - Administrator może usuwać opinie wszystkich użytkowników.

- **Koszyk**:

  - Dodawanie produktów do koszyka (z poziomu szczegółów produktu).
  - Wyświetlanie zawartości koszyka: lista produktów, ilości, sumaryczna cena.
  - Edycja ilości lub usuwanie produktów z koszyka.
  - Po zalogowaniu możliwość finalizacji zamówienia (przejście do "Historia zamówień").
  - Jeśli użytkownik spróbuje przejść do koszyka lub historii zamówień bez logowania, zostanie przekierowany do strony logowania.

- **Logowanie i rejestracja**:
  - Logowanie zamockowanymi danymi (np. przechowywane w bazie lub pliku JSON), każda osoba z zespołu ma swoje konto. Dodatkowo konto prowadzącego (np. "admin" z rolą administratora).
  - Rejestracja nowych użytkowników (hasło szyfrowane po stronie serwera).
  - Po zalogowaniu generowany jest JWT + refresh token.
  - Zachowanie sesji użytkownika (odświeżanie tokena, pamiętanie stanu zalogowania).
- **Historia zamówień**:
  - Wyświetlenie listy wszystkich zamówień danego użytkownika.
  - Szczegóły pojedynczego zamówienia (lista produktów, daty, ceny).
- **Panel administratora** (rozszerzenie):
  - Zarządzanie produktami (CRUD na produktach).
  - Usuwanie opinii dowolnych użytkowników.
  - Podgląd wszystkich zamówień.
- **Dane / Mocki**:
  - Część danych (produkty, użytkownicy) może być na początku zamockowana w pliku JSON lub w pamięci serwera.
  - Docelowo, aby zdobyć więcej punktów, zastosowanie bazy danych i serwera z pełnym CRUD (np. PostgreSQL + Node.js).

## Technologie

- **Frontend**:

  - Framework: **React** (lub Angular/Vue/Svelte - według preferencji zespołu, tutaj przykładowo React).
  - Stylowanie: Material UI (lub inna biblioteka komponentów: React Bootstrap, Ant Design).
  - Zarządzanie stanem: React Query (do komunikacji z API) + lokalny stan (useState/useContext) lub Redux Toolkit.
  - Routing: React Router.

- **Backend**:

  - Node.js + Express.js lub NestJS (dla lepszej struktury i TypeScriptu).
  - Autentykacja: JWT + Refresh Token (Passport.js lub własna implementacja middleware).
  - Walidacja danych po stronie serwera: Yup/Joi (przy Express) lub class-validator (NestJS).
  - Baza danych: PostgreSQL (lub inna - może być SQLite/MySQL - wedle preferencji), z wykorzystaniem Prisma lub TypeORM do komunikacji z DB.
  - Dokumentacja API: Postman Collection, zamieszczona w repozytorium.

- **Inne**:
  - Wersjonowanie kodu: Git (GitHub/GitLab).
  - Konteneryzacja (opcjonalnie): Docker i docker-compose (uruchomienie bazy danych, serwera, frontendu).
  - CI/CD (opcjonalnie): GitHub Actions / GitLab CI.

## Struktura projektu

Przykładowa struktura w repozytorium (monorepo):

```
project-root/
├─ backend/
│  ├─ src/
│  │  ├─ main.ts                  # punkt wejścia w przypadku NestJS
│  │  ├─ modules/
│  │  │  ├─ auth/                 # logowanie, rejestracja, JWT
│  │  │  ├─ products/             # CRUD produktów
│  │  │  ├─ users/                # zarządzanie użytkownikami
│  │  │  ├─ orders/               # zamówienia, historia
│  │  │  ├─ reviews/              # opinie
│  │  │  └─ cart/                 # operacje na koszyku
│  │  ├─ common/
│  │  └─ config/
│  ├─ test/
│  ├─ prisma/                     # jeśli używamy Prisma do migracji DB
│  ├─ package.json
│  └─ tsconfig.json
|
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/                   # np. w Next.js lub screens w React Router
│  │  ├─ hooks/
│  │  ├─ context/
│  │  ├─ services/                # komunikacja z backendem (fetch/axios)
│  │  ├─ App.tsx
│  │  └─ index.tsx
│  ├─ public/
│  ├─ package.json
│  └─ tsconfig.json
|
├─ docker/
│  ├─ docker-compose.yml          # definicja usług (db, backend, frontend)
│  └─ Dockerfile(s)
|
├─ .env                           # zmienne środowiskowe dla backendu/frontendu
├─ README.md                      # dokumentacja projektu, setup, opis funkcjonalności
└─ postman_collection.json        # dokumentacja Postman
```

## Instrukcje uruchomienia (setup)

1. **Wymagania wstępne**:
   - Node.js (LTS)
   - npm lub yarn
   - Docker (opcjonalnie, jeśli chcemy łatwo postawić bazę danych)
2. **Zmienne środowiskowe**:
   W pliku `.env` (w katalogu głównym) ustaw:
   ```
   DATABASE_URL=postgres://user:password@localhost:5432/shopdb
   JWT_SECRET=super_secret_key
   REFRESH_SECRET=another_super_secret_key
   PORT=4000
   ```
3. **Uruchomienie bazy danych (opcjonalnie z Docker)**:

   ```bash
   cd docker
   docker-compose up -d
   # Uruchomi postgresa (i ewentualnie backend/frontend)
   ```

   Jeśli baza danych na lokalnym środowisku, zadbaj o jej konfigurację i migracje:

   ```bash
   cd backend
   npx prisma migrate dev
   ```

4. **Instalacja zależności i uruchomienie backendu**:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   Backend będzie dostępny na `http://localhost:4000`.
5. **Instalacja zależności i uruchomienie frontendu**:
   ```bash
   cd ../frontend
   npm install
   npm run start
   ```
   Frontend będzie dostępny na `http://localhost:3000`.
6. **Logowanie**:

   - Aplikacja zawiera zamockowane konta użytkowników, np.:
     - Admin: login: `admin`, hasło: `admin123`
     - Użytkownik: login: `user1`, hasło: `user1234`
   - Rejestracja nowych użytkowników dostępna z poziomu interfejsu.

7. **Funkcjonalność**:

   - Przeglądaj produkty, dodawaj do koszyka, loguj się, wystawiaj opinie, przeglądaj historię zamówień.
   - Admin może edytować produkty, usuwać opinie.

8. **Dokumentacja**:
   - Szczegóły konfiguracji, użytych technologii, opis funkcjonalności, role w zespole oraz instrukcje będą w pliku `README.md`.
   - Kolekcja Postmana do testowania backendu: `postman_collection.json`.

## Dodatkowe punkty jakościowe

- Responsywny design (Material UI).
- Testy jednostkowe na backendzie (Jest + Supertest) i front-endzie (React Testing Library).
- Wykorzystanie CI/CD do automatyzacji wdrożeń.
- Użycie refresh tokena do przedłużania sesji.
- Estetyczny i przejrzysty interfejs użytkownika.
