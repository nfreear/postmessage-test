/**
 * I run in the hosting page.
 *
 * @author NDF, 18-May-2021.
 */

import { ENV } from './_env.js';

const IFRAME = document.querySelector('iframe[ src ]');
const LOG = document.querySelector('#log');
const END_REGEX = new RegExp(ENV.endPattern);

(async () => {
  try {
    const events = await messageFromIframe();

    console.debug(events);
  } catch (err) {
    console.error(err, err.event);
  }
})();

async function messageFromIframe() {
  const events = [];

  const promise = new Promise((resolve, reject) => {
    window.addEventListener('message', (event) => {
      if (event.origin !== ENV.embedOrigin) {
        const err = new Error('ERROR: suspicious cross-origin message!');
        err.event = event;
        // throw err;
        reject(err);
        return;
      }

      const { MessageId, SendTimeIso, Values } = event.data;

      log(`MessageId: <q>${MessageId}</q>, ${SendTimeIso}, ${JSON.stringify(Values)}`);

      events.push({ MessageId, SendTimeIso, Values });

      if (END_REGEX.test(MessageId)) {
        resolve(events);
      }
    });
  });

  return promise;
}

function setupIframe() {
  const embedUrl = ENV.embedOrigin + ENV.embedUrl + window.location.search;

  log(`Embed URL: ${embedUrl}`);

  IFRAME.src = embedUrl;
}

function log(message) {
  console.warn('>', message);

  LOG.innerHTML += `> ${message}\n`;
}

setupIframe();

// IFRAME.src = ENV.embedOrigin + ENV.embedUrl;
