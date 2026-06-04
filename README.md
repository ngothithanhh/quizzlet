# Quizzlet

Spring Boot backend for the Quizzlet project.

## Required environment variables

Set these values in production instead of committing secrets to Git:

```env
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

## Deploy backend

This repository needs the Maven build files and Java source files before a hosting platform can build it from Git. The expected files include `pom.xml`, `src/main/java/**`, and optionally `mvnw` / `mvnw.cmd`.

After those files are present, deploy on Render:

1. Create a MySQL database on Railway, Aiven, PlanetScale, or another managed MySQL provider.
2. In Render, create a new Web Service from this GitHub repository.
3. Use Java runtime.
4. Build command: `./mvnw clean package -DskipTests` or `mvn clean package -DskipTests`.
5. Start command: `java -jar target/*.jar`.
6. Add all required environment variables from the list above.
7. Set the app port to use Render's `PORT` if the app is changed to support it, or configure Render to route to port `8080`.

For local development:

```powershell
mvn spring-boot:run
```
