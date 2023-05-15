import { authors, books, genres, BOOKS_PER_PAGE} from "./data.js"
const matches = books

let page = 1; 

// Assigning HTML dialog classes into variables
const settingIcon = document.querySelector('[ data-header-settings]')
const settingMenu= document.querySelector('[ data-settings-overlay]')
const settingCancelButton=document.querySelector('[data-settings-cancel]')
const dataMessage = document.querySelector('[data-list-message]')
const dataListItems =document.querySelector('[data-list-items]')
const dropDownButton = document.querySelector('[data-list-button]')
const focusOnBook = document.querySelector('[data-list-active]')
const blurImage = document.querySelector('[data-list-blur]')
const  image = document.querySelector('[data-list-image]')
const  activeTitle = document.querySelector('[data-list-title]')
const activeSubTitle = document.querySelector('[data-list-subtitle]') 
const activeDescription = document.querySelector('[data-list-description]')  
const activeCloseButton =    document.querySelector('[data-list-close]')                                                     


const theme = {
  day: {
    dark: '10, 10, 20',
    light: '255, 255, 255'
  },
  night: {
    dark: '255, 255, 255',
    light: '10, 10, 20'
  }
};

 const createPreview = ({ author, id, image, title })=> {
    const result =document.createElement('button')
     result.className= 'list__items preview'
      result.setAttribute('data-list','')
     result.innerHTML= 
                     ` 
                     <img
                     class="preview__image"
                     src="${image}"
                 />
                 
                 <div class="preview__info">
                     <h3 class="preview__title">${title}</h3>
                     <div class="preview__author">${author}</div>
                 </div>
             <dialog> <p>${id}</p>              
                           `
                           return result
  }
  

  const fragment = document.createDocumentFragment()
 const extracted = books.slice(0, 36)
 for (const { author, image, title, id } of extracted ) {
   const preview = createPreview({
     author: authors[author],
        id,
         image,
        title
     })
    
  
    fragment.appendChild(preview)
 }
dataListItems.appendChild(fragment)



   

  dropDownButton.innerHTML =  [
    `<span>Show more</span>
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>`
]

// Below code will add functionality to tell user how many books left to open 
const addMoreBooks=()=> {
    const startIndex = page * BOOKS_PER_PAGE;
    const endIndex = startIndex + 36;
    const extracted = books.slice(startIndex, endIndex);
  
    const fragment = document.createDocumentFragment();
    for (const { author, image, title, id } of extracted) {
      const preview = createPreview({
        author: authors[author],
        id,
        image,
        title,
      });
      fragment.appendChild(preview);
    }
    dataListItems.appendChild(fragment);
    page++;

    dropDownButton.innerHTML =  [
        `<span>Show more</span>
        <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - 
          [page * BOOKS_PER_PAGE] : 0})</span>`
    ]
    dropDownButton.disabled = !(matches.length - [page * BOOKS_PER_PAGE] > 0)
}
 
  const documentElement = document.body;
 
  // Assigning HTML dialog classes into variables for search functionality
const searchIcon=document.querySelector('[data-header-search]')
const  searchMenu =document.querySelector('[data-search-overlay]')
const searchTitle=document.querySelector('[data-search-title]')
const searchGenre =document.querySelector('[data-search-genres]')
const searchAuthors=document.querySelector('[data-search-authors]')
const searchCancelButton=document.querySelector('[data-search-cancel]')
const searchForm= document.querySelector('[data-search-form]')

// Genre search funnctionality
 const optionGenres = document.createDocumentFragment()
 const genreElement = document.createElement('option')
 genreElement.value = 'any'
 genreElement.innerText = 'All Genres'
 optionGenres.appendChild(genreElement)

for (const [id, name] of Object.entries(genres)) {
  
   
    const options=document.createElement('option')
   
    options.value=id
    options.innerText = name
   
     optionGenres.appendChild(options)
 }
  searchGenre.appendChild(optionGenres)

 
  // Author search functionality
const authorsFragment = document.createDocumentFragment()
const authorsElement = document.createElement('option')
authorsElement.value = 'any'
authorsElement.innerText = 'All Authors'
 authorsFragment.appendChild(authorsElement)

 for ( const [id, name] of Object.entries(authors)) {
   
    const options=document.createElement('option')
    
    options.value=id
    options.innerText = name
    
     authorsFragment.appendChild(options)
 }

 searchAuthors.appendChild(authorsFragment)

  searchIcon.addEventListener('click',()=> {
    searchMenu.showModal();
     searchTitle.focus();
 })
 
 settingIcon.addEventListener('click',()=>{ 
    settingMenu.showModal()
})

// Below code will add filtered books into the result and from result to the HTML dialog
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    dataListItems.innerHTML = '';
    dropDownButton.removeEventListener('click', addMoreBooks);
    const formData = new FormData(searchForm);
    const filters = Object.fromEntries(formData);
    const result = [];  
    let page=1
    dropDownButton.disabled=false
    for (const book of books) {
      const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch = filters.author === 'any' || book.author === filters.author;
      const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
    
      if (authorMatch && genreMatch && titleMatch) {
        result.push(book);
      }
    }
      
    const pieceOfResult= result.slice(0, 36)
    for (const { author, image, title, id } of pieceOfResult) {
      const preview = createPreview({
        author: authors[author],
        id,
        image,
        title,
      });
    
      
      dataListItems.appendChild(preview)
    }
    
    // Below code will add 36 more books to the screen 
    dropDownButton.innerHTML = [
        `<span>Show more</span>
        <span class="list__remaining"> (${result.length - [page * BOOKS_PER_PAGE] > 0 ? result.length - [page * BOOKS_PER_PAGE] : 0})</span>`
    ]
      dropDownButton.addEventListener('click',()=> {
        const startIndex = page * BOOKS_PER_PAGE;
        const endIndex = startIndex + 36;
        const extracted = result.slice(startIndex, endIndex);
      
        const fragment = document.createDocumentFragment();
        for (const { author, image, title, id } of extracted) {
          const preview = createPreview({
            author: authors[author],
            id,
            image,
            title,
          });
          fragment.appendChild(preview);
        }
        dataListItems.appendChild(fragment);
        page++;
    
        dropDownButton.innerHTML =  [
            `<span>Show more</span>
            <span class="list__remaining"> (${result.length - [page * BOOKS_PER_PAGE] > 0 ? result.length - [page * BOOKS_PER_PAGE] : 0})</span>`
        ]
        
        
      })
    
dropDownButton.disabled = !(result.length - [page * BOOKS_PER_PAGE] > 0)
if (result.length <= 0 ){
    dataMessage.classList.add('list__message_show')
    dropDownButton.disabled=true
}else{
     dataMessage.classList.remove('list__message_show')
   }
   searchMenu.close()
  })  
  
  dropDownButton.addEventListener('click', addMoreBooks);
 
 
 settingMenu.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData);
    const selectedMode = result.theme === 'night' ? 'night' : 'day';
    
    documentElement.style.setProperty('--color-dark', theme[selectedMode].dark);
    documentElement.style.setProperty('--color-light', theme[selectedMode].light);
    
  
    settingMenu.close();
  });
    
 dataListItems.addEventListener('click', (event) => {
        
    
        const pathArray = Array.from(event.path || event.composedPath());
        let active;
       
        
        for (const node of pathArray) {
            
            if(event.target.tagName !=='BUTTON') return;
            
           if (active) break;
          const previewId = node.children[2].children[0].innerHTML;
        
          
          for (const singleBook of books) {
            if (singleBook.id === previewId) {
              active = singleBook;
              break;
            }
          }
        }
      
        if (!active) return;
        focusOnBook.showModal();
        blurImage.src  = active.image;
        image.src=active.image
        activeTitle.innerText = active.title;
        activeSubTitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        activeDescription.innerText = active.description;
      });
    activeCloseButton.addEventListener('click',()=>{ 
         focusOnBook.close()
    })
    searchCancelButton.addEventListener('click',()=>{ searchMenu.close() }) 
 settingCancelButton.addEventListener('click',()=>{ settingMenu.close() }) 