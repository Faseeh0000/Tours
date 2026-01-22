import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// import { OpenAPIRegistry, OpenApiGenerator } from "zod-to-openapi";
// import * as userSchemas from "../Schemas/ZodSchema.js"; // adjust path

// // Create registry and register schemas
// const registry = new OpenAPIRegistry();
// registry.register("UserSignupInput", userSchemas.createUserSchema);
// registry.register("UserLoginInput", userSchemas.loginSchema);
// registry.register("ForgotPasswordInput", userSchemas.forgotSchema);
// registry.register("ResetPasswordInput", userSchemas.resetSchema);
// registry.register("UpdatePasswordInput", userSchemas.updatePasswordSchema);
// registry.register("UpdateMeInput", userSchemas.updateMeSchema);
// registry.register("AdminUpdateInput", userSchemas.adminUpdateSchema);
// registry.register("BookingInput", userSchemas.bookingSchema);
// registry.register("ReviewInput", userSchemas.reviewSchema);

// // Generate OpenAPI components
// const generator = new OpenApiGenerator(registry.definitions);
// const generatedComponents = generator.generateComponents();

// // Merge generated components into your existing swagger options
// options.definition.components = options.definition.components || {};
// options.definition.components.schemas = {
//   ...(options.definition.components.schemas || {}),
//   ...generatedComponents
// };

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Tours Backend API",
      version: "1.0.0",
      description: "Final Year Project – Node.js + MongoDB + Mongoose API"
    },

    servers: [
      {
        url: "http://localhost:4000",
        description: "Local Development Server"
      }
    ],

    components: {
      /* ================= SECURITY ================= */
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },

      /* ================= SCHEMAS ================= */
      schemas: {

        /* ================= USER ================= */

        UserSignupInput: {
          type: "object",
          required: ["name", "email", "phoneNo", "pass", "confirmPass"],
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "Ali Khan"
            },
            email: {
              type: "string",
              format: "email",
              example: "ali@gmail.com"
            },
            phoneNo: {
              type: "number",
              example: 1234567890
            },
            countryCode: {
              type: "string",
              example: "+92"
            },
            countryISO: {
              type: "string",
              example: "PK"
            },
            pass: {
              type: "string",
              minLength: 4,
              example: "password123"
            },
            confirmPass: {
              type: "string",
              minLength: 4,
              example: "password123"
            },
            role: {
              type: "string",
              enum: ["admin", "user", "Guide"],
              default: "user",
              example: "user"
            }
          }
        },

        UserLoginInput: {
          type: "object",
          required: ["email", "pass"],
          properties: {
            email: {
              type: "string",
              format: "email"
            },
            pass: {
              type: "string"
            }
          }
        },

        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            phoneNo: { type: "number" },
            countryCode: { type: "string" },
            countryISO: { type: "string" },
            role: {
              type: "string",
              enum: ["admin", "user", "Guide"]
            }
          }
        },

        ForgotPasswordInput: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com"
            }
          }
        },

        ResetPasswordInput: {
          type: "object",
          required: ["password", "confirmPassword"],
          properties: {
            password: {
              type: "string",
              minLength: 4,
              example: "newpassword123"
            },
            confirmPassword: {
              type: "string",
              minLength: 4,
              example: "newpassword123"
            }
          }
        },

        UpdatePasswordInput: {
          type: "object",
          required: ["currentPassword", "newPassword", "confirmNewPassword"],
          properties: {
            currentPassword: {
              type: "string",
              example: "currentpass123"
            },
            newPassword: {
              type: "string",
              minLength: 4,
              example: "newpassword123"
            },
            confirmNewPassword: {
              type: "string",
              minLength: 4,
              example: "newpassword123"
            }
          }
        },

        UpdateMeInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "Updated Name"
            },
            email: {
              type: "string",
              format: "email",
              example: "updated@example.com"
            }
          }
        },

        AdminUpdateInput: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "Updated Name"
            },
            email: {
              type: "string",
              format: "email",
              example: "updated@example.com"
            },
            role: {
              type: "string",
              enum: ["admin", "user", "Guide"],
              example: "user"
            }
          }
        },

        /* ================= TOUR ================= */

        Location: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["Point"],
              example: "Point"
            },
            coordinates: {
              type: "array",
              items: { type: "number" },
              example: [73.0479, 33.6844]
            },
            description: {
              type: "string",
              example: "Stop near lake"
            },
            day: {
              type: "number",
              example: 2
            }
          }
        },

        TourInput: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 20,
              example: "Hunza Valley Tour"
            },
            price: {
              type: "number",
              example: 250
            },
            ratingsAverage: {
              type: "number",
              example: 4.5
            },
            duration: {
              type: "number",
              example: 5
            },
            difficulty: {
              type: "string",
              enum: ["easy", "medium", "difficult"],
              example: "medium"
            },
            locations: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Location"
              }
            }
          }
        },

        Tour: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            price: { type: "number" },
            ratingsAverage: { type: "number" },
            duration: { type: "number" },
            difficulty: { type: "string" },
            locations: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Location"
              }
            },
            createdAt: {
              type: "string",
              format: "date-time"
            },
            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        },

        /* ================= REVIEW ================= */

        ReviewInput: {
          type: "object",
          required: ["review", "rating", "tour"],
          properties: {
            review: {
              type: "string",
              example: "Amazing tour experience!"
            },
            rating: {
              type: "number",
              minimum: 1,
              maximum: 5,
              example: 5
            },
            tour: {
              type: "string",
              example: "65abc123..."
            }
          }
        },

        Review: {
          type: "object",
          properties: {
            _id: { type: "string" },
            review: { type: "string" },
            rating: { type: "number" },
            user: { type: "string" },
            tour: { type: "string" },
            createdAt: {
              type: "string",
              format: "date-time"
            }
          }
        },

        /* ================= BOOKING ================= */

        BookingInput: {
          type: "object",
          required: ["tour", "price"],
          properties: {
            tour: {
              type: "string",
              example: "65abc123..."
            },
            price: {
              type: "number",
              example: 300
            }
          }
        },

        Booking: {
          type: "object",
          properties: {
            _id: { type: "string" },
            tour: { type: "string" },
            user: { type: "string" },
            price: { type: "number" },
            paid: { type: "boolean" },
            createdAt: {
              type: "string",
              format: "date-time"
            }
          }
        }
      }
    }
  },

  /* ================= ROUTES ================= */
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsDoc(options);

export { swaggerUi, swaggerSpec };
