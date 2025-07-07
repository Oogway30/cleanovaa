const svg = document.querySelector(".svg");
const sliderNavbar = document.getElementById("sliderNavbar");

svg.addEventListener("click", () => {
  sliderNavbar.classList.toggle("active");
});

if (screen.width <= 500) {
  document.querySelectorAll(".nav-ul li:not(:last-child)").forEach((el) => {
    el.style.display = "none";
  });
} else {
  document.querySelector(".svg").classList.add("no-svg");
}
if (screen.width <= 500) {
  let image = document.querySelector("img");
    image.src = "./master3.jpg";
}
