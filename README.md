# Birthday-Keeper Application

An application that uses a REST backend written in Spring and an Angular frontend.

The current repository is a combination of the following two repositories:
- [Birthday-Keeper REST Application](https://github.com/mkoutra/birthday-keeper.git)
- [Birthday-Keeper Angular Front End](https://github.com/mkoutra/birthday-keeper-angular.git)

The basic idea is that a user can create an account, set the birthdays of their friends, and get the days left until their birthdays.

## Build the project

### Option 1: Use the `docker-compose.yml` file

1. Ensure you have Docker and `docker-compose` installed on your system.
2. Clone the repository.
3. Inside the `birthday-keeper-rest-backend/` directory, build the JAR:
   - For **Linux/macOS**:
      ```bash
      ./gradlew clean build -x test
      ```
   - For **Windows**:
      ```shell
      gradlew.bat clean build -x test
      ```
4. Inside the root directory, use **docker-compose** to start the services:
    1. Start the MySQL service:
       ```bash
       docker-compose up mysql-db
       ```
       **Wait** for the database to fully initialize (~1 minute).
    
    2. Start the Spring Boot backend service:
       ```bash
       docker-compose up spring-backend
       ```

    3. Start the Angular frontend service:
       ```bash
       docker-compose up angular-frontend
       ```

5. **Access the application**: Open your browser and navigate to [http://localhost:4200](http://localhost:4200).

### Option 2: Visit the backend and frontend repositories

- [Birthday-Keeper REST Application](https://github.com/mkoutra/birthday-keeper.git)
- [Birthday-Keeper Angular Front End](https://github.com/mkoutra/birthday-keeper-angular.git)

Follow the instructions in each repository separately. 
**Instructions for both Docker and local development are provided.**