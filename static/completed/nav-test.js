if (screen.width <= 700) {

  let contact = document.querySelector(".contact0");
  let home = document.querySelector(".Home");
  let sign = document.querySelector(".sign-a");
  let service = document.querySelector(".service");
  let about = document.querySelector(".about");
  about.setAttribute("hidden", "");
  contact.setAttribute("hidden", "");
  home.setAttribute("hidden", "");
  service.setAttribute("hidden", "");
  sign.setAttribute("hidden", "");
}
if (screen.width >= 700) {
  let svg = document.querySelector(".svg");
  svg.setAttribute("class", "no-svg");
}
// if (screen.width <= 600) {
//   let service = document.querySelector(".service");
//   service.setAttribute("hidden", "");
//   let svg = document.querySelector(".svg");
//   svg.setAttribute("hidden", "");
// }
// if (screen.width <= 500) {
  
// }
let svg = document.querySelector(".svg");
svg.addEventListener("click", () => {
  let navbar_slider = document.querySelector(".slider-navbar");
  let navbar_ul = document.querySelector(".slider-ul");

  if (navbar_slider.hasAttribute("id", "navy")) {
    navbar_ul.removeAttribute("id", "navy-ul");
    navbar_slider.removeAttribute("id", "navy");
  } else {
    navbar_slider.setAttribute("id", "navy");
    navbar_ul.setAttribute("id", "navy-ul");
  }
});
