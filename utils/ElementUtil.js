'use strict';

export default class ElementUtil {
  static hasClass(elm, className) {
    if (!elm) {
      return;
    }
    if (elm.classList) {
      return elm.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(elm.className);
    }
  }
  static addClass(elm, className) {
    if (!elm) {
      return;
    }
    if (!ElementUtil.hasClass(elm, className)) {
      if (elm.classList) {
        elm.classList.add(className);
      } else {
        elm.className += ' ' + className;
      }
    }
  }
  static removeClass(elm, className) {
    if (!elm) {
      return;
    }
    if (ElementUtil.hasClass(elm, className)) {
      if (elm.classList) {
        elm.classList.remove(className);
      } else {
        elm.className = elm.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    }
  }
  static toggleClass(elm, className) {
    if (!elm) {
      return;
    }
    if (ElementUtil.hasClass(elm, className)) {
      ElementUtil.removeClass(elm, className);
    } else {
      ElementUtil.addClass(elm, className);
    }
  }
  static isVisible(elm) {
    if (!elm) {
      return false;
    }
    return !!(elm.offsetWidth || elm.offsetHeight || elm.getClientRects().length);
  }
  static triggerEvent(elm, eventName) {
    let e = document.createEvent('Event');
    e.initEvent(eventName, true, true);
    elm.dispatchEvent(e);
  }
}
