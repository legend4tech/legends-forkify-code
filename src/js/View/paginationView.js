import View from './views.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;


      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    //Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      const nextButton = this._generateNextButton(curPage + 1);
      return `${nextButton}`;
    }

    //Last Page
    if (curPage === numPages && numPages > 1) {
      const prevButton = this._generatePrevButton(curPage - 1);
      return `${prevButton}`;
    }

    //Other Page
    if (curPage < numPages) {
      const prevButton = this._generatePrevButton(curPage - 1);

      const nextButton = this._generateNextButton(curPage + 1);

      return `${prevButton} ${nextButton}`;
    }

    //Page 1, and there are NO other pages
    return '';
  }

  _generateNextButton(pagePos) {
    return `
      <button data-goto="${pagePos}" class="btn--inline pagination__btn--next">
        <span>Page ${pagePos}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  _generatePrevButton(pagePos) {
    return `
      <button  data-goto="${pagePos}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${pagePos}</span>
      </button>
    `;
  }
}

export default new PaginationView();
