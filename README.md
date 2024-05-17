# SnapCard

**Idee:** Eine Web-App, die es Designern und Fotografen ermöglicht, individuelle digitale Visitenkarten zu erstellen und zu teilen. Diese Visitenkarten sind einfach über eine URL zugänglich und bieten eine Möglichkeit, Portfolios und Werke zu präsentieren.

## Hinweis

Um die Web-Anwendung zum Laufen zu bringen benötigt man einige **Environment Variablen**. Diese sind erforderlich, um eine Verbindung zur Datenbank herzustellen, eine sichere Interaktion mit NextAuth zu ermöglichen, Zugriff auf den Resend-E-Mail-Dienst zu haben und auf den Dateiupload-Dienst Uploadthing zuzugreifen. Diese **Environment-Datei ist in dem Projekt ausgefüllt vorhanden**, wird aber sonst nicht veröffentlicht.

Das Versenden von E-Mails zur Verifizierung und Passwortrücksetzung funktioniert einwandfrei. Für die Entwicklungsumgebung ist jedoch nur das Senden von Resend-Mails an meine E-Mail-Adresse möglich. Daher wird jeder neu registrierte Benutzer automatisch verifiziert. Nach der Registrierung ist es also möglich, sich einzuloggen, ohne eine separate Verifizierung durchführen zu müssen.

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

- NextJS
  React-Framework, welches Server-Side-Rendering ermöglicht. In dieser Web-App wird trotzdem darauf geachtet, dass es eine Single-Page-Application ist.
- Tailwind CSS
  Framwork für CSS, welches die Implementierung von dem Design vereinfacht.
- TypeScript
  Basierend auf JavaScript mit zusätzlichen Funktionen wie Typisierung.
- Drizzle ORM
  Javascript-Bibliothek, welche die Interaktionen mit der Datenbank abstrahiert und vereinfacht.
- Postgresql (Vercel Storage)
  Datenbankverwaltungssystem. Vercel als Cloud-Plattform, die zur Online-Speicherung und Verwaltung der Datenbank dient.
- NextAuth.js / Auth.js v5
  Javascript-Bibliothek für die Integration für Authentifizierungsmechanismen.
- Resend
  E-Mail-Dienst zum Versenden von Verifizierungs-/Password-Reset-Mails.
- Uploadthing
  Dateiupload-Dienst, der die Integration von Bilder-Uploads in Webanwendungen vereinfacht.
- Vercel (Deployment)
  Cloud-Plattform, für das Hosting und Deployment von modernenen Webanwendungen.

## TODOs

### Abgeschlossen

- [x] Authentifizierung
  - [x] Registrierung
    - [x] E-Mail-Verifizierung
  - [x] Passwort-Reset
  - [x] Login
  - [x] Logout
  - [x] Session-Management (Speichern von Session-Token in Cookies)
- [x] Allgemein
  - [x] Grobes Routen-Layout mit protected routes
  - [x] Grobes Design-Layout von Header, Footer, Pages
  - [x] Upload von Bildern

### Teilweise abgeschlossen

- [ ] Dashboard-Design
- [ ] Profil

### TODO

- [ ] Visitenkarten
  - [ ] Visitenkarten erstellen
    - [ ] Form mit verschiedenen Input-Fields
    - [ ] Bilder als Gallerie mit Detail-Ansicht
  - [ ] Visitenkarten updaten
  - [ ] Visitenkarten löschen
  - [ ] Ansicht der feritigen Visitenkarte mit Link zum Teilen
- [ ] Profil
  - [ ] Profil-Details Ansicht
  - [ ] Profil-Details ändern
- [ ] Settings
  - [ ] Settings Ansicht
  - [ ] Settings ändern
  - [ ] Evtl. Design-Theme als Cookie speichern
- [ ] Studienarbeit
  - [ ] Anforderungsanalyse
  - [ ] Architektur und Entwurf
  - [ ] Implementierung
  - [ ] Walkthrough durch App
  - [ ] Selbstständigkeitserklärung
  - [ ] Quellenangaben
