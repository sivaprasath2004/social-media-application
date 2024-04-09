import Cookies from "universal-cookie";

const Navigate = () => {
  const cookies = new Cookies();
  let users = cookies.get("user_login_advantages");
  let names = cookies.get("user_name_advantages");
  let Desc = cookies.get("user_Description");
  if (users && names && Desc) {
    let ret = { red: "redirect", user: users, name: names, Des: Desc };
    return ret;
  } else {
    let ret = { red: "no-redirect", user: users, name: names, Des: Desc };
    return ret;
  }
};

export default Navigate;
