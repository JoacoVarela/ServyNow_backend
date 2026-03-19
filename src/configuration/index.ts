import { config } from 'dotenv';
config();

export const DATA_BASE_CONFIGURATION = {
	connectionString: process.env.DATABASE_URL,
	keyConnectionString: process.env.DATABASE_KEY_URL,
};

export const SERVER = {
	port: process.env.PORT,
};
