import { AppDataSource } from "./config/data-source";
import "reflect-metadata";
import { app } from "./server";

const PORT = process.env.PORT || 3001;

AppDataSource.initialize().then(() => {
  console.log("Conexion db initialized");
  app.listen(PORT, () => {
    console.log(`Estamos escuchando PTO ${PORT}`);
  });
});
