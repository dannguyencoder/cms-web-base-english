## Cloud Life Supermarket Management System (complete background management system)
React backend project: react + react-router4 + redux + antd + axios + sass
##### (In the project iteration scroll, if there is a little brother who likes this, send me a start, thank you! If you have any suggestions to modify, please pull the request or create issue.)
##### Put some pictures first
* Login page
![Login page](https://raw.githubusercontent.com/walljs/cms_community_e_commerce/master/src/assets/images/signin_page.png)
* Home
![Home](https://raw.githubusercontent.com/walljs/cms_community_e_commerce/master/src/assets/images/dashboard.png)
* User Management
![User Page] (https://raw.githubusercontent.com/walljs/cms_community_e_commerce/master/src/assets/images/users.png)
* Commodity management
![product](https://raw.githubusercontent.com/walljs/cms_community_e_commerce/master/src/assets/images/goods.png)
* Commodity secondary classification
![Product Level 2] (https://raw.githubusercontent.com/walljs/cms_community_e_commerce/master/src/assets/images/categories.png)
* Order Tracking
![Order Inquiry](https://raw.githubusercontent.com/walljs/cms_community_e_commerce/master/src/assets/images/order_query.png)
* Order delivery management
[Order Delivery Management] (https://raw.githubusercontent.com/walljs/cms_community_e_commerce/master/src/assets/images/order_dispatch.png)
* Advertising information management
![Ad Management](https://raw.githubusercontent.com/walljs/cms_community_e_commerce/master/src/assets/images/advs.png)
### 技术栈
React 16.2.0
2. react-router-dom 4.2.2 (react-router 4)
Redux
Ant-design
5. axios
6. sass
7. es6 + babel (with babel-plugin-transform-decorator-legacy decorator)

Created a project using create-react-app. The server side I wrote with springboot+mybatis, the repository address is: [server-side code] (https://github.com/dekvos123/backend_cloud_commodity)

The author wants to say: In fact, I want to use React-native to make a supermarket app, named cloud life supermarket (name is hard to listen to everyone), since there is an app, then there must be a background, this is it. Attach the app-side warehouse address: [Cloud Life app] (https://github.com/dekvos123/community_e_commerce)

### surroundings
* I use ubuntu16.04 myself, it is recommended to run under linux or mac os system
* Because the project relies on sass, if you use windows, there may be some wonderful problems.

### Project begining
1. *** First you can install yarn and use taobao registry***
```bash
Npm install -g yarn
Yarn config set registry https://registry.npm.taobao.org --global
Yarn config set disturl https://npm.taobao.org/dist --global
```
2. *** Clone the project and install the environment***
```bash
Git clone https://github.com/dekvos123/cms_community_e_commerce.git
Cd cms_community_e_commerce
Yarn
```
3. *** Direct operation ***
```bash
Npm start
```
5. *** Server listens to port 3000 and directly accesses http://localhost:3000***

### Introduction to directory structure
```js
### Introduction to directory structure
***├── config // webpack configuration file***
***├── public ***
***├── dist ***
***├── node_modules // package dependencies for the project***
***├── src // source directory ***
***│ ├── assets // store some resources and SCSS files for the project***
***│ ├── components // page component ***
***│ ├── containers // page (container) ***
***│ ├── constants // Project global configuration***
***│ ├── services // server-side interface data mapping***
***│ ├── reducers // reducers***
***│ ├── actions // actions***
***│ ├── utils // Some common tools for packaging ***
***│ ├── Routes.js // Page Routing ***
***│ ├── index.js // program entry file, loading various public components***
***├── .babelrc // babel configuration file ***
```
### Instructions for use
* Administrator default account: admin Password: admin
