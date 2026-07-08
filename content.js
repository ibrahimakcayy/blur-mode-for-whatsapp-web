// ==============================
// Blur Mode - Context Menu Injection
// ==============================

let rightClickedElement = null;

//right click catch the element
document.addEventListener("contextmenu", (e) => {
  rightClickedElement = e.target;
  container = e.target.closest('[data-testid="msg-container"], [data-testid="quoted-message"], [role="gridcell"], [data-testid="last-msg-status"], [data-testid="cell-frame-title"], [data-testid="conversation-info-header"], [data-testid="contact-info-subtitle selectable-text"], [data-testid="chat-info-drawer"] [dir="auto"], [data-testid="media-canvas-img"], img');
  if (container && container.getAttribute("data-blur-mode-activeted") === null) {
    container.setAttribute("data-blur-mode-activeted", "false");
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
  
  const clonedItem1 = existingItem.cloneNode(true);
  clonedItem1.setAttribute("aria-label", "Unblur this element");

  clonedItem1.setAttribute("tabindex", "-1");
  clonedItem1.querySelector('span').removeAttribute("aria-checked");
  clonedItem1.querySelectorAll('span')[0].textContent = "";
  clonedItem1.querySelectorAll('span')[1].textContent = "Unblur all sections";

  const clonedItem2 = existingItem.cloneNode(true);
  clonedItem2.setAttribute("aria-label", "Lock this element state");

  clonedItem2.setAttribute("tabindex", "-1");
  clonedItem2.querySelector('span').removeAttribute("aria-checked");
  clonedItem2.querySelectorAll('span')[0].textContent = "";
  clonedItem2.querySelectorAll('span')[1].textContent = "Lock this element state";

  clonedItem.addEventListener("click", () => {
    if (container) {
      //alert(`${getComputedStyle(container).filter}`);
      if (container.getAttribute("data-blur-mode-activeted") === "false") {
        //alert(`${container.style.getProperty("filter")}`);
        container.style.setProperty("filter", "blur(8px)", "important");
        container.setAttribute("data-blur-mode-activeted", "true");
      
      } else {
        
        //alert(`${container.style.getPropertyValue("filter")}`);
        container.style.removeProperty("filter");
        container.removeAttribute("data-blur-mode-activeted");
      }
  }
  });

  clonedItem1.addEventListener("click", () => {

    const blurredElements = document.querySelectorAll('[data-blur-mode-activeted="true"]');
    blurredElements.forEach((el) => {
      el.style.removeProperty("filter");
      el.removeAttribute("data-blur-mode-activeted");
    });
  });

  clonedItem2.addEventListener("click", () => {
    alert("badge");
  });

  existingItem.parentElement.insertAdjacentElement('afterend', clonedItem);
  existingItem.parentElement.insertAdjacentElement('afterend', clonedItem1);
  existingItem.parentElement.insertAdjacentElement('afterend', clonedItem2);
});

observer.observe(document.body, { childList: true, subtree: true });
