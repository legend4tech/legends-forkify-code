import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';

import recipeViews from './View/recipeViews';
import SearchViews from './View/searchViews';
import resultViews from './View/resultViews';
import paginationView from './View/paginationView';
import bookmarksView from './View/bookmarksView';
import addRecipeView from './View/addRecipeView';
// //
import 'core-js';
import 'regenerator-runtime';
import { async } from 'regenerator-runtime';
import { any } from './View/bookmarksView';


///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeViews.renderSpinner();

    // 3). Updating bookmark view
    bookmarksView.update(model.state.bookmark);

    // 0). Update result view to mark selected search result
    resultViews.update(model.getSearchResultsPage());

    // 1). Loading Recipe
    await model.loadRecipe(id);

    // 2). Rendering Recipe
    recipeViews.render(model.state.recipe);
  } catch (err) {
    recipeViews.renderError();
  }
};

const controllerSearchResults = async function () {
  try {
    resultViews.renderSpinner();
    //1): Get Search Query
    const query = SearchViews.getQuery();
    if (!query) return;

    //2): Load Search Result
    await model.loadSearchResult(query);

    //3): Render Results
    // resultViews.render(model.state.search.results)
    resultViews.render(model.getSearchResultsPage());

    //4): Render Initial Pagination buttons
    paginationView.render(model.state.search);
    //
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1): Render NEW Results
  resultViews.render(model.getSearchResultsPage(goToPage));

  // 2): Render NEW Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update Recipe Servings(in state)
  model.updateServings(newServings);

  // Update Recipe View
  // recipeViews.render(model.state.recipe);
  recipeViews.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //  Add/Remove Bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Recipe View
  recipeViews.update(model.state.recipe);

  // Render Bookmark
  bookmarksView.render(model.state.bookmark);
  console.log(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();
    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeViews.render(model.state.recipe);

    //success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmark);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🎉', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeViews.addHandlerRender(controlRecipes);
  recipeViews.addHandlerUserServings(controlServings);
  recipeViews.addHandlerAddBookmark(controlAddBookmark);
  SearchViews.addHandlerSearch(controllerSearchResults);
  paginationView._addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange',controlRecipes)
// window.addEventListener('load',controlRecipes)
