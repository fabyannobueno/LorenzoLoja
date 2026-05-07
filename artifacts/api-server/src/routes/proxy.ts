import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.use(
  "/public-api",
  createProxyMiddleware({
    target: "https://api.mclorenzo.com",
    changeOrigin: true,
    pathRewrite: { "^/api/public-api": "" },
  })
);

export default router;
