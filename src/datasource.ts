import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
import { Appointment } from "./entities/Appointment";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
    process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,

    synchronize: true,
    logging: true,
    entities: [Appointment],
    migrations: [],
    subscribers: [],
});

export async function getAppointmentRepository() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    return AppDataSource.getRepository(Appointment);
}