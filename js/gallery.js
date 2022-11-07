const getGalleryFolders = (async () => {
  const response = await fetch("https://api.github.com/repos/nik-field/SundayNightRevue-Static-Website/contents/images/gallery?ref=v2");
  const data = await response.json();
  return data;
})();
getGalleryFolders.then((data) =>
  data
    .slice()
    .reverse()
    .forEach((folder) => {
      if (folder.type === "dir") {
        const galleryContainer = document.getElementById("gallery-container");
        const galleryFolder = document.createElement("div");
        galleryFolder.classList.add("folder");
        galleryContainer.appendChild(galleryFolder);

        galleryFolder.innerHTML = `<h4 class='folder-name'>${folder.name.substring(folder.name.indexOf("_") + 1, folder.name.length)}`;
      }
    })
);
