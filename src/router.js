// get the current URL and
// checks permissions if user is allowed to that URL
// see if template exists for that URL
// appends the template to app

const router = (routes, isAllowed, setRoot, redirectToLogin) => {
  return () => {
    const url = window.location.hash.slice(1) || "/";
    const template = routes[url];

    if (!template) return (window.location.hash = "#/404");
    if (isAllowed(url)) return setRoot(template());

    //TODO respondAppropriately
    redirectToLogin();
  };
};

export default router;
