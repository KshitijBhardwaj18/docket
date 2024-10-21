"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const user = yield prisma.user.findFirst({
            where: { email },
        });
        if (user) {
            res.status(409).json({ error: "User  already exists" });
        }
        const userCreated = yield prisma.user.create({
            data: {
                email,
                username: username,
                password,
            },
        });
        res.status(201).json({ user: userCreated });
    }
    catch (error) {
        console.log(error);
        res.status(402).send("Server error");
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findFirst({
            where: { email },
        });
        if (!user) {
            console.log("No user");
            res.status(409).json({ error: "User  not found" });
        }
        if ((user === null || user === void 0 ? void 0 : user.password) !== password) {
            res.status(401).json({ error: "Wrong credentials" });
        }
        console.log(user);
        res.send(user);
    }
    catch (error) {
        res.status(402).send("Server error");
    }
}));
app.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        console.log(id);
        const user = yield prisma.user.findFirst({
            where: { id },
            include: {
                notes: true,
            },
        });
        if (!user) {
            res.status(404).send("Not Found");
        }
        res.json(user);
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/notes/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma.user.findFirst({
            where: { id },
            include: {
                notes: true,
            },
        });
        console.log("User found");
        const notes = user === null || user === void 0 ? void 0 : user.notes;
        console.log("Notes found");
        res.status(201).send(notes);
    }
    catch (error) {
        res.status(501).json({ error: error });
    }
}));
app.post("/note/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, userId, color } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            res.status(409).send("User not found");
        }
        const note = yield prisma.note.create({
            data: {
                title,
                content,
                userId,
                color,
            },
        });
        res.status(201).send(note);
    }
    catch (error) {
        res.status(501).send("Server Error");
    }
}));
// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
