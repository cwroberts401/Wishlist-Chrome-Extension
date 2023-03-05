// Get the "Add to wishlist" button element
const addToWishlistButton = document.getElementById('add-btn');
// Get the "Wishlist" element
const wishlistElement = document.getElementById('wishlist');

// Add a click event listener to the button
addToWishlistButton.addEventListener('click', function() {
  // Get the current URL of the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = tabs[0].url;
    const wishlistItem = {link: url, timestamp: Date.now()};

    
    // Add the new link to the saved wishlist items
    chrome.storage.sync.get(['wishlist'], function(result) {
      const wishlist = result.wishlist ? result.wishlist : [];
      wishlist.push(wishlistItem);
      // Save the updated wishlist data to the Chrome storage
      chrome.storage.sync.set({'wishlist': wishlist}, function() {
        // Update the popup with the new wishlist data
        getWishlistData();
      });
    });
  });
});

// Function to retrieve the wishlist data from the Chrome storage and update the popup
function getWishlistData() {
    chrome.storage.sync.get({'wishlist': wishlist}, function(result) {
      const wishlist = result.wishlist ? result.wishlist : [];
      wishlistElement.innerHTML = '';
      for (const linkObj of wishlist) {
        const listItem = document.createElement('li');
  
        const link = linkObj.link;
        const daysAgo = Math.floor((Date.now() - linkObj.timestamp) / (1000 * 60 * 60 * 24));
  
        const linkElement = document.createElement('a');
        linkElement.href = link;
        linkElement.target = '_blank';
        linkElement.innerText = link;
        listItem.appendChild(linkElement);
  
        const daysAgoElement = document.createElement('span');
        daysAgoElement.innerText = `${daysAgo} days ago`;
        listItem.appendChild(daysAgoElement);
  
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', function() {
          const index = wishlist.indexOf(linkObj);
          wishlist.splice(index, 1);
          chrome.storage.sync.set({'wishlist': wishlist}, function() {
            getWishlistData();
          });
        });
        listItem.appendChild(deleteButton);
  
        wishlistElement.appendChild(listItem);
      }
    });
  }
  

// Call the function to retrieve the wishlist data and update the popup when the popup is first opened
getWishlistData();
