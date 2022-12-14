import { PACKAGE_MANAGER_INSTALL_COMMAND_MAP } from "./const.js";
import { execa } from "execa";
import fs from "fs-extra";
import { logger, resolvePath } from "../../utils/utils.js";

export async function installPackage(pkgManager: keyof typeof PACKAGE_MANAGER_INSTALL_COMMAND_MAP) {
  const installCmd = PACKAGE_MANAGER_INSTALL_COMMAND_MAP[pkgManager].split(" ");
  if (pkgManager === "pnpm" && fs.existsSync(resolvePath("pnpm-workspace.yaml"))) {
    installCmd.push("--workspace-root");
  }
  const p = execa(installCmd[0], installCmd.slice(1), {
    stdio: "inherit",
  });
  p.on("close", function (code) {
    if (code === 0) {
      logger.success("Install prettier successfully.");
    }
  });
  process.once("SIGINT", function () {
    p.kill();
  });
}
