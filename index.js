import { ConsoleSpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";

const provider = new WebTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register({ contextManager: new ZoneContextManager() });

const tracer = provider.getTracer("example-tracer-web");

const runFoo = async (span) => {
  const foo = await window.electron.foo();
  span.end();
  return foo;
}


const runBar = async (span) => {
  const bar = await window.electron.bar();
  span.end();
  return bar;
}

const onLoad = async () => {
  console.log(import.meta.env.MODE);

  return tracer.startActiveSpan("1. onLoad", async (span) => {
    const fooResult = await tracer.startActiveSpan("2. runFoo", runFoo);
    const barResult = await tracer.startActiveSpan("3. runBar", runBar);
    span.end();
    console.log("COMPLETE", { fooResult, barResult});
  });
};

window.addEventListener("load", onLoad);
