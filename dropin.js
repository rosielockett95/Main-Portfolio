const mediaQuery = window.matchMedia("(max-width: 942px)");
const hamburgerImage = document.querySelector(".hamburger-image");
const hamburgerNav = document.querySelector(".hamburger-menu");

function removeHidden(e) {
  if (e.matches) {
    hamburgerImage.classList.remove("hidden");
  } else {
    hamburgerImage.classList.add("hidden");
    hamburgerNav.classList.remove("open");
    hamburgerNav.classList.add("hidden-nav");
  }
}

mediaQuery.addEventListener("change", removeHidden);

removeHidden(mediaQuery);

hamburgerImage.addEventListener("click", () => {
  hamburgerNav.classList.toggle("open");
  hamburgerNav.classList.toggle("hidden-nav");
});
