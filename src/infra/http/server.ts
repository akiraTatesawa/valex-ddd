import { ExpressApp } from "./app";

async function Bootstrap() {
  const expressApp = new ExpressApp();

  await expressApp.init();
}

Bootstrap().catch(() => {
  process.exit(1);
});
