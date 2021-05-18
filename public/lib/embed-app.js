/**
 * I run in the embedded page.
 *
 * @author NDF, 18-May-2021.
 * @see https://wopi.readthedocs.io/en/latest/scenarios/postmessage.html
 */

import { ENV } from './_env.js';

setTimeout(() => {
  let count = 0;

  if (hasParam(/\?error=/)) {
    messageToParent('error');
    dot();
    return;
  }

  const interval = setInterval(() => {
    if (count >= ENV.limit) {
      clearInterval(interval);

      if (hasParam(/\?incomplete=/)) {
        messageToParent('incomplete');
      } else {
        messageToParent('complete');
      }
    } else {
      count++;

      messageToParent('activity', { count });
    }
    dot();
  },
  ENV.delayMs);

  messageToParent('ready');

  dot();
},
ENV.delayMs);

// ------------------------------

function messageToParent(MessageId, Values = { test: true }) {
  const PARENT = window.parent;
  const targetOrigin = ENV.targetOrigin;

  document.body.classList.add(MessageId);

  PARENT.postMessage(
    {
      MessageId,
      SendTime: Date.now(),
      SendTimeIso: new Date().toISOString(),
      Values,
    },
    targetOrigin
  );
}

function hasParam(regex) {
  return regex.test(window.location.href);
}

function dot () {
  const DOT = document.querySelector('#dot');
  DOT.textContent += '● '; // &#9679; // · &middot;
}
