"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./config/data-source");
const server_1 = require("./server");
const PORT = process.env.PORT || 3001;
data_source_1.AppDataSource.initialize().then(() => {
    console.log("Conexion db");
    server_1.app.listen(PORT, () => {
        console.log(`Estamos escuchando PTO ${PORT}`);
    });
});
