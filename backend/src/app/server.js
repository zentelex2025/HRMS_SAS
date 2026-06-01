import app from "./app.js";
import { env } from "../config/env.js";

app.get("/", (req, res) => {
  res.send("The server is healthy");
});
app.listen(env.PORT, () => {
  console.log(`Server started on port ${env.PORT}`);
});
