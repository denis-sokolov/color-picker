import makeState from "./state";

function $(selector: string, f: (el: HTMLElement) => void) {
  document.querySelectorAll<HTMLElement>(selector).forEach(f);
}

const state = makeState();

function render() {
  const accessors: { [key: string]: (el: HTMLElement, val: string) => void } = {
    bg: (el, val) => (el.style.backgroundColor = val),
    text: (el, val) => (el.innerText = val),
    value: (el, val) => ((el as HTMLInputElement).value = val)
  };
  Object.keys(accessors).forEach(function(key) {
    const attr = `data-${key}`;
    $(`[${attr}]`, function(el) {
      const accessorName: keyof typeof state =
        el.getAttribute(attr) || ("" as any);
      if (!(accessorName in state))
        throw new Error(`Invalid accessor ${accessorName}`);
      accessors[key](el, (state as any)[accessorName]());
    });
  });
}

render();
state.onChange(render);

$("[data-change]", function(el) {
  const attrValue = el.getAttribute("data-change") || "";
  const setterName =
    "set" + (attrValue.substr(0, 1).toUpperCase() + attrValue.substr(1));
  el.addEventListener(
    el instanceof HTMLInputElement ? "input" : "click",
    function() {
      const setter = (state as any)[setterName];
      let value: string | number = (el as HTMLInputElement).value;
      const numberSetters = ["setHue", "setSaturation", "setLightness"];
      if (numberSetters.includes(setterName)) value = Number(value);
      setter(value);
    }
  );
});

$("[data-copiable]", function(el) {
  const duration = 50;
  el.style.cursor = "pointer";
  el.style.transition = `${el.style.transition} opacity ${duration}ms`;

  el.addEventListener("click", function() {
    (navigator as any).clipboard.writeText(el.innerText).then(function() {
      el.style.opacity = "0";
      setTimeout(() => (el.style.opacity = "1"), duration);
    });
  });
});

$('.input [type="text"]', function(el) {
  el.addEventListener("focus", function() {
    (el as HTMLInputElement).select();
  });
});

$(".big-hsl input", function(el) {
  el.addEventListener("focus", function() {
    $(".big-hsl", el => el.classList.add("active"));
  });
  el.addEventListener("blur", function() {
    $(".big-hsl", el => el.classList.remove("active"));
  });
});
