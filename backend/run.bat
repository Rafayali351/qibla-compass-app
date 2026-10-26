@echo off
echo ==========================================================
echo Starting Qibla & Prayer Times Spring Boot Backend...
echo ==========================================================

REM Set JAVA_HOME if not already set or pointing to old version
if exist "C:\Program Files\Java\jdk-21" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
)

call mvnw.cmd spring-boot:run
pause
