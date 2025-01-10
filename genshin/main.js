let currentPage = 0;
let itemsPerPage = 0;
let currentFilter = 'character';

document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault();
    currentFilter = this.getAttribute('data-filter');
    currentPage = 0; 
    gridContainer.innerHTML = ''; 
    createGrid(); 
  });
});


function calculateItemsPerPage() {
  const gridContainer = document.getElementById("gridContainer");

  if (gridContainer.children.length === 0) {
    const testDiv = document.createElement("div");
    testDiv.className = "grid-item";
    gridContainer.appendChild(testDiv);
  }

  const gridItem = document.querySelector(".grid-item");
  if (!gridItem) return;

  const containerHeight = gridContainer.clientHeight;
  const itemHeight = gridItem.clientHeight;
  
  if (window.innerWidth <= 768) {
    itemsPerPage = 10;
  } else {
    itemsPerPage = 30;
  }

  gridContainer.innerHTML = '';
}

async function createGrid() {
  const gridContainer = document.getElementById("gridContainer");
  const gridItems = await fetchGridData();

  const itemsToDisplay = gridItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  itemsToDisplay.forEach(gridItem => {
    const div = document.createElement("div");
    div.className = "grid-item";
    div.setAttribute('data-id', gridItem.id);

    let backgroundImage;
    switch (gridItem.parameter) {
      case 'dendro':
        backgroundImage = 'url(assets/card_bg/dendro.jpg)';
        break;
      case 'geo':
        backgroundImage = 'url(assets/card_bg/geo.jpg)';
        break;
      case 'anemo':
        backgroundImage = 'url(assets/card_bg/anemo.jpg)';
        break;
      case 'cryo':
        backgroundImage = 'url(assets/card_bg/cryo.jpg)';
        break;
      case 'hydro':
        backgroundImage = 'url(assets/card_bg/hydro.jpg)';
        break;
      case 'pyro':
        backgroundImage = 'url(assets/card_bg/pyro.jpg)';
        break;
      case 'electro':
        backgroundImage = 'url(assets/card_bg/electro.jpg)';
        break;
      case 'multi':
        backgroundImage = 'url(assets/card_bg/multi.jpg)';
        break;
      case 'artefact':
        backgroundImage = 'url(assets/card_bg/artefact_bg.jpg)';
        break;
      case 'weapon':
        backgroundImage = 'url(assets/card_bg/weapon_bg.jpg)';
        break;
      default:
        backgroundImage = 'url(assets/card_bg/default.jpg)';
    }

    div.style.setProperty('--background-image', backgroundImage);

    if (gridItem.imageUrl) {
      const imageContainer = document.createElement("div");
      imageContainer.className = "image-container";

      const img = document.createElement("img");
      img.src = gridItem.imageUrl;
      img.alt = `Image ${gridItem.id}`;
      imageContainer.appendChild(img);
      div.appendChild(imageContainer);
    }

    const textElement = document.createElement("p");
    textElement.textContent = gridItem.text || `Item ${gridItem.id}`;
    div.appendChild(textElement);

    if (gridItem.info) {
      const textElement2 = document.createElement("p");

      textElement2.innerHTML = gridItem.info.replace(/\n/g, '<br>');
      div.appendChild(textElement2);
    }

    gridContainer.appendChild(div);
  });

  currentPage++;
}

async function fetchGridData() {
  try {
    let url;
    switch (currentFilter) {
      case 'character':
        url = "data.json";
        break;
      case 'weapon':
        url = "weapon.json";
        break;
      case 'artefact':
        url = "artefact.json";
        break;
      default:
        url = "data.json";
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Ошибка загрузки данных');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    return [];
  }
}

function onScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollPosition = window.innerHeight + window.scrollY;

  if (scrollPosition >= scrollHeight - 200) { 
    createGrid();
  }
}

window.addEventListener("scroll", onScroll);

window.addEventListener("resize", calculateItemsPerPage);

calculateItemsPerPage();
createGrid();

document.addEventListener('DOMContentLoaded', function() {
  const gridContainer = document.getElementById('gridContainer');

  gridContainer.addEventListener('click', async function(event) {
    const gridItem = event.target.closest('.grid-item');
    if (gridItem && currentFilter === 'character') {
      const isExpanded = gridItem.classList.contains('expanded');

     
      if (isExpanded) {
        gridItem.classList.remove('expanded');
        gridItem.style.background = '';
        const h1 = gridItem.querySelector('h1');
        if (h1) h1.remove();
        const infoBox = gridItem.querySelector('.info-box');
        if (infoBox) infoBox.remove();
        return; 
      }

     
      gridItem.classList.add('expanded');
      const bodyBackground = window.getComputedStyle(document.body).background;
      gridItem.style.background = bodyBackground;

     
      const characterId = gridItem.getAttribute('data-id');

    
      const response = await fetch('data.json');
      const data = await response.json();

 
      const character = data.find(item => item.id === parseInt(characterId));

   
      const characterName = gridItem.querySelector('p').textContent;
      const h1 = document.createElement('h1');
      h1.textContent = characterName;
      gridItem.appendChild(h1);

    
      const infoBox = document.createElement('div');
      infoBox.className = 'info-box';

  
      if (character && character.additional_info) {
        infoBox.textContent = character.additional_info;
      } else {
        infoBox.textContent = 'Информация о персонаже отсутствует.';
      }

   
      const imageContainer = gridItem.querySelector('.image-container');
      if (imageContainer) {
        imageContainer.insertAdjacentElement('afterend', infoBox);
      }
    }
  });
});

document.addEventListener('click', function(event) {
  const gridItem = event.target.closest('.grid-item');
  const expandedItem = document.querySelector('.grid-item.expanded');

  if (expandedItem && (!gridItem || gridItem !== expandedItem)) {
    expandedItem.classList.remove('expanded');
    expandedItem.style.background = ''; 
    const h1 = expandedItem.querySelector('h1');
    if (h1) h1.remove(); 
  }
});