/* eslint-disable consistent-return */

const manageFocus = (element, displayState, prevElement, timeOut = 0) => {
  if (!element) return;
  const focusManagement = () => {
    // find focusable elements inside of the element passed in
    // use this list to find the first and last focusable element, which
    // will be used to limit tab focusing
    // filter out elements with display: none
    const focusableElements = [...element.querySelectorAll(
      `button:not([disabled]), a:not([disabled]), input:not([disabled]),
    select:not([disabled]), textarea:not([disabled]), [aria-label="PayPal Checkout"], [tabindex="0"]`
    )].filter((el) => global.window.getComputedStyle(el).getPropertyValue('display') !== 'none');

    const firstFocusableElem = focusableElements[0];
    const lastFocusableElem = focusableElements[focusableElements.length - 1];

    // find first not disabled input for focus
    const firstTextInput = element.querySelector('input[type="email"]:not([disabled]), input[type="text"]:not([disabled])');

    // grab outside elements to give them attributes to hide them from screen readers
    // currently this only handles top level elements: search, cart, subscribe modal
    // solution needed for petite dropdown, quick shop and size guide
    const elSiblings = Object.values(element?.parentNode?.children ?? []);
    const skipToContent = global?.document?.querySelector('.skiptocontent');
    const siblings = element?.parentNode?.id === 'main'
      ? [...elSiblings, skipToContent].filter((child) => child !== element) : null;

    const tabKeyCode = 9;

    const tabFocusListener = (e) => {
    // if active element is the first or last focusable element
    // tab or shit + tab keeps focus inside component
      if (e.key === 'Tab' || e.keyCode === tabKeyCode) {
        if (e.shiftKey) {
          if (global.document.activeElement === firstFocusableElem) {
            lastFocusableElem.focus();
            e.preventDefault();
          }
        } else if (global.document.activeElement === lastFocusableElem) {
          firstFocusableElem.focus();
          e.preventDefault();
        }
      }
    };

    if (displayState) {
      if (firstTextInput) firstTextInput.focus();
      else firstFocusableElem.focus();

      element.addEventListener('keydown', tabFocusListener);

      // set aria-hidden for each sibling
      // to hide from screen reader
      if (siblings) {
        siblings.forEach(((sibling) => {
          if (sibling && typeof sibling.setAttribute === 'function') {
            sibling.setAttribute('aria-hidden', true);
          }
        }));
      }
    }

    // if the displayState of the component is false and there is a previous element,
    // remove aria-hidden from siblings and focus the previous element
    if (!displayState && prevElement) {
      if (siblings) {
        siblings.forEach(((sibling) => {
          if (sibling && typeof sibling.removeAttribute === 'function') {
            sibling.removeAttribute('aria-hidden');
          }
        }));
      }

      prevElement.focus();
    }

    return () => element.removeEventListener('keydown', tabFocusListener);
  };

  // some components need visibility transitions to happen
  // before elements inside of them can be focused
  if (timeOut) setTimeout(focusManagement, timeOut);
  else focusManagement();
};

export default manageFocus;
