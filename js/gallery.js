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
            .createContextualFragment(`<h4 class='folder-name'>${folder.name.substring(folder.name.indexOf("_") + 1, folder.name.length)}<button onClick='enlargeFolder()'>Enlarge</button></h4>`),
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

// const getGalleryFolders = (async () => {
//   const response = await fetch("images/gallery");
//   const data = await response.json();
//   return data;
// })();
// getGalleryFolders.then((data) => {
//   console.log(data);
//   data
//     .slice()
//     .reverse()
//     .forEach((folder) => {
//       if (folder.type === "dir") {
//         const galleryContainer = document.getElementById("gallery-container");
//         const galleryFolder = document.createElement("div");
//         galleryFolder.classList.add("folder", "flex", "flex-wrap");
//         galleryContainer.appendChild(galleryFolder);

//         galleryFolder.innerHTML = `<h4 class='folder-name w-full flex-1'>${folder.name.substring(folder.name.indexOf("_") + 1, folder.name.length)}</h4>`;

//         const getFolderImages = (async () => {
//           const response = await fetch(folder.url);
//           const data = await response.json();
//           return data;
//         })();
//         getFolderImages.then((data) =>
//           data.forEach((image) => {
//             if (image.type === "file") {
//               const imageContainer = document.createElement("div");
//               imageContainer.classList.add("image-container");
//               imageContainer.innerHTML = `<div><img width='100%' height='auto' src='${image.path}' /></div>`;
//               galleryFolder.appendChild(imageContainer);
//             }
//           })
//         );
//       }
//     });
// });
