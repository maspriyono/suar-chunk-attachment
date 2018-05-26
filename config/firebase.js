/*
* @Author: nshah
* @Date:   2017-09-14 23:37:12
* @Last Modified by:   nshah
* @Last Modified time: 2017-09-14 23:38:12
*/


import * as firebase from 'firebase';

const config = {
	apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};

firebase.initializeApp(config);

export default firebase;