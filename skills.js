#!/usr/bin/env node
import { main } from './lib/skills.mjs';

main().catch(error => {
  console.error(`Skills installation failed: ${error.message}`);
  process.exitCode = 1;
});
