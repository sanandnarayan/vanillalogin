import "./styles.css";
import router from "./router";
import getTemplates from "./templates";
import { makePostRequest, myCreateElement, setRoot } from "./utils";
/**
 * event handling
 */
class Store {
  constructor() {
    this.user = null;
  }
  setUser(u) {
    this.user = u;
  }
  getUser() {
    return this.user;
  }
}
const store = new Store();
let loginState = { email: "", password: "" };

let setLoginDetails = e => {
  e.preventDefault();
  const target = e.target;
  const value = target.value;
  const name = target.name;
  loginState = Object.assign(loginState, { [name]: value });
};

let login = async e => {
  e.preventDefault();
  try {
    let response = await makePostRequest(
      "http://doorsmash.herokuapp.com/api/session",
      loginState
    );
    store.setUser(response.user);
  } catch (error) {
    console.log("error", error);
  }

  window.location.hash = "#/profile";
};
const event_handlers = {
  handleInputChange: setLoginDetails,
  handleSubmit: login
};

/**
 * Templates, Access Permission, and Redirect to login
 */
const templates = getTemplates(myCreateElement, store, event_handlers);
let routes = {
  "/": templates["welcome"],
  "/login": templates["login"],
  "/profile": templates["profile"]
};
const isAllowed = url => {
  if (url === "/profile" && store.getUser() == null) return false;
  return true;
};
export const redirectToLogin = () => (window.location.hash = "#/login");
const router_handler = router(routes, isAllowed, setRoot, redirectToLogin);

window.addEventListener("load", router_handler);
window.addEventListener("hashchange", router_handler);

/**
 * initialising the app
 */
router_handler();
