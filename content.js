// ==============================
// Blur Mode - Context Menu Injection
// ==============================

let rightClickedElement = null;

document.addEventListener("contextmenu", (e) => {
  rightClickedElement = e.target;
  container = e.target.closest('[data-testid="msg-container"], [data-testid="quoted-message"], [data-testid="cell-frame-title"], [data-testid="cell-frame-primary-detail"], [data-testid="cell-frame-secondary"], [data-testid="conversation-info-header"], [data-testid="contact-info-subtitle selectable-text"], [data-testid="chat-info-drawer"] [dir="auto"], [data-testid="media-canvas-img"], img');
  if (container && container.getAttribute("data-blur-mode-activeted") === null) {
    container.setAttribute("data-blur-mode-activeted", "false");
  }
}, true);

const observer = new MutationObserver(() => {
  const menu = document.querySelector('[data-menu-content="true"]');
  if (!menu) return;
  if (menu.dataset.focusModeInjected === "true") return;

  const items = menu.querySelectorAll('button[role="menuitem"]');
  if (!items.length) return;

  const existingItem = items[0];
  menu.dataset.focusModeInjected = "true";

  //blur this section button
  const clonedItem = existingItem.cloneNode(true);
  clonedItem.setAttribute("aria-label", "Blur this element");
  clonedItem.setAttribute("tabindex", "-1");
  clonedItem.querySelector('span').removeAttribute("aria-checked");
  clonedItem.querySelectorAll('span')[0].textContent = "";

  // sadece kendi attribute'una bak, global computed style'a bakma
  const isSectionActive = container && container.getAttribute("data-blur-mode-activeted") === "true";
  clonedItem.querySelectorAll('span')[1].textContent = isSectionActive ? "Unblur this section" : "Blur this section";

  //unblur all sections button
  const clonedItem1 = existingItem.cloneNode(true);
  clonedItem1.setAttribute("aria-label", "Unblur this element");
  clonedItem1.setAttribute("tabindex", "-1");
  clonedItem1.querySelector('span').removeAttribute("aria-checked");
  clonedItem1.querySelectorAll('span')[0].textContent = "";
  clonedItem1.querySelectorAll('span')[1].textContent = "Unblur all sections";

  //lock this section button
  const clonedItem2 = existingItem.cloneNode(true);
  clonedItem2.setAttribute("aria-label", "Lock this element state");
  clonedItem2.setAttribute("tabindex", "-1");
  clonedItem2.querySelector('span').removeAttribute("aria-checked");
  clonedItem2.querySelectorAll('span')[0].textContent = "";

  if (container && container.getAttribute("data-blur-mode-locked") === "true") {
    clonedItem2.querySelectorAll('span')[1].textContent = "Unlock this element state";
  } else {
    clonedItem2.querySelectorAll('span')[1].textContent = "Lock this element state";
  }

  //blur button click — sadece kendi attribute state'ine göre toggle
  clonedItem.addEventListener("click", () => {
    if (!container) return;
    const isActive = container.getAttribute("data-blur-mode-activeted") === "true";

    if (isActive) {
      container.style.setProperty("filter", "none", "important");
      container.setAttribute("data-blur-mode-activeted", "false");
      clonedItem.querySelectorAll('span')[1].textContent = "Blur this section";
    } else {
      container.style.setProperty("filter", "blur(8px)", "important");
      container.setAttribute("data-blur-mode-activeted", "true");
      clonedItem.querySelectorAll('span')[1].textContent = "Unblur this section";
    }
  });

  //unblur all blurred sections (sadece manuel blurlanmışları)
  clonedItem1.addEventListener("click", () => {
    const blurredElements = document.querySelectorAll('[data-blur-mode-activeted="true"]');
    blurredElements.forEach((el) => {
      el.style.setProperty("filter", "none", "important");
      el.setAttribute("data-blur-mode-activeted", "false");
    });
  });

  //lock the state of the section
  clonedItem2.addEventListener("click", () => {
    if (container.getAttribute("data-blur-mode-locked") === "true") {
      container.removeAttribute("data-blur-mode-locked");
      container.style.removeProperty("filter");
      clonedItem2.querySelectorAll('span')[1].textContent = "Lock this element state";
    } else {
      container.setAttribute("data-blur-mode-locked", "true");
      container.style.setProperty("filter", getComputedStyle(container).filter, "important");
      clonedItem2.querySelectorAll('span')[1].textContent = "Unlock this element state";
    }
  });

  existingItem.parentElement.insertAdjacentElement('afterend', clonedItem);
  existingItem.parentElement.insertAdjacentElement('afterend', clonedItem1);
  existingItem.parentElement.insertAdjacentElement('afterend', clonedItem2);
});

observer.observe(document.body, { childList: true, subtree: true });
