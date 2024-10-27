import { App } from "@/app";
import { AppRoute } from "@/routes/app.route";
import { AuthRoute } from "@/routes/auth.route";
import { CarRoute } from "@/routes/car.route";

const app = new App([new AppRoute(), new AuthRoute(), new CarRoute()]);

app.listen()
