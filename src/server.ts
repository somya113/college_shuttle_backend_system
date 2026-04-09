import express from "express";
import dotenv from "dotenv";


dotenv.config();

const app = express();

app.use(express.json());  
// 1 new 
import authRoutes from "./routes/auth.routes";

app.use("/auth", authRoutes); // /auth will be the prefix in all the routes defined in auth.routes.ts, so for example /auth/register and /auth/login will be the routes for register and login respectively

// new 2
import shuttleRoutes from "./routes/shuttle.routes";

app.use(shuttleRoutes);

// new 3 
import bookingRoutes from "./routes/booking.routes";
import { ensureDefaultRoles } from "./repository/roles.repo";

app.use(bookingRoutes);

// swagger
import { swaggerSpec, swaggerUi } from "./docs/swagger";

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//cron 1
import { startBookingStatusCron } from "./services/bookingCron.service";

startBookingStatusCron();
ensureDefaultRoles().catch((err) => console.error("Failed to seed default roles", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});