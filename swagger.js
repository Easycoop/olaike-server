const swaggerJsDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Root API Documentation',
            version: '1.0.0',
            description: 'Root API documentation with Swagger',
            contact: {
                name: 'Harry',
                email: 'johnharry238@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:7000/api/v1',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
