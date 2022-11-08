const directoryTree = require("directory-tree");
const fs = require("fs");

var tree = directoryTree("./images/gallery", { attributes: ["type"], extensions: /\.(jpeg|jpg|png|JPEG|JPG|PNG)$/ });

fs.writeFile("./js/galleryFS.json", JSON.stringify(tree), function (err) {
  if (err) throw err;
  console.log("Saved!");
});
