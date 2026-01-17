# facultate
Task Board - Proiect facultate anul 2 semenstrul 1 Universitatea danubius Galati
# TaskBoard - Full Stack Task Management App

**TaskBoard** este o aplicație web completă pentru gestionarea sarcinilor, dezvoltată ca proiect pentru anul 2, semestrul 1 la Universitatea Danubius Galați. Aplicația utilizează o arhitectură modernă de tip Monorepo și tehnologii de ultimă oră pentru a oferi o experiență de utilizare fluidă și sigură.

![TaskBoard Screenshot](https://via.placeholder.com/1200x600?text=TaskBoard+Dashboard+Preview)

## 🚀 Tehnologii Utilizate

Proiectul este construit folosind următorul stack tehnologic:

*   **Monorepo**: Organizat cu [pnpm workspaces](https://pnpm.io/workspaces) (compatibil și cu npm).
*   **Frontend**:
    *   [Next.js 14](https://nextjs.org/) (App Router & Server Components)
    *   [Tailwind CSS](https://tailwindcss.com/) (Stilizare modernă și responsive)
    *   [React Query](https://tanstack.com/query/latest) (State management server-side)
    *   [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Validare formulare)
*   **Backend**:
    *   [Fastify](https://fastify.dev/) (Framework performant pentru Node.js)
    *   [Prisma ORM](https://www.prisma.io/) (Interacțiune cu baza de date)
    *   [SQLite](https://www.sqlite.org/index.html) (Bază de date locală, lightweight)
    *   [JWT](https://jwt.io/) (Autentificare securizată cu Access & Refresh Tokens)
*   **Shared**:
    *   Bibliotecă partajată (`@taskboard/shared`) pentru tipuri TypeScript și scheme de validare Zod, asigurând consistența între Frontend și Backend.

## 🛠️ Instalare și Configurare

Urmează acești pași pentru a rula proiectul local:

### Cerințe
*   Node.js (v18+)
*   npm (v9+)

### 1. Clonarea Repozitoriului
```bash
git clone https://github.com/username/taskboard.git
cd taskboard
```

### 2. Instalarea Dependențelor
Instalează toate pachetele necesare din rădăcina proiectului:
```bash
npm install
```

### 3. Configurarea Bazei de Date (Backend)
Navighează în folderul API și rulează migrațiile Prisma pentru a inițializa baza de date SQLite:
```bash
cd apps/api
npx prisma migrate dev --name init
cd ../..
```
*Acest pas va crea fișierul `dev.db` în `apps/api/prisma`.*

### 4. Construirea Pachetelor Partajate
Este necesar să construiești pachetul shared înainte de a porni aplicația:
```bash
cd packages/shared
npm run build
cd ../..
```

## 🏃‍♂️ Rulare Aplicație

Poți porni simultan Frontend-ul și Backend-ul folosind comanda din rădăcină (dacă este configurată) sau separat:

**Terminal 1 (Backend - API):**
```bash
cd apps/api
npm run dev
```
*Serverul va porni pe `http://localhost:4000`*
*Documentația Swagger API este disponibilă la `http://localhost:4000/docs`*

**Terminal 2 (Frontend - Web):**
```bash
cd apps/web
npm run dev
```
*Aplicația web va fi accesibilă la `http://localhost:3000`*

## 📁 Structura Proiectului

```
taskboard/
├── apps/
│   ├── api/          # Server Fastify, Prisma, Auth, Tasks CRUD
│   └── web/          # Aplicație Next.js, Pagini (Login, Register, Dashboard)
├── packages/
│   └── shared/       # Tipuri TypeScript și Scheme Zod partajate
├── package.json      # Configurare Workspace
└── README.md         # Documentație
```

## ✨ Funcționalități Cheie

*   **Autentificare**: Înregistrare și Login securizat cu hash-uirea parolelor (Bcrypt) și JWT.
*   **Dashboard**: Vizualizarea listei de sarcini cu opțiuni de filtrare după status și prioritate.
*   **Task Management**: Creare, Editare și Ștergere sarcini (CRUD complet).
*   **Validare**: Formulare validate atât pe client cât și pe server folosind Zod.
*   **Responsive**: Interfață adaptabilă pentru mobil și desktop.

## 👤 Autor

Proiect realizat de [Numele Tău].

## 📄 Licență

Acest proiect este licențiat sub [MIT License](LICENSE).
