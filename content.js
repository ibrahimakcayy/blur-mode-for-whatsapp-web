// ==============================
// Focus Mode - Context Menu Injection
// ==============================

let rightClickedElement = null;

//right click catch the element
document.addEventListener("contextmenu", (e) => {
  rightClickedElement = e.target;
  container = e.target.closest('[data-testid="msg-container"], [data-testid="quoted-message"], [role="gridcell"], [data-testid="cell-frame-title"], [data-testid="conversation-info-header"], [data-testid="contact-info-subtitle selectable-text"], [data-testid="chat-info-drawer"] [dir="auto"], [data-testid="media-canvas-img"], img');
  if (container){
    container.setAttribute("data-focus-mode-right-clicked", "true")
  }

}, true);

//if menu is opened, inject the new item
const observer = new MutationObserver(() => {
  const menu = document.querySelector('[data-menu-content="true"]');
  if (!menu) return;

  if (menu.dataset.focusModeInjected === "true") return;

  const items = menu.querySelectorAll('button[role="menuitem"]');
  if (!items.length) return;

  //items.length - 1
  const existingItem = items[0];

  menu.dataset.focusModeInjected = "true";

  const clonedItem = existingItem.cloneNode(true);
  clonedItem.setAttribute("aria-label", "Blur this element");

  clonedItem.setAttribute("tabindex", "-1");
  clonedItem.querySelector('span').removeAttribute("aria-checked");
  clonedItem.querySelectorAll('span')[0].textContent = "";
  clonedItem.querySelectorAll('span')[1].textContent = "Blur this section";

  clonedItem.addEventListener("click", () => {
    if (container) {
      //alert(`Blur this element: ${container.tagName}`);
      if (container.getAttribute("data-focus-mode-right-clicked") === "true") {
        //alert(`${container.style.getPropertyValue("filter")}`);
        container.style.filter = "blur(8px)";
        container.setAttribute("data-focus-mode-right-clicked", "false");
      
      } else {
        //alert(`${container.style.getPropertyValue("filter")}`);
        container.style.filter = "none";
        container.setAttribute("data-focus-mode-right-clicked", "true");
      }
  }
  });

  existingItem.parentElement.insertAdjacentElement('afterend', clonedItem);
});

observer.observe(document.body, { childList: true, subtree: true });
