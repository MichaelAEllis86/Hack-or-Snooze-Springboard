"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");
//Storylists
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favoritedStoriesList=$("#favorited-stories-list")
const $myStoriesList=$("#my-stories-list")
//user profile
const $userProfile=$("#user-profile")
const $userProfileContainer=$("#user-profile-container")
//login and signup forms
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
//nav links
const $navAll=$("#nav-all")
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
//more links
const $userNavLinks=$(".user-nav-links")
const $navSubmitNew=$("#nav-submit-new");
const $navFavorites=$("#nav-favorites");
const $navMyStories=$("#nav-my-stories");

const $newStoryForm=$("#new-story-form");
const $newStoryAuthor=$("#new-story-author");
const $newStoryTitle=$("#new-story-title");
const $newStoryUrl=$("#new-story-url");
const $newStorySubmitButton=$('#new-story-submit-button')

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $newStoryForm,
    $favoritedStoriesList,
    $myStoriesList,
    $userProfile,
  ];
  components.forEach(c => c.hide());// hide is a jQuery function that hides the component, but this is fancy! here we put each component as a jQuery item already and just called hide on it
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
  console.log('clicked')
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");

$(start);

//extra load stories button feature. Allows user to refresh stories page if they so desire. Definitely not necessary but leaving it in for now.
$('#startbutton').on("click",start)
