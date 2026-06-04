# Quizzlet

Full-stack Quizzlet project:

- Backend: Spring Boot at the repository root.
- Frontend: Next.js/T3 Turbo app in `frontend/`.

## Backend environment variables

Set these values in production instead of committing secrets to Git:

```env
PORT=8080
JWT_SECRET=
JWT_EXPIRATION=86400000
SPRING_DATASOURCE_URL=
SPRING_DATASOURCE_USERNAME=
SPRING_DATASOURCE_PASSWORD=
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Frontend environment variables

Create these in the frontend hosting provider:

```env
POSTGRES_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_EMAIL_FROM=
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain/quizzlet
NEXT_PUBLIC_S3_REGION=
NEXT_PUBLIC_S3_ACCESS_KEY=
NEXT_PUBLIC_S3_SECRET_KEY=
NEXT_PUBLIC_S3_BUCKET_NAME=
```

## Deploy backend

Render setup:

1. Create a managed MySQL database.
2. Create a Render Web Service from this repository.
3. Runtime: Java.
4. Root directory: repository root.
5. Build command: `./mvnw clean package -DskipTests`.
6. Start command: `java -jar target/*.jar`.
7. Add the backend environment variables above.

Local backend:

```powershell
.\mvnw spring-boot:run
```

## Deploy frontend

Vercel setup:

1. Import this repository.
2. Root directory: `frontend`.
3. Framework preset: Next.js.
4. Install command: `pnpm install --frozen-lockfile`.
5. Build command: `pnpm build`.
6. Add the frontend environment variables above.

Local frontend:

```powershell
cd frontend
pnpm install
pnpm dev:next
```
