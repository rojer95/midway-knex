import { join } from "path";
import { existsSync, unlinkSync } from "fs";
import { close, createLightApp } from "@midwayjs/mock";
import { IMidwayApplication } from "@midwayjs/core";

describe("/test/index.test.ts", () => {
  it("should test base entity", async () => {
    cleanFile(join(__dirname, "fixtures/base-fn-origin", "test.sqlite"));

    const app: IMidwayApplication = await createLightApp(
      join(__dirname, "fixtures/base-fn-origin"),
      {}
    );
    const result = app.getAttr<string>("result");
    expect(result.includes('"foo":"bar"')).toBeTruthy();
    await close(app);
  });
});

function cleanFile(file) {
  if (existsSync(file)) {
    unlinkSync(file);
  }
}
