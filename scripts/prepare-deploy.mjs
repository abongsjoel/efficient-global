import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

const distDirectory = "dist";
const deployDirectory = "deploy";
const logisticsDirectory = `${deployDirectory}/logistics`;

if (!existsSync(distDirectory)) {
  throw new Error('The dist folder does not exist. Run "npm run build" first.');
}

// Remove the previous prepared deployment.
rmSync(deployDirectory, {
  recursive: true,
  force: true,
});

// Create /deploy/logistics.
mkdirSync(logisticsDirectory, {
  recursive: true,
});

// Copy the Vite build into /logistics.
cpSync(distDirectory, logisticsDirectory, {
  recursive: true,
});

// GitHub Pages uses the root-level 404 page for direct SPA routes.
cpSync(`${distDirectory}/404.html`, `${deployDirectory}/404.html`);

// Leave the root domain visually empty.
writeFileSync(
  `${deployDirectory}/index.html`,
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Efficient Global</title>
  </head>
  <body></body>
</html>
`,
);

// Preserve the GitHub Pages custom domain.
writeFileSync(`${deployDirectory}/CNAME`, "www.efficientgloba.com\n");

console.log("Deployment folder prepared successfully.");
