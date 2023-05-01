"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

//Get and show stories when site first loads. populates storyList global//

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */


//add show star if logged in checked by boolean
//add show delete button if we are in my stories section only! 
function generateStoryMarkup(story,showDeleteBtn=false) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  const showStar=Boolean(currentUser)
  return $(`
  <li id="${story.storyId}">
    ${showDeleteBtn ? getDeleteBtnHTML() : ""}
    ${showStar ? getStarHTML(story, currentUser) : ""}
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  </li>
`);
  // if (showDeleteBtn===false){
  // return $(`
  //     <li id="${story.storyId}">
  //       <a href="${story.url}" target="a_blank" class="story-link">
  //         ${story.title}
  //       </a>
  //       <small class="story-hostname">(${hostName})</small>
  //       <small class="story-author">by ${story.author}</small>
  //       <small class="story-user">posted by ${story.username}</small>
  //     </li>
  //   `)};
  //   if (showDeleteBtn===true){
  //     return $(`
  //     <li id="${story.storyId}">
  //       <a href="${story.url}" target="a_blank" class="story-link">
  //         ${story.title}
  //       </a>
  //       <small class="story-hostname">(${hostName})</small>
  //       <small class="story-author">by ${story.author}</small>
  //       <small class="story-user">posted by ${story.username}</small>
  //     </li>
  //   `)};

    }

/** Make delete button HTML for story */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//under construction newStorySubmit! need to append new story to the storyList and dom
// 1. grab data needed to run addStory func, author, title, url from the submit form
//2. grab the username
//3. run the addStory func
//4. add to userStories array in current user instance. This is not needed addStory will run this!!! 
//5. reset the form
async function newStorySubmit(evt){
  console.debug(newStorySubmit)
  evt.preventDefault()
  const author=$('#new-story-author').val()
  const title=$('#new-story-title').val()
  const url=$('#new-story-url').val()
  // const username=currentUser.username
  // console.log(username)
  const response=await storyList.addStory(currentUser,{title,author,url})
  console.log(response)
  $newStoryAuthor.val('')
  $newStoryTitle.val('')
  $newStoryUrl.val('')
  $newStoryForm.hide()
  const newStory=generateStoryMarkup(response,false)
  $allStoriesList.prepend(newStory)
}

$newStorySubmitButton.on('click', newStorySubmit)


//funct needs to take a story from the favorites array, and put it into the generate markup func

function putFavoritesOnPage(){
  console.debug("putFavoritesOnPage");
  $favoritedStoriesList.empty();
  if(currentUser.favorites.length===0){
    $favoritedStoriesList.append(`<h3>${currentUser.username} has no favorites</h3>`)

  }
else{
  for (let story of currentUser.favorites) {
    const $story=generateStoryMarkup(story,true);
    $favoritedStoriesList.append($story)
  }} 
  $favoritedStoriesList.show()
}

function putMyStoriesOnPage(){
  console.debug("putMyStoriesOnPage");
  $myStoriesList.empty();
  if(currentUser.ownStories.length===0){
    $myStoriesList.append(`<h3>${currentUser.username} has not added any stories </h3>`)
  }
else{
  for (let story of currentUser.ownStories){
    const $story=generateStoryMarkup(story,true);
    $myStoriesList.append($story)
  }}
  $myStoriesList.show()
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function deleteStory(evt){
  console.debug("deleteStory");
  const nearestStory=$(evt.target).closest("li");
  const storyID=nearestStory.attr("id");
  console.log("deleted",storyID);
  await storyList.removeStory(currentUser,storyID);
  putMyStoriesOnPage();
}

$myStoriesList.on("click",".trash-can",deleteStory)


async function toggleFavorite(evt){
  console.debug('toggleFavorite')
  const target=$(evt.target);
  const nearestStory=$(evt.target).closest("li")
  const storyID=nearestStory.attr("id")
  const story=storyList.stories.find(s => s.storyId===storyID);
  //is a favorite
  if (target.hasClass('fas')){
    await currentUser.removeFavorite(story);
    target.closest("i").toggleClass("fas far");
  }
  //is not a favorite
  else{
    await currentUser.addFavorite(story);
    target.closest("i").toggleClass("fas far");
  }
  
}

$allStoriesList.on("click",".star",toggleFavorite)
$favoritedStoriesList.on("click",".star",toggleFavorite)

async function deleteFavorite(evt){
  console.debug('deleteFavorite');
  const nearestStory=$(evt.target).closest("li");
  const storyID=nearestStory.attr("id");
  const story=currentUser.favorites.find(s=> s.storyId===storyID)
  console.log(story)
  await currentUser.removeFavorite(story);
  putFavoritesOnPage();
}
$favoritedStoriesList.on("click",".trash-can",deleteFavorite)
$favoritedStoriesList.on("click",".trash-can",evtListenerTest)

function evtListenerTest(){
  console.log('clicked')
}
