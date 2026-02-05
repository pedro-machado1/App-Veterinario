# Build da aplicação 
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copia o pom.xml primeiro 
COPY pom.xml .
RUN mvn dependency:go-offline

#gera o JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Execução da aplicação
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copia o JAR gerado
COPY --from=build /app/target/*.jar app.jar

# Garante que a pasta de imagens exista
RUN mkdir -p /app/imagens

EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]