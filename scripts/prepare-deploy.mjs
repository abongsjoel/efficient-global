import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";

const distDirectory = "dist";
const deployDirectory = "deploy";

if (!existsSync(distDirectory)) {
  throw new Error('The dist folder does not exist. Run "npm run build" first.');
}

// Remove the previous prepared deployment.
rmSync(deployDirectory, {
  recursive: true,
  force: true,
});

// Create the root deploy directory for the site hosted at /.
mkdirSync(deployDirectory, {
  recursive: true,
});

// Copy the Vite build into the root of the deploy directory.
cpSync(distDirectory, deployDirectory, {
  recursive: true,
});

// Preserve the GitHub Pages custom domain.
writeFileSync(`${deployDirectory}/CNAME`, "www.efficientgloba.com\n");

console.log("Deployment folder prepared successfully.");
