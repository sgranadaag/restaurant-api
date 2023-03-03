exports.getToken = (req, res) =>{
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (!token) return undefined;
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    return token;
}