// Desc: Generate a random token
function generateToken(): string {
  const length = 6;
  const characters = "0123456789";
  const charactersLength = characters.length;
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return token;
}

export default generateToken;
