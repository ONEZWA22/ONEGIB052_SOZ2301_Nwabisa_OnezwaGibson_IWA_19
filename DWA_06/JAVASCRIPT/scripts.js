/**
 * Book Search Application
 *
 * This application allows users to search for books based on various criteria such as title, author, and genre.
 * The search results are displayed with pagination functionality.
 *
 * The code below utilizes objects and functions as abstractions to improve maintainability.
 */

// Data
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

// Application state
const app = {
  page: 1,
  matches: books,
  elements: {
    searchForm: document.querySelector('[data-search-form]'),
    listButton: document.querySelector('[data-list-button]'),
    listItems: document.querySelector('[data-list-items]'),
    settingsForm: document.querySelector('[data-settings-form]'),
    searchOverlay: document.querySelector('[data-search-overlay]'),
    settingsOverlay: document.querySelector('[data-settings-overlay]')
  }
};

// UI Controller
const UIController = {
  /**
   * Update the list items based on the current page and matches.
   */
  updateListItems() {
    const fragment = document.createDocumentFragment();
    const start = (app.page - 1) * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;

    for (const { author, id, image, title } of app.matches.slice(start, end)) {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('data-preview', id);

      element.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
      `;

      fragment.appendChild(element);
    }

    app.elements.listItems.innerHTML = '';
    app.elements.listItems.appendChild(fragment);
  },

  /**
   * Update the pagination button based on the remaining matches.
   */
  updatePagination() {
    const remaining = Math.max(0, app.matches.length - (app.page * BOOKS_PER_PAGE));
    const buttonText = remaining > 0 ? `Show more (${remaining})` : 'Show more';
    app.elements.listButton.innerText = buttonText;
    app.elements.listButton.disabled = remaining <= 0;
  },

  /**
   * Handle the form submission of the search form.
   * @param {Event} event - The form submission event.
   */
  handleSearchFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
      let genreMatch = filters.genre === 'any';

      for (const singleGenre of book.genres) {
        if (genreMatch) break;
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }

      if (
        (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === 'any' || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    app.page = 1;
    app.matches = result;

    if (result.length < 1) {
      document.querySelector('[data-list-message]').classList.add('list__message_show');
    } else {
      document.querySelector('[data-list-message]').classList.remove('list__message_show');
    }

    this.updateListItems();
    this.updatePagination();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    app.elements.searchOverlay.open = false;
  },

  /**
   * Handle the click event of the list button to load more results.
   */
  handleListButtonClick() {
    app.page++;
    this.updateListItems();
    this.updatePagination();

    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  },

  /**
   * Handle the click event of a list item to show its details.
   * @param {Event} event - The click event.
   */
  handleListItemsClick(event) {
    const previewButton = event.target.closest('[data-preview]');
    if (previewButton) {
      const bookId = previewButton.getAttribute('data-preview');
      const active = books.find((book) => book.id === bookId);

      if (active) {
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = active.image;
        document.querySelector('[data-list-image]').src = active.image;
        document.querySelector('[data-list-title]').innerText = active.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = active.description;
      }
    }
  },

  /**
   * Initialize the application by setting up event listeners and rendering initial content.
   */
  initialize() {
    // Event listeners
    app.elements.searchForm.addEventListener('submit', (event) => this.handleSearchFormSubmit(event));
    app.elements.listButton.addEventListener('click', () => this.handleListButtonClick());
    app.elements.listItems.addEventListener('click', (event) => this.handleListItemsClick(event));

    // Initial rendering
    const genreHtml = document.createDocumentFragment();
    const firstGenreElement = document.createElement('option');
    firstGenreElement.value = 'any';
    firstGenreElement.innerText = 'All Genres';
    genreHtml.appendChild(firstGenreElement);

    for (const [id, name] of Object.entries(genres)) {
      const element = document.createElement('option');
      element.value = id;
      element.innerText = name;
      genreHtml.appendChild(element);
    }

    document.querySelector('[data-search-genres]').appendChild(genreHtml);

    const authorsHtml = document.createDocumentFragment();
    const firstAuthorElement = document.createElement('option');
    firstAuthorElement.value = 'any';
    firstAuthorElement.innerText = 'All Authors';
    authorsHtml.appendChild(firstAuthorElement);

    for (const [id, name] of Object.entries(authors)) {
      const element = document.createElement('option');
      element.value = id;
      element.innerText = name;
      authorsHtml.appendChild(element);
    }

    document.querySelector('[data-search-authors]').appendChild(authorsHtml);

    const prefersDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDarkTheme ? 'night' : 'day';

    document.querySelector('[data-settings-theme]').value = theme;
    document.documentElement.style.setProperty('--color-dark', theme === 'night' ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', theme === 'night' ? '10, 10, 20' : '255, 255, 255');

    app.elements.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
    app.elements.listButton.disabled = (books.length - BOOKS_PER_PAGE) <= 0;
  }
};

// Initialize the application
UIController.initialize();
