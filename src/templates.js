// ====================== TEMPLATES =============================/
// key value pairs of pagename and function which will return the element to be
// rendered
let templates = {};
export default (
  myCreateElement,
  store,
  { handleInputChange, handleSubmit }
) => {
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
    const user = store.getUser();
    console.log("inside template", user);
    const h1 = myCreateElement({
      name: "h1",
      type: null,
      props: { textContent: `Welcome ${user.name}!` }
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
  return templates;
};
