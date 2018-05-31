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

fetchFromApi(10).then(function(result) {
    console.log('====================================');
    console.log('Response for 10');
    console.log(result);
    console.log('====================================');
}, function(err) {
    console.log('====================================');
    console.error('Error for 10');
    console.error(err);
    console.log('====================================');
});

console.log('I am not waiting for posts to arrive from the API');