"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paperController_1 = require("../controllers/paperController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .get(authMiddleware_1.protect, paperController_1.getPapers);
router.route('/generate')
    .post(authMiddleware_1.protect, authMiddleware_1.teacherOnly, paperController_1.generatePaper);
router.route('/:id')
    .get(authMiddleware_1.protect, paperController_1.getPaperById);
exports.default = router;
