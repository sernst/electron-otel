# Distributed OpenTelemetry Tracing with Electron IPC

This is a minimal Electron application based on the
[Quick Start Guide](https://electronjs.org/docs/latest/tutorial/quick-start)
within the Electron documentation.

The OpenTelemetry web implementation is based on the 
[OTel Web Examples](https://github.com/open-telemetry/opentelemetry-js/tree/main/examples/opentelemetry-web/examples)
within the OpenTelemetry JS repository.

## Running the Example

To see it in action, you'll need to run the following commands:

```shell
# Install dependencies
npm install
# Run the app
npm start
```

This will launch the application and immediately open dev tools to easily inspect the
web console output. Vite is running in watch mode here, so any changes to the web
portion of the application will trigger a fresh build. However, there's no hot
reloading capability, and CMD/CTRL+R refresh will be required to see the changes. Also,
not this only applies to the web portion of the application. Changes to the main
Electron application code will require a restart of the application.
