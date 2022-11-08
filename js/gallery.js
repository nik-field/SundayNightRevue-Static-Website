const getGalleryFS = (async () => {
  const response = await fetch("/js/galleryFS.json");
  const data = await response.json();
  return data;
})();
getGalleryFS.then((data) => {
  data.children
    .slice()
    .reverse()
    .forEach((folder) => {
      if (folder.type === "directory") {
        const galleryContainer = document.getElementById("gallery-container");
        const galleryFolder = document.createElement("div");
        galleryFolder.classList.add("folder");
        galleryContainer.appendChild(galleryFolder);

        galleryContainer.insertBefore(
          document
            .createRange()
            .createContextualFragment(
              `<h4 class='folder-name'>${folder.name.substring(folder.name.indexOf("_") + 1, folder.name.length)}<button onClick='enlargeFolder(event)'>Large Thumbnails</button></h4>`
            ),
          galleryFolder
        );

        const folderImages = folder.children;
        folderImages.forEach((image) => {
          if (image.type === "file") {
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");
            imageContainer.innerHTML = `<a href="${image.path}" target="_blank"><div class='image-wrapper'><img loading="lazy" width='100%' height='auto' src='${image.path}' /></div></a>`;
            galleryFolder.appendChild(imageContainer);
          }
        });
      }
    });
});

function enlargeFolder(e) {
  e.target.textContent = e.target.textContent == "Large Thumbnails" ? "Small Thumbnails" : "Large Thumbnails";
  e.target.parentNode.nextElementSibling.classList.toggle("enlarge-folder");
}
