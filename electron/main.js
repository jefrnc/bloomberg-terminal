const { app, BrowserWindow, shell } = require("electron");
const { spawn } = require("node:child_process");
const path = require("node:path");
const net = require("node:net");

let mainWindow;
let serverProcess;

const isDev = process.env.NODE_ENV === "development";
const PORT = 3099;

function findOpenPort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", () => resolve(findOpenPort(startPort + 1)));
  });
}

function waitForServer(port, retries = 30) {
  return new Promise((resolve, reject) => {
    const check = (attempt) => {
      const req = net.createConnection({ port, host: "127.0.0.1" }, () => {
        req.end();
        resolve();
      });
      req.on("error", () => {
        if (attempt >= retries) {
          reject(new Error(`Server not ready after ${retries} attempts`));
        } else {
          setTimeout(() => check(attempt + 1), 1000);
        }
      });
    };
    check(0);
  });
}

async function startServer() {
  if (isDev) return PORT;

  const port = await findOpenPort(PORT);
  const appPath = path.join(process.resourcesPath, "app");

  serverProcess = spawn(
    process.execPath,
    [
      path.join(appPath, "node_modules", "next", "dist", "bin", "next"),
      "start",
      "-p",
      String(port),
    ],
    {
      cwd: appPath,
      env: {
        ...process.env,
        NODE_ENV: "production",
        PORT: String(port),
      },
      stdio: "pipe",
    }
  );

  serverProcess.stdout?.on("data", (data) => {
    console.log(`[next] ${data}`);
  });

  serverProcess.stderr?.on("data", (data) => {
    console.error(`[next] ${data}`);
  });

  await waitForServer(port);
  return port;
}

function createWindow(port) {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: "SmallCaps Terminal",
    backgroundColor: "#121212",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // Bloomberg-style dark frame
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 10, y: 10 },
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", async () => {
  try {
    const port = await startServer();
    createWindow(port);
  } catch (err) {
    console.error("Failed to start:", err);
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  app.quit();
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    startServer().then((port) => createWindow(port));
  }
});
