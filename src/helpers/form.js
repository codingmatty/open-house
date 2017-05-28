import _ from 'lodash';


function parseValue({ name, type, value, checked }) {
  switch (type) {
    case 'checkbox': return checked;
    case 'radio': return checked ? value : null;
    case 'date':
    case 'datetime':
      return new Date(value);
    case 'number': return parseFloat(value);
    default:
      if (name === 'date') {
        // For compatibility reasons, the type will actually be 'text' :(
        return new Date(value);
      }
      return value;
  }
}

export function serializeForm(event) {
  const form = event.currentTarget || event;
  const elements = form.elements;

  return _(_.range(elements.length))
    .map((v, i) => elements[i])
    .filter((el) => (el.name || el.id))
    .map((el) => [
      el.name || el.id,
      parseValue(el)
    ])
    .filter(([, value]) => !(_.isNull(value) || _.isUndefined(value)))
    .fromPairs()
    .value();
}

export function resetForm(event, defaults = {}) {
  const form = event.currentTarget || event;
  const elements = form.elements;

  _(_.range(elements.length))
    .forEach((v, i) => {
      const el = elements[i];
      const key = el.name || el.id;
      const defaultValue = defaults[key];

      if (el.type === 'checkbox') {
        el.checked = defaultValue || false;
      } else if (el.type === 'radio') {
        el.checked = el.value === defaultValue;
      } else {
        el.value = defaultValue || '';
      }
    });
}

export default {
  serializeForm,
  resetForm
};
