var fetchFromApi = function(post_number) {
    var postPromise = new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('get', 'https://jsonplaceholder.typicode.com/posts/' + post_number);

        req.onload = function() {
            // 'load' triggers for 404s etc
            // so check the status
            if (req.status === 200) {
                // Resolve the promise with the response text
                resolve(req.response);
            } else {
                // Otherwise reject with the status text
                reject(Error(req.statusText));
            }
        };

        // Handle network errors
        req.onerror = function() {
            reject(Error("Network Error"));
        };

        // Make the request
        req.send();
    });
    return postPromise;
};

var post10Promise = fetchFromApi(10);
var post20Promise = fetchFromApi(20);
var post30Promise = fetchFromApi(30);
Promise.all([post10Promise, post20Promise, post30Promise])
.then(function(results) {
    console.log('All results arrived');
    for (var i = 0; i < results.length; i++) {
        console.log('====================================');
        console.log(results[i]);
        console.log('====================================');
    }
},
function(err) {
    console.error('There was error in at least one of the promises');
});
console.log('I am not waiting for posts to arrive from the API');