#!/usr/bin/env bun
import { printUsage, runCommand } from "./registry.js";

const args = process.argv.slice(2);
const command = args[0];

async function main(): Promise<void> {
  if (!command || command === "--help") {
    printUsage();
    return;
  }

  await runCommand(command, args.slice(1));
}

main().catch((err) => {
  console.error(`오류: ${err.message}`);
  process.exit(1);
});
