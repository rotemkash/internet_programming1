[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/KnqVbps7)
# readme - your personal information is mandatory (email or ID)
<h1>Your Name(s) Rotem Kashani and Amit Lap</h1>
<p>Email: rotemkash@edu.hac.ac.il<br/>
  Email: amitlap@edu.hac.ac.il
</p>
<h2>Overview</h2>
<p>Yad2-like Website is a simple classified ads platform where users can post new advertisements and view existing ones.
The website includes features for regular users to post ads and for admin users to approve or delete ads.</p>

<h3>Functionality</h3>
<p>The website offers the following functionalities:</p>
<ul>
<li><b>Post New Ad:</b> Regular users can post new advertisements by providing title, description, price, phone number, 
and email. Once submitted, ads await approval from admin users.</li>
<li><b>View Ads:</b> Users can view all approved ads on the landing page. Ads are displayed in descending order of their
insertion date, with the most recent ads appearing first.</li>
<li><b>Admin Area:</b> Admin users have access to an admin area where they can log in, view all ads
(including unapproved ones), approve ads, and delete ads.</li>
<li><b>Search Form:</b> Contains a search form to filter ads and show only ads that contain a specific string
anywhere in the title.</li>
</ul>

<h3> Endpoints</h3>
<p>The following endpoints are available in the Yad2-like website:</p>
<ul>
<li><b>GET /:</b>Landing page endpoint. Displays all approved ads.</li>
<li><b>GET /login:</b>Login page endpoint. Renders the login page for admin users to log in.</li>
<li><b>GET /admin:</b>Admin page endpoint. Renders the admin page for admin users to manage ads.</li>
<li><b>GET /post-new-ad:</b>Post new ad page endpoint. Renders the page for users to post new advertisements.</li>
<li><b>POST /admin:</b>Endpoint for handling login form submission. Checks admin credentials and redirects to the admin
page if valid.</li>
<li><b>GET /ads:</b>Endpoint to fetch all ads. Accessible only to admin users. Returns a JSON array of all ads.</li>
<li><b>POST /create-ad:</b>Endpoint to create a new ad. Validates the ad data and adds it to the database.</li>
<li><b>DELETE /ads/:id:</b>Endpoint to delete an ad by ID. Accessible only to admin users.</li>
<li><b>PUT /ads/:id/approve:</b>Endpoint to approve an ad by ID. Accessible only to admin users.</li>
</ul>

<h3>Usage Instructions</h3>
<ol>
<li><b>Accessing the Website:</b>Open a web browser and navigate to http://localhost:3000 to access the landing page
of the Yad2-like website.</li>
<li><b>Viewing Ads:</b>LOn the landing page, you can view all approved ads. Ads are displayed with their title, 
description, price, contact information, and posting date.</li>
<li><b>Posting a New Ad:</b> Click on the "Post New Ad" button to navigate to the page for posting a new advertisement.
Fill in the required fields (title, description, price, phone number, email) and submit the form.</li>
<li><b>Logging In as Admin:</b>If you are an admin user, click on the "Admin Area" button on the landing page to 
navigate to the login page. Enter your admin credentials (username and password) and submit the form.</li>
<li><b>Managing Ads as Admin:</b>Once logged in as an admin, you can view all ads (including unapproved ones), approve
ads, and delete ads from the admin page.</li>
<li><b>Logging Out:</b>Click on the "Logout" button on the admin page to log out from the admin area.</li>
<li><b>Searching Ads:</b> Use the search form to filter ads by entering a specific string. Only ads containing the
specified string anywhere in the title will be displayed.</li>
</ol>