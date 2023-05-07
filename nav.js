"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$navAll.on("click", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $userNavLinks.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
//Updates UI to show story submission form. Keeps storylist on page
function navSubmitNewStoryClick(evt){
  console.debug('navSubmitNewStoryClick', evt);
  hidePageComponents();
  $newStoryForm.show();
  $allStoriesList.show();
}
$navSubmitNew.on("click",navSubmitNewStoryClick);

//updates UI to show current user's favorites. Hides all else but favorites list.
function navFavoritesClick(evt){
  console.debug(navFavoritesClick, evt);
  hidePageComponents();
  putFavoritesOnPage();
}
$navFavorites.on("click",navFavoritesClick);

function navMyStoriesClick(evt){
  console.debug(navMyStoriesClick, evt);
  hidePageComponents();
  putMyStoriesOnPage();
}
$navMyStories.on("click",navMyStoriesClick);

function navUserProfileClick(evt){
  console.debug(navUserProfileClick, evt);
  hidePageComponents();
  putUserProfileOnPage();
}
$navUserProfile.on("click",navUserProfileClick);



