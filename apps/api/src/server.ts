import { createApp } from "./create-app.js";
import { ENV } from "./config/env.js";
import { verifyMailer } from "./utils/mailer.js";

const app = createApp();
if (!process.env.VERCEL) void verifyMailer();

// On Vercel the platform invokes the exported app per request; only listen when self-hosted/local.
if (!process.env.VERCEL) {
  const server = app.listen(ENV.PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 GiftHomes API Server running on port ${ENV.PORT}`);
    console.log(`📍 Environment: ${ENV.NODE_ENV}`);
    console.log(`🔗 Base URL: http://localhost:${ENV.PORT}`);
    console.log(`❤️  Health Check: http://localhost:${ENV.PORT}${ENV.API_PREFIX}/health`);
    console.log(`🏡 Properties: http://localhost:${ENV.PORT}${ENV.API_PREFIX}/properties`);
    console.log(`===============================================`);
  });

  // Graceful shutdown handling
  function handleShutdown(signal: string) {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("HTTP server closed. Exiting process.");
      process.exit(0);
    });

    // Force close after 5 seconds
    setTimeout(() => {
      console.error("Forcing shutdown after timeout.");
      process.exit(1);
    }, 5000);
  }

  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
}

export default app;
