import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(8001),
    JWT_SECRET_KEY: Joi.string().required(),
  })
  .unknown();

const { value, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface EnvConfig {
  server: {
    env: string;
    port: number;
  };
  secretKey: {
    jwtSecretKey: string;
  };
}

export const envConfig: EnvConfig = {
  server: {
    env: value.NODE_ENV,
    port: value.PORT,
  },
  secretKey: {
    jwtSecretKey: value.JWT_SECRET_KEY,
  },
};
