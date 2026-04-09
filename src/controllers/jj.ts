import bcrypt from "bcrypt";

(async () => {
  const hash = await bcrypt.hash("Guard@123", 10);
  console.log(hash);
})();



// const plain = "Guard@123";
// const hash = "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36a3U6zszbmWzxubUANe0yK";

// (async () => {
//   const match = await bcrypt.compare(plain, hash);
//   console.log(match);
// })();