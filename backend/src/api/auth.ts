import express, { Request, Response } from "express";
import { hashPass } from "../utils/hashPass";
import prisma from "../db";

interface RegisterBody {
  username?: string;
  email?: string;
  password?: string;
}

const router = express.Router();

// Заглушки для входа и выхода (реализуешь позже)
router.post("/login", async (req, res) => {
  res.status(501).json({ message: "Логика входа еще не реализована" });
});

router.post("/logout", async (req, res) => {
  res.status(501).json({ message: "Логика выхода еще не реализована" });
});

// РЕГИСТРАЦИЯ
router.post(
  "/register",
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    try {
      const { username, email, password } = req.body;

      // 1. Проверяем, что все поля переданы
      if (!email || !password || !username) {
        return res.status(400).json({ error: "Email, имя пользователя и пароль обязательны" });
      }

      // 2. Проверяем, не занят ли email или username
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: "Этот email или имя пользователя уже заняты" });
      }

      // 3. Хешируем пароль (чтобы не хранить его в открытом виде)
      const hashedPass = await hashPass(password);

      // 4. Сохраняем пользователя в PostgreSQL через Prisma
      const newUser = await prisma.user.create({
        data: { 
          username, 
          email, 
          password: hashedPass 
        },
      });

      // 5. Отправляем ответ фронтенду (без пароля!)
      return res.status(201).json({ 
        message: "Регистрация прошла успешно!", 
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        }
      });

    } catch (e: any) {
      console.error("Ошибка Prisma:", e);
      return res.status(500).json({ error: "Внутренняя ошибка сервера" });
    }
  }
);

export default router;