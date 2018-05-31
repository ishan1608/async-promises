var fetchFromApi = function(post_number) {
    var postPromise = new Promise(function(resolve, reject) {
        // Do the usual XHR stuff
        var req = new XMLHttpRequest();
        req.open('get', 'https://jsonplaceholder.typicode.com/posts/' + post_number);

        req.onload = function() {
            // 'load' triggers for 404s etc
            // so check the status
            if (req.status === 200) {
                // NOTE: Was resolving the promise in earlier examples, but won't resolve here
                // This promise will be resolved only after ALL children promises (parallel) are done
                // Resolve the promise with the response text
                // resolve(req.response);

                // NOTE: Executing children in parallel
                var childrenPromises = [];
                for (var i = 1; i <= 5; i++) {
                    var childPostPromise = new Promise(function(childResolve, childReject) {
                        var childReq = new XMLHttpRequest();
                        childReq.open('get', 'https://jsonplaceholder.typicode.com/posts/' + (post_number + i));
                        childReq.onload = function () {
                            if (childReq.status === 200) {
                                childResolve(childReq.response);
                            } else {
                                childReject(childReq.statusText);
                            }
                        };
                        childReq.onerror = function () {
                            childReject(Error("Network Error"));
                        };
                        childReq.send();
                    });
                    childrenPromises.push(childPostPromise);
                }
                // NOTE: Waiting for all children promises to finish
                Promise.all(childrenPromises).then(function(childrenResults) {
                    console.log('All children\'s results arrived');
                    for (var i = 0; i < childrenResults.length; i++) {
                        console.log('||||||||||||||||||||||||||||||||||||');
                        console.log(childrenResults[i]);
                        console.log('||||||||||||||||||||||||||||||||||||');
                    }
                    // NOTE: resolve() needs not be called with req.response. It can be called with anything
                    resolve(req.response);
                }, function(childError) {
                    console.log('||||||||||||||||||||||||||||||||||||');
                    console.error('There was error in at least one of the children');
                    console.log('||||||||||||||||||||||||||||||||||||');
                    reject(Error('One of the children\'s promise failed'));
                });
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

var parent10Promise = fetchFromApi(10);
var parent20Promise = fetchFromApi(20);
var parent30Promise = fetchFromApi(30);


Promise.all([parent10Promise, parent20Promise, parent30Promise])
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