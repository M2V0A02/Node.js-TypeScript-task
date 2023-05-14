import getBICS from "./modules/bic.js";

getBICS("https://www.cbr.ru/s/newbik").then((BICS) => console.log(BICS))
