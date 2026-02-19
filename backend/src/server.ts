import express, { type Request, type Response } from "express";
import cors from "cors";
import authRouter from "./api/auth";

const app = express();

// 1. Настройка CORS - делаем её более гибкой для разработки
app.use(cors({
  origin: true, // Разрешает запросы с любого источника, откуда пришел запрос (удобно для разработки)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Парсер JSON (должен идти ПЕРЕД роутами)
app.use(express.json());

// 3. Роуты
app.use("/api/auth", authRouter);

// Проверка работы сервера
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok!!!!!!" });
});

// 4. Глобальный обработчик ошибок (поможет увидеть ошибки в консоли сервера)
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Ошибка на сервере:", err.stack);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});