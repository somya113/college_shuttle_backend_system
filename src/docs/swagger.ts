import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shuttle API",
      version: "1.0.0"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };