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

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

//Show add story on clicking on 'submit'
function addNewStory(e) {
  console.log(e.target.id)
  hidePageComponents();
  $addStoryForm.show();
}

$addStory.on("click", addNewStory);

//Show Favourite stories on clicking on 'favourite'
function favStory(e) {
  console.log(e.target.id)
  hidePageComponents();
  $favs.show();
}

$addFav.on("click", favStory);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
