# Peginterest

[Peginterest Live](https://peginterest.herokuapp.com/)

Pegterest is a full stack web application inspired by Pinterest.
Users can upload, save and manage images—known as pegs through collections known as pegboards.

This full-stack web application uses the structure:

* Rails backend
* React/Redux frontend
* PostgreSQL Database

## Features

* User accounts, with secure authentication both on the front-end and back-end. User is bootstrapped on the front-end.
* Users can create pegs and boards, as well as add/remove pegs from boards.
* Modals are used to render forms and detail views.
* Discover Page features a Masonry layout.
* Users have a profile and can view their saved/created pegs and boards.

### User Authentication

![](https://res.cloudinary.com/archhere/image/upload/v1529100882/uploaded_images/Screen_Shot_2018-06-15_at_3.06.23_PM.png)

#### Masonry Layout

On the Discover Page, pegs are organized in a Masonry-like fashion. They are given a minimum width. The columns are fitted according to the maximum amount of columns that can fit in the window. As a result, the window is resized, the page is responsive.

![](https://res.cloudinary.com/archhere/image/upload/v1529102017/uploaded_images/Screen_Shot_2018-06-15_at_3.32.33_PM.png)

#### Modals

Many of the site's forms are displayed in an overlay on the current page rather than on a new page. Users can easily click outside of the modal window to return to the page they were on.

![](https://res.cloudinary.com/archhere/image/upload/v1529101498/uploaded_images/Screen_Shot_2018-06-15_at_3.23.57_PM.png)

### Drag and Drop Upload

Users are able to upload images from their own devices onto the website. This uses react-dropzone. Users can either click on the dropzone or drag their images to upload to the site. The uploaded images are automatically rendered onto the home page.

![](https://res.cloudinary.com/archhere/image/upload/v1529101822/uploaded_images/Screen_Shot_2018-06-15_at_3.29.56_PM.png)

 Users are able to upload images from their own devices onto the website. This uses react-dropzone. Users can either click on the dropzone or drag their images to upload to the site. The uploaded images are automatically rendered onto the home page.
 
 ```javascript
 <Dropzone
            multiple={false}
            accept="image/*"
            onDrop={this.handleImageUpload} className="dropzone" minSize={1}>
            {this.picturethumbnail()}

</Dropzone>

let someclass;
    if (this.state.image_url === ''){
      someclass = "submit-create-button";
    }
    else {
      someclass = "submit-create-buttonawesome";
    }

<div className="submitouterdiv">
    <input className={someclass} type="submit" value='Done' />
</div>
    etc..
  ```
 Once image load is successful, the "Done" button changes colors.
 
 

### Future features
Peginterest was designed and built in two weeks. The following features will be updated in the future.

* User Following: 
  Users will be able to follow other users.I will be using a joins table to implement this.

* Infinite Scroll: 
  The discover feed will gradually show more pins as the user scrolls down the page.

* Search: 
  Users will be able to search for the pins and boards that they are interested in.

