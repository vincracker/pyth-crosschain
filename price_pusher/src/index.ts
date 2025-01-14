// #!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import injective from "./injective/command";
import evm from "./evm/command";

yargs(hideBin(process.argv))
  .config("config")
  .global("config")
  .command(evm)
  .command(injective)
  .help().argv;
