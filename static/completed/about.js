if (screen.width <= 700) {
    let contact = document.querySelector(".contact");
    contact.setAttribute("hidden", "");
  }
  if (screen.width <= 600) {
    let service = document.querySelector(".service");
    service.setAttribute("hidden", "");
  }
  if (screen.width <= 500) {
    let about = document.querySelector(".about");
    let image = document.querySelector("img");
    let contact = document.querySelector(".contact");
    let service = document.querySelector(".service");
    about.setAttribute("hidden", "");
    contact.setAttribute("hidden", "");
    service.setAttribute("hidden", "");
  
  }
  