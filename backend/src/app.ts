import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";


const app = express();
const prisma = new PrismaClient();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors())

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      res.status(409).json({ error: "User  already exists" });
    }

    const userCreated = await prisma.user.create({
      data: {
        email,
        username: username,
        password,
      },
    });

    res.status(201).json({ user: userCreated });
  } catch (error) {
    console.log(error);
    res.status(402).send("Server error");
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      console.log("No user")
      res.status(409).json({ error: "User  not found" });
    }

    if (user?.password !== password) {
      res.status(401).json({ error: "Wrong credentials" });
    }
    console.log(user);
    res.send(user);
  } catch (error) {
    res.status(402).send("Server error");
  }
});

app.post("/user", async  (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    console.log(id)

    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        notes: true,
      },
    });

    if(!user){
        res.status(404).send("Not Found");
    }
    

    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

app.get("/notes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        notes: true,
      },
    });

    console.log("User found");

    const notes = user?.notes;
    console.log("Notes found");

    res.status(201).send(notes);
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

app.post("/note/create", async (req, res) => {
  try {
    const { title, content, userId, color } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(409).send("User not found");
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
        color,
      },
    });

    res.status(201).send(note);
  } catch (error) {
    res.status(501).send("Server Error");
  }
});

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
