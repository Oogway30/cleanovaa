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
  image.src = "./master3.jpg";
}
// ---- STRUCTUR ----
/* <div class="login-form">
      <form action="../homepage.html">
        <div class="email">
          <label for="email">Email</label>
          <input id="email" type="email" required />
        </div>
        <div class="password">
          <label for="password">Password</label>
          <input id="password" type="password" required />
        </div>
        <div class="submit">
          <input class="submit-button" type="submit" value="Login" />
          <a href="./register.html" class="register-button-div">
            Aren't a member yet?
          </a>
        </div>
      </form>
    </div> */
// let sign = document.querySelector(".sign");
// sign.addEventListener("click", () => {
//   let login_form = document.createElement('div') 
//   document.body.append(login_form)
// });
