import { inputErrors } from "../../styling/inputErrors";
import { smartPaste } from "./smartPaste.utils/smartPaste";

const addErrorClasses = inputErrors.add;
const removeErrorClasses = inputErrors.remove;

export function extendTelField(input: HTMLInputElement) {
  input.addEventListener("blur", () => {
    if (!input.checkValidity()) {
      addErrorClasses(input);
    } else {
      removeErrorClasses(input);
    }
  });

  input.addEventListener("focus", () => {
    removeErrorClasses(input);
  });

  input.addEventListener("paste", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const pastedText = event?.clipboardData?.getData("text");

    if (pastedText) {
      const transformText = smartPaste(pastedText);

      if (transformText.dial_code_subsets.length > 0) {
        const countrySelect = document.getElementById(
          "country"
        ) as HTMLSelectElement;

        const selectedOption =
          countrySelect.options[countrySelect.selectedIndex];

        if (selectedOption) {
          const selectedCode = selectedOption.dataset.code as string;
          if (transformText.dial_code_subsets.includes(selectedCode)) {
            transformText.formatted = transformText.formatted.replace(
              selectedCode,
              ""
            );
          } else {
            const guessDialCodesEvent = new CustomEvent("GUESS_DIAL_CODES", {
              detail: transformText.dial_code_subsets,
            });
            document.dispatchEvent(guessDialCodesEvent);
          }
        }
      }

      input.value = transformText.formatted;
    }
  });

  return input;
}
