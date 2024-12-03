import app from "./app";

const PORT = process.env.NODE_DOCKER_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
