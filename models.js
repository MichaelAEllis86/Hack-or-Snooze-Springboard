"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";
//delete these two variables as I am using them for referencing curl requests
let apiToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1vb2tzMjAyMiIsImlhdCI6MTY4MTYxNjgwMH0.DohA4AZH0K6d3IJTWEDD9MCVfc8DbSDGhMHIdTP6YOM"
let goggleStoryID='de017744-9d98-46a6-87ec-16f3844289ac'

//referencing our storylist instance storyList.stories[0].getHostName()

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }
//parses url from hostname and returns it
//this function returns the hostname from the URL class/instance aka we can declare a new URL just like a new Set or new Class etc! it has properties on it!
//we can now reference this property once a new URL is created and we just need to reference that property at the URL in the story object!
//Works!
  getHostName(){
    return new URL(this.url).hostname
  }

 

}

/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */
//needs to have static keyword because the intial call of getStories comes before we have an instance of storyList! if we can only call from an instance that isn't there this can't work
 static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response=await axios.get(`${BASE_URL}/stories`); //get request to the api url at the stories endpoint
    console.log(response)
    // const response = await axios({
    //   url: `${BASE_URL}/stories`,
    //   method: "GET",
    // });

    // turn plain old story objects from API into instances of Story class!
    const stories = response.data.stories.map(story => new Story(story)); //like in jeopardy, we go through the response/data object until it is an array.
                                                                          //once it is in an array we can map it. we are then mapping it into an array with 8 instances of story.
    // build an instance of our own class using the new array of stories. final result is a returned story list that will be set to storyList variable
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  // async addStory( user,{title,author,url}/* user, newStory */) {
  //   // UNIMPLEMENTED: complete this function!


  async addStory(currentUser,{title,author,url}){ //func's here need to take in the data needed for the request in the parameters 
    const token=currentUser.loginToken
    console.log(token)
    const response=await axios({
      method:"POST",
      url:`${BASE_URL}/stories`,
      data: {token, story:{title,author,url}}
    })
    console.log(response)
    const story=new Story(response.data.story);
    // this.stories.unshift(story) //questions on this context! does referencing the current storyList instance work?
    // console.log(this,'console log of this context')
    // console.log(storyList.stories,'should match above')
    storyList.stories.unshift(story)
    currentUser.ownStories.unshift(story)
    return story
  }

  async removeStory(currentUser,storyId){
    const token=currentUser.loginToken
    console.log(token)
    const response=await axios({
      method:"DELETE",
      url:`${BASE_URL}/stories/${storyId}`,
      data:{token:token}
    })
    console.log(response)
    alert(`${response.data.message}`)
    storyList.stories=storyList.stories.filter(story=> story.storyId !==storyId);
    currentUser.ownStories=currentUser.ownStories.filter(story => story.storyId !==storyId);
    }

  }



/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }
//still working here 
//adds a story instance to the list of user favorites and update api! How does a story get into this function call? might need to add that later
  async addFavorite(story){
    const token=this.loginToken;
    console.log(token);
    const username=this.username;
    console.log(username);
    const response= await axios({
      url:`${BASE_URL}/users/${username}/favorites/${story.storyId}`, //the final endpoint in the response is the storyID. Can test by chaning func parameter to a story ID and plugging it into the url
      method: "POST",
      data:{token}
    });
    console.log(response);
    this.favorites.push(story);
    console.log(this.favorites)
  }
//still working here need logic to delete specfic story from the favorites array
  async removeFavorite(story){
    const token=this.loginToken
    console.log(token)
    const username=this.username
    console.log(username)
    const response= await axios({
      url:`${BASE_URL}/users/${username}/favorites/${story.storyId}`,
      method: "DELETE",
      data:{token}
    });
    console.log(response);
    this.favorites=this.favorites.filter(function(favorite,index,array){
    return favorite.storyId !==story.storyId
    })
    console.log(this.favorites)
    }
    
    isFavorite(story){
      this.favorites.some(function(favorite,index,array){
        return favorite.storyId===story.storyId
      })
    }
  
    
    

  }

