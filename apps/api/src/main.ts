import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle("BookNest API").addBearerAuth().build(),
  );
  SwaggerModule.setup("api/docs", app, doc);
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
