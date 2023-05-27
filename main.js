require("zone.js");
require("zone.js/plugins/zone-patch-electron");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {
  SimpleSpanProcessor,
  ConsoleSpanExporter
} = require("@opentelemetry/sdk-trace-base");
const { trace, propagation, context} = require("@opentelemetry/api");

const spanProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter());
const sdk = new NodeSDK({ spanProcessor });
const tracer = trace.getTracer("example-tracer-node");

const loadContext = (carrier) => propagation.extract(context.active(), carrier);

function registerIpcHandlers() {
  ipcMain.handle(
    "foo",
    (event, carrier) => tracer.startActiveSpan(
      "main:foo",
      {},
      loadContext(carrier),
      (span) => {
        span.end();
        return "Hello foo!";
      },
    )
  );

  ipcMain.handle(
    "bar",
    (event, carrier) => tracer.startActiveSpan(
      "main:bar",
      {},
    loadContext(carrier),
      (span) => {
        span.end();
        return "Hello bar!";
      },
    )
  );
}

function createWindow () {
  sdk.start();
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const indexPath = path.join(__dirname, "dist", "index.html");
  mainWindow.loadFile(indexPath);
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
  sdk.shutdown();
});
