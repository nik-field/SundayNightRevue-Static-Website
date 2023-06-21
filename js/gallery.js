class Gallery {
  constructor(galleryContainer, folderId, apiKey) {
    this.galleryContainer = galleryContainer;
    this.folderId = folderId;
    this.apiKey = apiKey;
  }

  async fetchGallery() {
    try {
      const sortedFolders = await this.getFolders();
      const recentFolders = sortedFolders.slice(0, 2);
      const remainingFolders = sortedFolders.slice(2);

      for (const folder of recentFolders) {
        const folderContainer = this.createFolderContainer(folder.name.split('_')[1]);
        const imagesFolder = folderContainer.querySelector('.folder');
        const folderImages = await this.getFolderImages(folder.id);

        const enlargeButton = this.createEnlargeButton(folderContainer);
        folderContainer.insertBefore(enlargeButton, imagesFolder);

        for (const image of folderImages) {
          const imageContainer = this.createImageContainer(image, true);
          imagesFolder.appendChild(imageContainer);
        }

        this.galleryContainer.appendChild(folderContainer);
      }

      for (const folder of remainingFolders) {
        const folderContainer = this.createFolderContainer(folder.name.split('_')[1]);
        folderContainer.classList.add('unloaded');
        const imagesFolder = folderContainer.querySelector('.folder');
        const loadButton = this.createLoadButton(folderContainer, folder.id);
        folderContainer.insertBefore(loadButton, imagesFolder);

        const enlargeButton = this.createEnlargeButton(folderContainer);
        folderContainer.insertBefore(enlargeButton, imagesFolder);

        this.galleryContainer.appendChild(folderContainer);
      }

    } catch (error) {
      console.log('Error fetching gallery:', error);
    }
  }

  async getFolders() {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${this.folderId}'+in+parents&key=${this.apiKey}`);
    const data = await response.json();

    return data.files
      .filter((folder) => folder.mimeType === 'application/vnd.google-apps.folder')
      .sort((a, b) => b.name.localeCompare(a.name));
  }

  async getFolderImages(folderId) {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${this.apiKey}`);
    const data = await response.json();

    return data.files
      .filter((file) => file.mimeType === 'image/jpeg')
      .map((file) => {
        const fileId = file.id;
        const fullSize = `https://drive.google.com/uc?export=view&id=${fileId}`;
        const largeThumb = `https://drive.google.com/thumbnail?authuser=0&sz=w320&id=${fileId}`;
        const smallThumb = `https://drive.google.com/thumbnail?authuser=0&sz=w150&id=${fileId}`;

        return {
          fullSize,
          largeThumb,
          smallThumb,
          enlargeFolder: false,
        };
      });
  }

  createFolderContainer(folderTitle) {
    const folderContainer = document.createElement('div');
    folderContainer.classList.add('folder-container');
    const imagesFolder = document.createElement('div');
    imagesFolder.classList.add('folder');

    const folderName = document.createElement('h4');
    folderName.classList.add('folder-name');
    folderName.textContent = folderTitle;

    folderContainer.appendChild(folderName);
    folderContainer.append(imagesFolder);

    return folderContainer;
  }

  createImageContainer(image, isSmallThumbVisible) {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const imageLink = document.createElement('a');
    imageLink.href = image.fullSize;
    imageLink.target = '_blank';

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');

    const smallThumbElement = document.createElement('img');
    smallThumbElement.setAttribute('loading', 'lazy');
    smallThumbElement.setAttribute('width', '150');
    smallThumbElement.setAttribute('height', 'auto');
    smallThumbElement.src = image.smallThumb;
    smallThumbElement.style.display = isSmallThumbVisible ? 'block' : 'none';

    const largeThumbElement = document.createElement('img');
    largeThumbElement.setAttribute('loading', 'lazy');
    largeThumbElement.setAttribute('width', '100%');
    largeThumbElement.setAttribute('height', 'auto');
    largeThumbElement.src = image.largeThumb;
    largeThumbElement.style.display = isSmallThumbVisible ? 'none' : 'block';

    imageWrapper.appendChild(smallThumbElement);
    imageWrapper.appendChild(largeThumbElement);
    imageLink.appendChild(imageWrapper);
    imageContainer.appendChild(imageLink);

    return imageContainer;
  }

  createLoadButton(folderContainer, folderId) {
    const loadButton = document.createElement('button');
    const imagesFolder = folderContainer.querySelector('.folder');
    loadButton.classList.add('load-button');
    loadButton.textContent = 'Load Photos';
    loadButton.addEventListener('click', async () => {
      folderContainer.removeChild(loadButton);
      folderContainer.classList.remove('unloaded');

      const folderImages = await this.getFolderImages(folderId);

      for (const image of folderImages) {
        const imageContainer = this.createImageContainer(image, true);
        imagesFolder.appendChild(imageContainer);
      }
    });

    return loadButton;
  }

  createEnlargeButton(folderContainer) {
    const enlargeButton = document.createElement('button');
    enlargeButton.classList.add('enlarge-button');
    enlargeButton.textContent = 'Enlarge';
    enlargeButton.addEventListener('click', (event) => {
      this.toggleImageSize(event, folderContainer);
    });
    return enlargeButton;
  }

  toggleImageSize(event, folderContainer) {
    const imageElements = folderContainer.querySelectorAll('.image-wrapper img');

    const isEnlarged = folderContainer.classList.contains('enlarged');
    folderContainer.classList.toggle('enlarged');

    const smallThumbs = folderContainer.querySelectorAll('.image-wrapper img:first-child');
    const largeThumbs = folderContainer.querySelectorAll('.image-wrapper img:last-child');

    if (isEnlarged) {
      smallThumbs.forEach((thumb) => {
        thumb.style.display = 'block';
      });
      largeThumbs.forEach((thumb) => {
        thumb.style.display = 'none';
      });
      event.target.textContent = 'Enlarge';
    } else {
      smallThumbs.forEach((thumb) => {
        thumb.style.display = 'none';
      });
      largeThumbs.forEach((thumb) => {
        thumb.style.display = 'block';
      });
      event.target.textContent = 'Shrink';
    }
  }
}

const galleryContainer = document.getElementById('gallery-container');
const folderId = '16rwO118dHoKLbGXY1CpFERgN3Ac-jqio';
const apiKey = 'AIzaSyBKDM2c-E0_wt60vuuPRU3rjkdiH91Eu5g';

const gallery = new Gallery(galleryContainer, folderId, apiKey);
gallery.fetchGallery();