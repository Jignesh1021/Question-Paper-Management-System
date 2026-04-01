"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const passport_1 = __importDefault(require("./config/passport"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const subjectRoutes_1 = __importDefault(require("./routes/subjectRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const paperRoutes_1 = __importDefault(require("./routes/paperRoutes"));
dotenv_1.default.config();
// Connect to database
(0, db_1.connectDB)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/subjects', subjectRoutes_1.default);
app.use('/api/questions', questionRoutes_1.default);
app.use('/api/papers', paperRoutes_1.default);
// Basic Route
app.get('/', (req, res) => {
    res.send('QPMS API is running...');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
