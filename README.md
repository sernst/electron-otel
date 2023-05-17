# Electron IPC Trace Context Issue

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

## The Issue

The issue is that the trace context is not being preserved across an Electron IPC call.
In this example application an `onLoad` span is created when the index.html page loads.
Console output for the span looks like:

```json
{
    "traceId": "f78a9bdbdb090c69f30ca6f99860202e",
    "name": "1. onLoad",
    "id": "da41bcc241419700",
    "kind": 0,
    "timestamp": 1684330163630000,
    "duration": 4000,
    "attributes": {},
    "status": {
        "code": 0
    },
    "events": [],
    "links": []
}
```

Within the `onLoad` span, two async IPC calls are made to the Electron backend. The
first IPC call, `foo`, shares the trace ID with its
`onLoad` parent span like this:

```json
{
    "traceId": "f78a9bdbdb090c69f30ca6f99860202e",
    "parentId": "da41bcc241419700",
    "name": "2. runFoo",
    "id": "a1422c247b61b860",
    "kind": 0,
    "timestamp": 1684330163631000,
    "duration": 1700,
    "attributes": {},
    "status": {
        "code": 0
    },
    "events": [],
    "links": []
}
```

However, the second IPC call, `bar`, does not preserve the trace ID. Nor is the parent
ID the parent span that called it.

```json
{
    "traceId": "d5d0465e78aa50eb933a4e4756efdbc5",
    "name": "3. runBar",
    "id": "6de85efb1b8770eb",
    "kind": 0,
    "timestamp": 1684330163634000,
    "duration": 400,
    "attributes": {},
    "status": {
        "code": 0
    },
    "events": [],
    "links": []
}
```
