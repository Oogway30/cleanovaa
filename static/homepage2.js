document.addEventListener("DOMContentLoaded", () => {
  const svg = document.querySelector(".svg");
  const sliderNavbar = document.getElementById("sliderNavbar");

  if (svg && sliderNavbar) {
    svg.addEventListener("click", (e) => {
      e.stopPropagation();
      sliderNavbar.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!svg.contains(e.target) && !sliderNavbar.contains(e.target)) {
        sliderNavbar.classList.remove("active");
      }
    });
  }

  if (screen.width <= 500) {
    document.querySelectorAll(".nav-ul li:not(:last-child)").forEach((el) => {
      el.style.display = "none";
    });
  } else {
    svg?.classList.add("no-svg");
  }
});
