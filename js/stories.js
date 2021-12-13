"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
let favved = [];
/** Get and show stories when site first loads. */

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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  console.log(story instanceof Story);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();
  console.log(storyList.stories)
  // loop through all of our stories and generate HTML for them
  for (let story = 0; story < storyList.stories.length; story++ ) {
    const $story = generateStoryMarkup(storyList.stories[story]);
    
    //adding Delete buttons
    let delBtn = document.createElement('button');
    delBtn.setAttribute('id', story);
    delBtn.innerText = 'Remove';
    
    //adding Favourite buttons
    let favBtn = document.createElement('button');
    favBtn.setAttribute('id', `f${story}`);
    favBtn.innerText = 'Favourite';
    for (let i = 1; i <= document.getElementById('all-favStories-list').childElementCount; i++)
    {
      if(`${storyList.stories[story].storyId}` == document.getElementById('all-favStories-list').childNodes[i-1].id)
      favBtn.innerText = 'Added to Favourite';
    }
    
    ///
    
    $allStoriesList.append($story);
    
    if(logged) {
      document.getElementById(`${storyList.stories[story].storyId}`).append(delBtn);
      delBtn.addEventListener('click', delStory);
      document.getElementById(`${storyList.stories[story].storyId}`).append(favBtn);
      favBtn.addEventListener('click', favStory);
    }
    
  }

  $allStoriesList.show();
}


///Put new story on the list

async function putNewStoryOnPage(e) {
  e.preventDefault()
  console.log(localStorage.getItem("username"));
  console.log(currentUser.username);
  let newStory = new Story({
      'title' : $addStoryTitle.val(),
      'author' : $addStoryAuthor.val(),
      'url' : $addStoryURL.val()
  });
  await storyList.addStory(currentUser, newStory);
  const $story = generateStoryMarkup(newStory);
    $allStoriesList.prepend($story);
    //Adding Delete button
    // let delBtn = document.createElement('button');
    // delBtn.setAttribute('id', story);
    // delBtn.innerText = 'Remove';
    // $favStoryList.append(delBtn);

    $addStoryForm.slideUp("slow");
    $addStoryForm.trigger("reset");
    location.reload();
}

$addStorybtn.on("click", putNewStoryOnPage);

///Delete story from the list

async function delStory(evt) {
  evt.preventDefault();
  
  if (confirm("Do you want to DELETE the LINK?")) {
    let x = evt.target.id;
    let getStory = document.getElementById(`${storyList.stories[x].storyId}`);
    let getDel = document.getElementById(`${x}`);
    getStory.remove();
    getDel.remove();
    
    //Removing from API
    let token = localStorage.getItem("token");
    await axios({
      url: `${BASE_URL}/stories/${storyList.stories[x].storyId}`,
      method: "DELETE",
      data: { token: token}
    });
  }
  
}

// Adding Favourite story
async function favStory(evt) {
  evt.preventDefault();
  let x = evt.target.id;
  
  

  // let getStory = document.getElementById(`${storyList.stories[x[1]].storyId}`)
  let getFav = document.getElementById(`${x}`);
  
  if(getFav.innerText == 'Favourite')
  {
    // // //Adding to API
    // let token = localStorage.getItem("token");
    // await axios({
    //   url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyList.stories[x[1]].storyId}`,
    //   method: "POST",
    //   data: { token: token}
    // });
    const $story = generateStoryMarkup(storyList.stories[x[1]]);
    $favStoryList.append($story);
    favved.push(`${storyList.stories[x[1]].storyId}`);
    console.log(document.getElementById('all-favStories-list').childNodes)
    getFav.innerText = 'Added to Favourite';
    return;
  }
  else if (getFav.innerText == 'Added to Favourite')
  {
    if(confirm('Do you want to REMOVE Favourite?'))
    {
      getFav.innerText = 'Favourite';
      let c = 0;
      for (let i = 0; i< favved.length; i++) {
        for (let j = 1; j<= document.getElementById('all-favStories-list').childElementCount; j++) {
          if (c == 1) break;
          if(`${storyList.stories[x[1]].storyId}` == document.getElementById('all-favStories-list').childNodes[j-1].id )
          {
            document.getElementById('all-favStories-list').childNodes[j-1].remove();
            console.log('yess')
            c = 1;
          }
        }
      }
      //document.getElementById('all-favStories-list').childNodes
    }
  }
}

