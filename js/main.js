//1. createElemWithText
function createElemWithText(elementName = 'p', textContent = '', className = '') {
    const element = document.createElement(elementName);
    element.textContent = textContent;

    if (className) {
        element.className = className;
    }

    return element;
}

//2. createSelectOptions
function createSelectOptions(users) {
  if (!users) {
    return undefined;
  }

  const options = [];

  for (const user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  }

  return options;
}


//3. toggleCommentSection
function toggleCommentSection(postId) {
    if (postId === undefined) {
        return undefined;
    } else {
        const commentSections = document.querySelectorAll('[data-post-id]');
        
        for (let i = 0; i < commentSections.length; i++) {
            const commentSection = commentSections[i];
            
            if (commentSection.getAttribute('data-post-id') === postId.toString()) {
                commentSection.classList.toggle('hide');
                return commentSection;
            }
        }
        
        return null;
    }
}

//4. toggleCommentButton
function toggleCommentButton(postId) {
    if (postId === undefined) {
        return undefined;
    }

    const button = document.querySelector(`button[data-post-id="${postId}"]`);

    if (button) {
        if (button.textContent === 'Show Comments') {
            button.textContent = 'Hide Comments';
        } else if (button.textContent === 'Hide Comments') {
            button.textContent = 'Show Comments';
        }
    }

    return button;
}

//5. deleteChildElements 
function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) {
        return undefined; 
    }
  
    let child = parentElement.lastElementChild;

    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }

    return parentElement;
}

//6. addButtonListeners
function addButtonListeners() {
    const buttons = document.querySelectorAll('main button');

    if (buttons.length > 0) {
        buttons.forEach(button => {
            const postId = button.dataset.postId;

            if (postId) {
                button.addEventListener('click', function(event) {
                    toggleComments(event, postId);
                });
            }
        });
    }

    return buttons;
}

//7.removeButtonListeners
function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');

    if (buttons.length > 0) {
        buttons.forEach(button => {
            const postId = button.dataset.postId;

            if (postId) {
                button.removeEventListener('click', event => {
                    toggleComments(event, postId);
                });
            }
        });
    }

    return buttons;
}

//8. createComments
function createComments(commentsData) {
  if (commentsData === undefined) {
        return undefined; 
    }

    const fragment = document.createDocumentFragment();

    commentsData.forEach(comment => {
        const article = document.createElement('article');

        const h3 = createElemWithText('h3', comment.name);

        const bodyParagraph = createElemWithText('p', comment.body);
        const emailParagraph = createElemWithText('p', `From: ${comment.email}`);

        article.appendChild(h3);
        article.appendChild(bodyParagraph);
        article.appendChild(emailParagraph);

        fragment.appendChild(article);
    });

  return fragment;
}

//9. populateSelectMenu
function populateSelectMenu(usersData) {
    if (usersData === undefined || !Array.isArray(usersData)) {
        return undefined; 
    } 
    
    const selectMenu = document.getElementById('selectMenu');

    const options = createSelectOptions(usersData);

    options.forEach(option => {
        selectMenu.appendChild(option);
    });

    return selectMenu;
}

//10 getUsers
async function getUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (response.ok) {
        const userData = await response.json();
        return userData;
    } else {
        console.error('Error fetching users.');
        return null;
    }
}

//11 getUserPosts
async function getUserPosts(userId) {
     if (userId === undefined) {
        return undefined; 
    }
  
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);

    if (response.ok) {
        const postData = await response.json();
        return postData;
    } else {
        console.error('Failed to fetch user posts');
        return null;
    }
}

//12 getUser
async function getUser(userId) {
    if (userId === undefined) {
        return undefined; 
    }
  
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    
    if (response.ok) {
        const userData = await response.json();
        return userData;
    } else {
        console.error('Failed to fetch user data');
        return null;
    }
}

//13 getPostComments
async function getPostComments(postId) {
    if (postId === undefined) {
        return undefined; 
    }
    
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
    
    if (response.ok) {
        const commentsData = await response.json();
        return commentsData;
    } else {
        console.error('Failed to fetch post comments');
        return null;
    }
}

//14 displayComments
async function displayComments(postId) {
    if (postId === undefined) {
        return undefined; 
    }
  
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');

    const comments = await getPostComments(postId);

    if (comments !== null) {
        const fragment = createComments(comments);
        section.appendChild(fragment);
        return section;
    } else {
        console.error('Failed to fetch comments for post ID:', postId);
        return null;
    }
}

//15 createPosts
async function createPosts(postsData) {
    if (postsData === undefined) {
        return undefined; 
    }
  
    const fragment = document.createDocumentFragment();

    for (const post of postsData) {
        const article = document.createElement('article');

        const h2 = createElemWithText('h2', post.title);
        const postBody = createElemWithText('p', post.body);
        const postId = createElemWithText('p', `Post ID: ${post.id}`);

        const author = await getUser(post.userId);
        const authorInfo = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const companyCatchPhrase = createElemWithText('p', author.company.catchPhrase);

        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;

        article.appendChild(h2);
        article.appendChild(postBody);
        article.appendChild(postId);
        article.appendChild(authorInfo);
        article.appendChild(companyCatchPhrase);
        article.appendChild(button);

        const section = await displayComments(post.id);
        article.appendChild(section);

        fragment.appendChild(article);
    }

    return fragment;
}

//16 displayPosts
async function displayPosts(postsData) {
    const mainElement = document.querySelector('main');
    let element;

    if (postsData && postsData.length > 0) {
        element = await createPosts(postsData);
    } else {
        // If posts data doesn't exist, create a paragraph element with the default-text class
        const defaultText = 'Select an Employee to display their posts.';
        element = document.createElement('p');
        element.classList.add('default-text');
        element.textContent = defaultText;
    }

    mainElement.appendChild(element);
    return element;
}

//17 toggleComments
function toggleComments(event, postId) {
    if (!event || !postId) {
        return undefined;
    }
  
    event.target.listener = true;

    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);

    return [section, button];
}

//18 refreshPosts
async function refreshPosts(postsData) {
    if (!postsData) {
        return undefined;
    }

    const mainElement = document.querySelector('main');

    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(mainElement);

    const fragment = await displayPosts(postsData);

    const addButtons = addButtonListeners();

    return [removeButtons, main, fragment, addButtons];
}

//19 selectMenuChangeEventHandler
async function selectMenuChangeEventHandler(event) {
    if (!event) {
        return undefined;
    }
    
    let userId = event?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
}

//20 initPage
async function initPage() {
    const users = await getUsers();

    const select = populateSelectMenu(users);

    return [users, select];
}

//21 initApp
function initApp() {
    initPage().then(([users, select]) => {
        const selectMenu = document.getElementById('selectMenu');

        selectMenu.addEventListener('change', (event) => {
            selectMenuChangeEventHandler(event);
        });
    });
}

document.addEventListener('DOMContentLoaded', initApp);
