# 🛒 Simple Online Store

Simple Online Store to pełnoprawna aplikacja e-commerce, pozwalająca użytkownikom na przeglądanie produktów, dodawanie ich do koszyka, składanie zamówień oraz przeglądanie historii zamówień. Projekt wykorzystuje **React** na frontendzie oraz **Node.js / Express.js** z **Sequelize** jako ORM dla bazy danych PostgreSQL.

---

## 📌 Funkcjonalności

- ✅ Rejestracja i logowanie użytkowników
- ✅ Przeglądanie listy produktów
- ✅ Dodawanie produktów do koszyka
- ✅ Usuwanie produktów z koszyka
- ✅ Składanie zamówień
- ✅ Historia zamówień użytkownika
- ✅ Panel administratora (zarządzanie produktami i zamówieniami)

---

## 🏗️ Technologie

### 🔹 Backend

- **Node.js** + **Express.js** – Serwer API
- **Sequelize** – ORM dla bazy danych PostgreSQL
- **JWT (JSON Web Token)** – Autoryzacja użytkowników
- **bcrypt** – Hashowanie haseł

### 🔹 Frontend

- **React.js** (z React Hooks + Context API)
- **Axios** – Komunikacja z API
- **Material-UI** – Komponenty UI

### 🔹 Baza danych

- **PostgreSQL** – Relacyjna baza danych
- **Sequelize** – ORM do zarządzania modelami i migracjami

---

## 🔧 Instalacja i konfiguracja

1. **Sklonuj repozytorium:**

   ```sh
   git clone https://github.com/TwojRepozytorium/Simple-Online-Store.git
   cd Simple-Online-Store
   ```

2. **Backend**

   ```sh
   cd backend
   npm install
   ```

   Skonfiguruj plik `.env`:

   ```env
   PORT=5001
   DATABASE_URL=postgres://user:password@localhost:5432/your_database
   JWT_SECRET=your_jwt_secret
   ```

   Uruchom migracje:

   ```sh
   npx sequelize db:migrate
   ```

   Uruchom serwer:

   ```sh
   npm start
   ```

3. **Frontend**
   ```sh
   cd frontend
   npm install
   npm start
   ```

Aplikacja powinna być dostępna pod adresem `http://localhost:3000`.

---

## 🔗 API Endpoints

### 🔹 Użytkownicy

- `POST /api/auth/register` – Rejestracja użytkownika
- `POST /api/auth/login` – Logowanie użytkownika
- `GET /api/auth/profile` – Pobranie profilu użytkownika (wymaga JWT)

### 🔹 Produkty

- `GET /api/products` – Pobranie wszystkich produktów
- `GET /api/products/:id` – Pobranie szczegółów produktu
- `POST /api/products` – Dodanie nowego produktu (wymaga admina)
- `PUT /api/products/:id` – Edycja produktu (wymaga admina)
- `DELETE /api/products/:id` – Usunięcie produktu (wymaga admina)

### 🔹 Koszyk

- `GET /api/cart` – Pobranie zawartości koszyka użytkownika
- `POST /api/cart` – Dodanie produktu do koszyka
- `DELETE /api/cart/:id` – Usunięcie produktu z koszyka

### 🔹 Zamówienia

- `POST /api/orders` – Składanie zamówienia
- `GET /api/orders` – Historia zamówień użytkownika

---

## 🛠️ Możliwe ulepszenia

- 🔜 Strona admina do zarządzania produktami i zamówieniami
- 🔜 Obsługa płatności (np. Stripe lub PayPal)
- 🔜 Ulepszony system recenzji produktów
- 🔜 Powiadomienia e-mail o statusie zamówienia

---

## 👥 Autorzy

- **Michał Plaza**

---

## 📜 Licencja

Projekt jest dostępny na licencji MIT. Możesz go używać, modyfikować i dystrybuować dowolnie.
