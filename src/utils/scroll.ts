// src/utils/scroll.ts
export const NAVBAR_HEIGHT = 80;

export const scrollToElement = (
  elementId: string,
  offset: number = NAVBAR_HEIGHT
) => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  const elementPosition =
    element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: "smooth",
  });

  return true;
};

export const scrollToHash = (hash: string) => {
  const elementId = hash.replace("#", "");

  setTimeout(() => {
    switch (elementId) {
      case "home":
      case "search":
      case "register": // 모두 같은 home 섹션으로!
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      default:
        scrollToElement(elementId, NAVBAR_HEIGHT);
        break;
    }
  }, 100);

  return true;
};
