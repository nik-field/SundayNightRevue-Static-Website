const directoryTree = require("directory-tree");
const thumb = require("node-thumbnail").thumb;
const fs = require("fs");

var tree = directoryTree("./images/gallery", { attributes: ["type"], extensions: /\.(jpeg|jpg|png|JPEG|JPG|PNG)$/ });

tree.children.forEach((folder) => {
  const dir = folder.path + "/thumbnails";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  folder.children
    .filter((child) => child.type === "file")
    .forEach((file) => {
      thumb(
        {
          source: file.path,
          destination: folder.path + "/thumbnails",
          width: 425,
          skip: true,
        },
        function (files, err, stdout, stderr) {
          console.log("Done!");
        }
      );
    });
  console.log("All done generating thumbnails!");
});

fs.writeFile("./js/galleryFS.json", JSON.stringify(tree), function (err) {
  if (err) throw err;
  console.log("Gallery file system saved!");
});
