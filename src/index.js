import "./styles.css";
// Serialize data to be urlencoded
//helper function
let store = null;

let serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

// takes an obj of patterns
// return a html element of type
let myCreateElement = obj => {
  //special case for text node
  if (obj.type === "string") {
    let text = document.createTextNode(obj.name);
    return text;
  }
  // creating element
  let element = document.createElement(obj.name);

  // adding children recursively
  if (obj.children != null) {
    for (let index = 0; index < obj.children.length; index++) {
      let child = myCreateElement({
        name: obj.children[index].name,
        type: obj.children[index].type,
        props: obj.children[index].props,
        children: obj.children[index].children
      });
      element.appendChild(child);
    }
  }
  // adding props
  for (var index in obj.props) {
    element[index] = obj.props[index];
  }
  return element;
};

const setRoot = container => {
  let root = document.getElementById("app");
  root.innerHTML = "";
  root.appendChild(container);
};

const redirectToLogin = () => (window.location.hash = "#/login");

// ====================== TEMPLATES =============================/
// key value pairs of pagename and function which will return the element to be
// rendered
let templates = {};
let welcomeTemplate = () => {
  let container = myCreateElement({ name: "div", type: null });

  const h1 = myCreateElement({ name: "h1", type: null });
  h1.textContent = `Welcome to Door Smash!`;
  container.appendChild(h1);

  const link1 = myCreateElement({
    name: "a",
    type: null,
    props: { title: "login", href: "#/login" },
    children: [{ name: "Login", type: "string" }]
  });
  container.appendChild(link1);
  return container;
};
templates["welcome"] = welcomeTemplate;

let profileTemplate = () => {
  let container = myCreateElement({ name: "div", type: null });
  const h1 = myCreateElement({
    name: "h1",
    type: null,
    props: { textContent: `Welcome ${store.user.name}!` }
  });
  container.appendChild(h1);
  return container;
};
templates["profile"] = profileTemplate;

let loginTemplate = () => {
  let form = myCreateElement({ name: "form" });
  const text = myCreateElement({
    name: "h4",
    props: { textContent: `Login form` }
  });
  form.appendChild(text);

  const text1 = myCreateElement({
    name: "h4",
    props: { textContent: `Email` }
  });
  form.appendChild(text1);
  let element1 = myCreateElement({
    name: "input",
    props: {
      name: "email",
      type: "text"
    }
  });
  element1.addEventListener("change", e => handleInputChange(e));
  form.appendChild(element1);

  const text2 = myCreateElement({
    name: "h4",
    props: { textContent: `Password` }
  });
  form.appendChild(text2);
  let element2 = myCreateElement({
    name: "input",
    props: {
      name: "password",
      type: "password"
    }
  });
  element2.addEventListener("change", e => handleInputChange(e));
  form.appendChild(element2);

  let element3 = myCreateElement({
    name: "input",
    props: {
      name: "submitbutton",
      type: "submit"
    }
  });
  element3.addEventListener("click", e => handleSubmit(e));
  form.appendChild(element3);
  return form;
};
templates["login"] = loginTemplate;
// ====================== END TEMPLATES =============================/

let loginState = { email: "", password: "" };
let makePostRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
      // Call a function when the state changes.
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        //Request finished. Do processing here
        data = JSON.parse(this.responseText);
        resolve(data);
      }
    };
    xhr.send(serialize(data));
  });
};
let handleInputChange = e => {
  e.preventDefault();
  const target = e.target;
  const value = target.value;
  const name = target.name;
  loginState = Object.assign(loginState, { [name]: value });
};

let handleSubmit = async e => {
  e.preventDefault();
  try {
    store = await makePostRequest(
      "http://doorsmash.herokuapp.com/api/session",
      loginState
    );
  } catch (error) {
    console.log("error", error);
  }

  window.location.hash = "#/profile";
};
// ====================== ROUTER =============================/

let routes = {};
let route = (path, template) => {
  routes[path] = templates[template];
};

route("/", "welcome");
route("/login", "login");
route("/profile", "profile");

const isAllowed = url => {
  if (url === "/profile" && store == null) return false;
  return true;
};

// get the current URL and
// checks permissions if user is allowed to that URL
// see if template exists for that URL
// appends the template to app
let router = () => {
  const url = window.location.hash.slice(1) || "/";
  const template = routes[url];

  if (!template) return (window.location.hash = "#/404");
  if (isAllowed(url)) return setRoot(template());

  //TODO respondAppropriately
  redirectToLogin();
};

// For first load or when routes are changed in browser url box.
window.addEventListener("load", router);
window.addEventListener("hashchange", router);

// ====================== END ROUTER =============================/
router();
