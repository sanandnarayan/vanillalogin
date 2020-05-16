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
export let myCreateElement = obj => {
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

export const setRoot = container => {
  let root = document.getElementById("app");
  root.innerHTML = "";
  root.appendChild(container);
};

export const makePostRequest = (url, data) => {
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
