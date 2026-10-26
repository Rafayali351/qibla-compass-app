# ==============================================================================
# Multi-stage Dockerfile for Spring Boot 3 & Java 21
# Optimized for Render, Railway, Fly.io, and Cloud Run deployments
# ==============================================================================

# Stage 1: Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace

# Copy Maven descriptor and download dependencies for efficient layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and package executable fat JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a secure non-root user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy compiled JAR from builder stage
COPY --from=builder /workspace/target/qibla-prayer-backend-1.0.0.jar /app/app.jar

# Render / Railway dynamically inject PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Production JVM flags with container cgroup memory limits
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
