'use strict';

const ElementUtil = require('../utils/ElementUtil');

/*
 * スクロールした時に上（など）に固定される部分を作るユーティリティ的な何か
 */

const STICKY_CLASS_NAME = 'mode-stick';
const STICKY_UP_CLASS_NAME = 'mode-stick-up';
const STICKY_DOWN_CLASS_NAME = 'mode-stick-down';
const STICKY_DOWN_TO_UP_CLASS_NAME = 'mode-stick-down2up';
const STICKY_UP_TO_DOWN_CLASS_NAME = 'mode-stick-up2down';

const isStickTop = (wrapElm) => {
  return wrapElm.getBoundingClientRect().top < 0;
}
const isSticBottom = (wrapElm) => {
  return wrapElm.getBoundingClientRect().top > window.innerHeight;
}

export default class Sticky {
  static stick(wrapElm, contentElm, stickToBottom) {
    let prevY = 0;
    let upTimeoutId,downTimeoutId;
    let isSticked = stickToBottom ? isSticBottom : isStickTop;
    let currentDirection = 'up';
    let onScroll = (e) => {
      if (isSticked(wrapElm)) {
        wrapElm.style.height = contentElm.getBoundingClientRect().height + 'px';
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > prevY) {
          if(downTimeoutId){
            return;
          }
          //下方向のスクロール
          ElementUtil.addClass(wrapElm, STICKY_CLASS_NAME);
          ElementUtil.removeClass(wrapElm, STICKY_UP_CLASS_NAME);
          ElementUtil.addClass(wrapElm, STICKY_DOWN_CLASS_NAME);
          if (currentDirection === 'up') {
            //切り替わった時だけ
            ElementUtil.addClass(wrapElm, STICKY_UP_TO_DOWN_CLASS_NAME);
            setTimeout(() => {
              ElementUtil.removeClass(wrapElm, STICKY_UP_TO_DOWN_CLASS_NAME);
            }, 400);
          }
          currentDirection = 'down';
          downTimeoutId = setTimeout(() => {
            downTimeoutId = null;
          }, 400);
        } else if (scrollTop < prevY) {
          if(upTimeoutId){
            return;
          }
          //上方向のスクロール
          ElementUtil.addClass(wrapElm, STICKY_CLASS_NAME);
          ElementUtil.addClass(wrapElm, STICKY_UP_CLASS_NAME);
          ElementUtil.removeClass(wrapElm, STICKY_DOWN_CLASS_NAME);
          if (currentDirection === 'down') {
            //切り替わった時だけ
            ElementUtil.addClass(wrapElm, STICKY_DOWN_TO_UP_CLASS_NAME);
            setTimeout(() => {
              ElementUtil.removeClass(wrapElm, STICKY_DOWN_TO_UP_CLASS_NAME);
            }, 400);
          }
          currentDirection = 'up';
          upTimeoutId = setTimeout(() => {
            upTimeoutId = null;
          }, 400);
        }
        prevY = scrollTop;
      } else {
        wrapElm.style.height = null;
        ElementUtil.removeClass(wrapElm, STICKY_CLASS_NAME);
        ElementUtil.removeClass(wrapElm, STICKY_UP_CLASS_NAME);
        ElementUtil.removeClass(wrapElm, STICKY_DOWN_CLASS_NAME);
        prevY = 0;
        currentDirection = '';
      }

    }
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
  }
}
