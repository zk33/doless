'use strict';

export default class Http {
  static _request(method, url, params) {
    return new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();
      req.open(method, url, true);
      req.onload = () => {
        if (req.status >= 200 && req.status < 400) {
          let data;
          if (req.responseText) {
            try {
              data = JSON.parse(req.responseText);
            } catch (err) {
              //not json
              data = {};
            }
          }
          resolve(data);
        } else {
          reject({
            status: req.status
          });
        }
      }
      req.onerror = () => {
        reject({
          status: req.status
        });
      }
      if (params && typeof params === 'object') {
        params = JSON.stringify(params);
        req.setRequestHeader('Content-Type', 'application/json');
      }
      req.setRequestHeader('X-From', location.href);
      req.send(params);
    });
  }
  static get(url, params) {
    let paramStr = '';
    if (params) {
      //build get param
      let p = [];
      for (let name in params) {
        if (params.hasOwnProperty(name)) {
          p.push(encodeURIComponent(name) + "=" + encodeURIComponent(params[name]));
        }
      }
      paramStr = '?' + p.join('&');
    }
    return Http._request('GET', url + paramStr);
  }
  static post(url, params) {
    return Http._request('POST', url, params);
  }
  static patch(url, params) {
    return Http._request('PATCH', url, params);
  }
  static put(url, params) {
    return Http._request('PUT', url, params);
  }
  static delete(url) {
    return Http._request('DELETE', url);
  }
  static uploadFileToS3(file, signedReq, url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", signedReq);
      xhr.setRequestHeader('x-amz-acl', 'public-read');
      xhr.setRequestHeader('Cache-Control', 'max-age=604800'); // 7 days
      xhr.onload = function() {
        if (xhr.status === 200) {
          resolve({
            url: url
          });
        } else {
          reject({
            status: xhr.status
          });
        }
      };
      xhr.onerror = function() {
        console.log('rejected');
        reject({
          status: xhr.status
        });
      };
      xhr.send(file);
    });
  }
}
