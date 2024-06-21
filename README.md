# SnapCard

**Idee:** Eine Web-App, die es Designern und Fotografen ermöglicht, individuelle digitale Visitenkarten zu erstellen und zu teilen. Diese Visitenkarten sind einfach über eine URL zugänglich und bieten eine Möglichkeit, Portfolios und Werke zu präsentieren.

Die Anwendung ist auf der Cloud-Plattform Vercel gehostet und kann unter [snap-card-seven.vercel.app](https://snap-card-seven.vercel.app/) aufgerufen werden.

## Hinweis

Um die Web-Anwendung zum Laufen zu bringen benötigt man einige **Environment Variablen**. Diese sind erforderlich, um eine Verbindung zur Datenbank herzustellen, eine sichere Interaktion mit NextAuth zu ermöglichen, Zugriff auf den Resend-E-Mail-Dienst zu haben und auf den Dateiupload-Dienst Uploadthing zuzugreifen. Diese **Environment-Datei ist in dem Projekt ausgefüllt vorhanden**, wird aber sonst nicht veröffentlicht.

Das Versenden von E-Mails zur Verifizierung und Passwortrücksetzung funktioniert einwandfrei. Für die Entwicklungsumgebung ist jedoch nur das Senden von Resend-Mails an meine E-Mail-Adresse möglich. Daher wird jeder neu registrierte Benutzer automatisch verifiziert. Nach der Registrierung ist es also möglich, sich einzuloggen, ohne eine separate Verifizierung durchführen zu müssen.

Die Datenbank kann mit dem Befehl `npm run db:studio` geöffnet werden. Hier können die Tabellen auf der URL `local.drizzle.studio` eingesehen und bearbeitet werden.

Test-Nutzer:
E-Mail: <test@test.de>
Passwort: 123456

## Installation

1. Installieren der Packages
   `npm install`

2. Environment Variablen hinzufügen

```
# Vercel postgres
POSTGRES_URL=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL_NO_SSL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_DATABASE=""

# Next Auth
# You can generate a new secret on the command line with:
# openssl rand -base64 32
# https://next-auth.js.org/configuration/options#secret
NEXTAUTH_SECRET=""
NEXTAUTH_URL=""

# Resend
RESEND_API_KEY=""

# Uploadthing
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

3. Starten der Anwendung
   `npm run dev`

## Tech-Architektur

- [NextJS](https://nextjs.org/):
  React-Framework, welches Server-Side-Rendering ermöglicht. In dieser Web-App wird trotzdem darauf geachtet, dass es eine Single-Page-Application ist.
- [Tailwind CSS](https://tailwindcss.com/):
  Framwork für CSS, welches die Implementierung von dem Design vereinfacht.
- [Shadcn-ui](https://ui.shadcn.com/):
  React-Komponenten-Bibliothek, die die Implementierung vereinfacht.
- [TypeScript](https://www.typescriptlang.org/):
  Basierend auf JavaScript mit zusätzlichen Funktionen wie Typisierung.
- [Drizzle ORM](https://orm.drizzle.team/):
  Javascript-Bibliothek, welche die Interaktionen mit der Datenbank abstrahiert und vereinfacht.
- [PostgreSQL](https://www.postgresql.org/) \ [Vercel Storage](https://vercel.com/):
  Datenbankverwaltungssystem. Vercel als Cloud-Plattform, die zur Online-Speicherung und Verwaltung der Datenbank dient.
- [NextAuth](https://next-auth.js.org/) \ [Auth.js v5](https://authjs.dev/):
  Javascript-Bibliothek für die Integration für Authentifizierungsmechanismen.
- [Resend](https://resend.com):
  E-Mail-Dienst zum Versenden von Verifizierungs-/Password-Reset-Mails.
- [Uploadthing](https://uploadthing.com/):
  Dateiupload-Dienst, der die Integration von Bilder-Uploads in Webanwendungen vereinfacht.
- [Vercel](https://vercel.com/):
  Cloud-Plattform, für das Hosting und Deployment von modernenen Webanwendungen.
