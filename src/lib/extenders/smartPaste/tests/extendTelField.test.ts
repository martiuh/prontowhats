import { getByTestId, fireEvent, createEvent } from "@testing-library/dom";
import { extendTelField } from "../extendTelField";
import { createPasteEvent } from "./utils";

const renderInput = () => {
  const div = document.createElement("div");
  const nodeInput = document.createElement("input");
  nodeInput.dataset["testid"] = "tel-input";

  div.appendChild(nodeInput);
  const input = getByTestId(div, "tel-input") as HTMLInputElement;
  extendTelField(input);

  return input;
};

function firePasteEvent(input: HTMLInputElement, text: string) {
  const eventProps = createPasteEvent(text);
  const pasteEvent = createEvent.paste(input, eventProps);
  fireEvent(input, pasteEvent);
}

describe("TelField", () => {
  it("on paste removes all white space", () => {
    const input = renderInput();

    firePasteEvent(input, "33 1510 5420");
    expect(input.value).toMatch("3315105420");
  });

  it("on paste removes dashes", () => {
    const input = renderInput();

    firePasteEvent(input, "33-15-54-20");
    expect(input.value).toMatch("33155420");
  });

  it("on paste sends custom event when international suffix exists", () => {});
});
