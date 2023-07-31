import View from './views.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js'
class ResultViews extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipe found for your query please try again :)`;
  _message = '';
  _generateMarkup() {
    console.log(this._data)
    return this._data.map(bookmark=>previewView.render(bookmark,false)).join();
  }
}

export default new ResultViews();
