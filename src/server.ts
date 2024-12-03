import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(5000, () => {
  console.log(`Server is running on port ${PORT}`);
});
