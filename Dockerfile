# Start with a base image containing Java runtime
FROM openjdk:11
# Add Author info
LABEL maintainer="habuhamo900@naver.com"
# Add a volume to /tmp
VOLUME /tmp
# Make port 8080 available to the world outside this container
EXPOSE 8080
# The application's jar file
ARG JAR_FILE=./build/libs/firstproject-0.0.1-SNAPSHOT.jar//
# Add the application's jar to the container
COPY ${JAR_FILE} meta.jar
# Run the jar file
ENTRYPOINT ["java","-jar","/meta.jar"]
