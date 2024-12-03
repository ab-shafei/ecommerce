import app from "./app";

const PORT = process.env.NODE_DOCKER_PORT || 5000;

app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
});
