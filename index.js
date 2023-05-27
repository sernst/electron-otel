import "zone.js";

import { ConsoleSpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { context, propagation } from "@opentelemetry/api";

const provider = new WebTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register({ contextManager: new ZoneContextManager() });

const tracer = provider.getTracer("example-tracer-web");

const runFoo = async (span) => {
  const foo = await window.electron.foo(getCarrier());
  span.end();
  return foo;
}

const runBar = async (span) => {
  const bar = await window.electron.bar(getCarrier());
  span.end();
  return bar;
}

const getCarrier = () => {
  const carrier = {};
  propagation.inject(context.active(), carrier);
  return carrier;
}

const onLoad = async () => {
  console.log(import.meta.env.MODE);

  await tracer.startActiveSpan("1. onLoad", async (span) => {
    console.log("STARTING", getCarrier());
    const fooResult = await tracer.startActiveSpan("2. runFoo", runFoo);
    console.log("DONE FOO", getCarrier());
    const barResult = await tracer.startActiveSpan("3. runBar", runBar);
    console.log("DONE BAR", getCarrier());
    span.end();
    console.log("COMPLETE", getCarrier(), { fooResult, barResult});
  });
};

window.addEventListener("load", onLoad);
