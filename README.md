# Cyber-Security-Base-Project-Backend

LINK: https://github.com/eerojala/Cyber-Security-Base-Project-Backend (backend, cloning just this repository is enough)
https://github.com/eerojala/Cyber-Security-Base-Project-Frontend (frontend, you don’t need to clone this one since the backend repository already has a compressed build version of the frontend)

The frontend and backend are in separate repositories in order for heroku to work  

Note: It has been a few years since I installed node and git on windows so my installation instructions might probably be insufficient because I don’t remember the details anymore. In the case that you are unable to install the project using my shoddy instructions, I uploaded it to heroku so you can still fiddle around with it. It can be found at https://mysterious-hollows-12421.herokuapp.com/ 

The site has two ready-made accounts test1 and test2 with passwords 12345 and qwerty respectively.

INSTRUCTIONS:
1. If you haven’t already, install git to your computer. A guide that may or may not work: https://www.linode.com/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/

2. Download/install node and npm from https://nodejs.org/en/ more detailed installation instructions in finnish at https://github.com/fullstack-hy2019/misc/blob/master/asennusohjeita.md

On windows, it should be pretty simple if you are able to run as admin in the computer you are using. If you aren’t, here are the above instructions translated to english:
    1. Download windows binary from https://nodejs.org/en/download/
    2. Extract the zip file to the directory of your choice, e.g. (%userprofile%\Applications\node)
    3. Press WIN+R (CMD+R) and write rundll32 sysdm.cpl,EditEnvironmentVariables
    4. Pick ‘Path’. Press ‘Edit...’. Press ‘New’. Add path to the directory you extracted node to, e.g. (%userprofile%\Applications\node)

3. git clone git@github.com:eerojala/Cyber-Security-Base-Project-Backend.git
4. Navigate to the cloned directory with a command prompt
5. npm install
6. npm start
7. The application should be running at http://localhost:3001/



FLAW 1:
Description: Broken access control  
In the app, anyone is able to edit messages, even though it should be restricted to user who originally posted the message. Even though the frontend of the app does not generate the edit link for other users, anyone is able to edit the message through a HTTP PUT -request. If you have Visual Studio Code installed, you can send the template HTTP-requests I made on the /requests folder using the rest client plugin https://marketplace.visualstudio.com/items?itemName=humao.rest-client . Otherwise you might use postman or some other program which allows the user to send HTTP-requests.

How to fix:  
Add a check in the backend to make sure the sender of the HTTP PUT-request is the same user as the original poster. There is a check commented in the backend code at /controllers/messages.js at lines 90-93 that should be sufficient.



FLAW 2: 
Description: Components with known vulnerabilities / Security misconfiguration  
Both the frontend and backend are using outdated dependencies which present security risks to the application. 

npm (backend):  
Versions prior to 16.13.3 allow a package publisher to access and modify arbitrary files on a user’s system when the package is installed. This does not affect people who are simply visiting the site, but it allows a malicious actor to distribute a version of the application which is able to harm the victim’s system when downloaded.

Mongoose (backend):  
Versions prior to 5.7.5 have a vulnerability that allows an access control bypass. If an attack injects a ‘bsontype’ attribute to a query object, Mongoose would ignore the query object, allowing the attacker access into an another user’s account or bypass the token verification during a password reset.

axios (frontend):  
Versions prior to 0.18.1 have a vulnerability that allows the application to continue accepting content after the supposed maximum content length has been exceeded. This would have allowed an attacker to cause a denial of service by crashing the application on the server

How to fix:  
Update the versions of these dependencies in the package.lock located in the root of the backend repository and at cyber_security_base_projec in the frontend repository. You can do this by simply overwriting the version numbers with versions that have fixed these flaws. Then run the npm install command.



FLAW 3:
Description: Broken Authentication  
The application permits the user to register with any kind of password, even passwords known to be weak. These passwords are especially vulnerable to automated attacks where the attackers try to bruteforce logins with known usernames and lists containing the most commonly used passwords. The application also has absolutely no precautions to prevent these automated attacks

How to fix:  
Create a password validation method in the post function in the backend at /controllers/users.js. A valid password could require criteria such as minimum length of 8 characters, contain at least one capital letter, contain at least one special character, etc..  
Although nowadays longer passwords are considered stronger, having the above requirements would be a good place to start in order to provide a better defense against automated attacks which check commonly used passwords  
One could also create functions which would prevent automated brute-force attacks, such as examples illustrated here: https://medium.com/@animirr/brute-force-protection-node-js-examples-cd58e8bd9b8d?


FLAW 4:  
Description: Cross-Site Scripting (XSS)  
For the frontend the application uses React, which is generally considered safe against XSS attacks. This is due to the fact that string variables in views are escaped automatically and event handlers are given functions instead of strings that could contain malicious code. React is not completely immune to XSS however. When viewing an individual message the site renders the message through a ‘dangerouslySetInnerHTML’ parameter in a div element (frontend at cyber_security_base_project/src/components/MessageView.js, line 21). If a malicious user would input javascript code, the site would execute it as it renders the message. You can see this in the message with the title of ‘XSS example’, assuming no other peer reviewer has edited it. Other examples of potential XSS exploits in react can be read in here https://stackoverflow.com/questions/33644499/what-does-it-mean-when-they-say-react-is-xss-protected

Fix:  
Check the input string for javascript or just use a regular paragraph element which does not allow the execution of javascript.


FLAW 5: 
Description: Sensitive data exposure / Broken authentication  
Passwords are stored as plaintext in the database. This would mean that if an attacker gained access to the application’s database, they would also be able to see every user’s password without having to resort to brute-forcing individual username and password combinations. 

How to fix:  
Hash the passwords, preferably with salt so in case a hashed password from the database is cracked, it does not compromise other identical passwords in the database. You can read more about salt here: https://en.wikipedia.org/wiki/Salt_(cryptography)
I have implemented password hashing and salting in the project code which have been commented. Creating a salted password hash can be found in the backend repository at /controllers/users.js at lines 31-35 and unhashing the password for login can be found at /controllers/login.js at lines 16-18


FLAW 6:  
Description: Sensitive data exposure / Security misconfiguration  
The file .env in the root of the backend repository contains the database link and token secret which should not be visible in a public repository. The database link allows access to the database which in combination with the above mentioned plaintext flaw, would be perilous to the users’ security.

How to fix:  
Remove the .env file from the remote repository and add it to the .gitignore file so you can have the file locally but not visible to everyone viewing the repository on github.
