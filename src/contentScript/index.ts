import {
  Emoji, prettifyJson, prettifyJsonClassName, ReadyStates,
} from '../constants';
import { findElements } from './elements';
import { processElement } from './process';

// The background script checks for this value so it does not insert multiple of this script.
window.PrettifyJson = window.PrettifyJson || {
  loaded: true,
  async copyElementText( target: Element ) : Promise<boolean | Record<string, any>> {
    if ( target ) {
      const element = target.closest(`.${prettifyJsonClassName}`);

      if ( element ) {
        try {
          const data = JSON.parse( element.textContent as string );
          const json = JSON.stringify( data, null, 2 );

          await navigator.clipboard.writeText( json );

          console.groupCollapsed('JSON copied to clipboard');
          console.dir( data );
          console.groupEnd();

          return data;
        } catch (error) {
          console.error(error);
        }
      }
    }

    return false;
  },
};

function info( message: string ) : void
{
  console.info(
    `%c${prettifyJson} ${message}`,
    `
      display: inline-block;
      background: linear-gradient(to bottom, #42CAF4 0%, #3CAED2 100%);
      color: #FFF;
      font-size: 1.25em;
      border-radius: .25em;
      padding: .5em 1em;
    `,
  );
}

function waitForContentLoaded(callback: () => void, checkDelay = 10) : void
{
  if (document.readyState === ReadyStates.Complete) {
    callback();

    return;
  }

  setTimeout(waitForContentLoaded, checkDelay, callback, checkDelay);
}

function looksLikeKibana() : boolean
{
  return document.querySelector('body')?.getAttribute('id') === 'kibana-body';
}

function looksLikeOpenSearch() : boolean
{
  return Boolean(document.querySelector('title')?.innerText.includes('OpenSearch'));
}

function initKibana() : void
{
  info(`initializing Kibana ${Emoji.HourGlassNotDone}`);

  const subjectsSelector: string = [
    'event',
    '@message',
    '@event.data.payload.attributes',
    '@event.eventData',
    '@event.eventParams',
    '@event.requestData',
    '@event.graphQlResponse',
    '@event.restResponse',
    '@event.msg',
    '@event.customContext.errorContext',
  ].map((subject: string): string => `tr[data-test-subj$="${subject}"]`).join(',');

  const intersection = new IntersectionObserver(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) : void => {
      entries
        .filter( entry => entry.isIntersecting )
        .forEach( entry => {
          observer.unobserve( entry.target );

          processElement( entry.target );
        });
    },
    {
      root: null,
      rootMargin: '100px 0px 100px 0px',
      threshold: 0,
    },
  );

  const mutation = new MutationObserver( (mutations: MutationRecord[]) => {
    findElements( mutations, subjectsSelector ).forEach( (element: Element) : void => {
      const span = element.querySelector('.doc-viewer-value > span');

      if ( span ) {
        intersection.observe( span );
      }
    });
  });

  mutation.observe(document, {
    subtree: true,
    attributes: true,
    attributeFilter: [ 'data-test-subj' ],
  });

  try {
    // Process any elements that are already showing.
    document.querySelectorAll(`:is(${subjectsSelector}) .doc-viewer-value > span`).forEach( span => intersection.observe( span ) );
  } catch (error) {
    // Chrome may throw an error when using ":is" since it is behind the
    // #enable-experimental-web-platform-features preference in chrome://flags.
    document.querySelectorAll(`:-webkit-any(${subjectsSelector}) .doc-viewer-value > span`).forEach( span => intersection.observe( span ) );
  }

  info(`initialized Kibana ${Emoji.Horns}`);
}

function initOpenSearch() : void
{
  info(`initializing OpenSearch ${Emoji.HourGlassNotDone}`);

  const subjectsSelector: string = [
    'event',
    'message',
    'lambda_json_blob',
    'logEvents.extractedFields.event',
    'logEvents.message',
    'data.payload.attributes',
    'eventData',
    'eventParams',
    'requestData',
    'graphQlResponse',
    'restResponse',
    'msg',
    'customContext.errorContext',
  ].map((subject: string): string => `div[data-test-subj="tableDocViewRow-${subject}-value"]`).join(',');

  const intersection = new IntersectionObserver(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) : void => {
      entries
        .filter( entry => entry.isIntersecting )
        .forEach( entry => {
          observer.unobserve( entry.target );

          processElement( entry.target );
        });
    },
    {
      root: null,
      rootMargin: '100px 0px 100px 0px',
      threshold: 0,
    },
  );

  const mutation = new MutationObserver( (mutations: MutationRecord[]) => {
    findElements( mutations, 'tr[data-test-subj="docTableDetailsRow"]').forEach( (element: Element) : void => {
      element.querySelectorAll(subjectsSelector).forEach(subject => intersection.observe(subject));
    });
  });

  mutation.observe(document, {
    subtree: true,
    attributes: true,
    childList: true,
    attributeFilter: [ 'data-test-subj' ],
  });

  try {
    // Process any elements that are already showing.
    document.querySelectorAll(`:is(${subjectsSelector})`).forEach( div => intersection.observe( div ) );
  } catch (error) {
    // Chrome may throw an error when using ":is" since it is behind the
    // #enable-experimental-web-platform-features preference in chrome://flags.
    document.querySelectorAll(`:-webkit-any(${subjectsSelector})`).forEach( div => intersection.observe( div ) );
  }

  info(`initialized OpenSearch ${Emoji.Horns}`);
}

function init() : void
{
  if ( looksLikeKibana() ) {
    initKibana();
  } else if (looksLikeOpenSearch()) {
    initOpenSearch();
  } else {
    info('This doesn\'t look like a Kibana or OpenSearch page');

    return;
  }
}

info(`content script loaded ${Emoji.ThumbsUp}`);

waitForContentLoaded( init );
