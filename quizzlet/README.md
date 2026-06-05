# Quizzlet Backend

Spring Boot backend for the Quizzlet project.

The frontend is kept outside this repository folder, at `D:\SpringBoot\quizzlet\quizlet-clone-main`.

## Environment variables

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

## Deploy

Render setup:

1. Create a managed MySQL database.
2. Create a Render Web Service from this repository.
3. Runtime: Java.
4. Root directory: repository root.
5. Build command: `./mvnw clean package -DskipTests`.
6. Start command: `java -jar target/*.jar`.
7. Add the environment variables above.

Local development:

```powershell
.\mvnw spring-boot:run
```
