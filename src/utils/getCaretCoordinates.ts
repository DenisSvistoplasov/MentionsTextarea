export function getCaretCoordinates(textarea: HTMLTextAreaElement) {
  const div = document.createElement('div');
  const style = window.getComputedStyle(textarea);

  // копируем важные стили
  for (const prop of style) {
    div.style.setProperty(prop, style.getPropertyValue(prop));
  }

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';

  const value = textarea.value;
  const selectionStart = textarea.selectionStart;

  const before = value.substring(0, selectionStart);
  // const after = value.substring(selectionStart);

  div.textContent = before;

  const span = document.createElement('span');
  span.textContent = '';
  div.appendChild(span);

  document.body.prepend(div);

  const divRect = div.getBoundingClientRect();
  const spanRect = span.getBoundingClientRect();

  document.body.removeChild(div);

  return {
    top: spanRect.top - divRect.top,
    left: spanRect.left - divRect.left,
  };
}