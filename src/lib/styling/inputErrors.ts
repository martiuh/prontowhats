const errorClasses = ['border-2', 'border-red-500', 'text-red-500'];

const addErrorClasses = (el: HTMLElement) => el.classList.add(...errorClasses);

const removeErrorClasses = (el: HTMLElement) => {
  if (el.classList.contains(errorClasses[1])) {
    el.classList.remove(...errorClasses);
  }
};

export const inputErrors = {
  add: addErrorClasses,
  remove: removeErrorClasses,
};
