/* global getStudySetup */

/**
 *  Goal:  Implement an instrumented feature using
 *  `browser.study` API
 *
 *  Every runtime:
 *  - instantiate the feature
 *
 *    - listen for `onEndStudy` (study endings)
 *    - listen for `study.onReady`
 *    - attempt to `browser.study.setup` the study using our studySetup
 *
 *      - will fire EITHER endStudy (expired, ineligible)
 *      - onReady
 *      - (see docs for `browser.study.setup`)
 *
 *    - onReady: configure the feature to match the `variation` study selected
 *    - or, if we got an `onEndStudy` cleanup and uninstall.
 *
 *    During the feature:
 *    - `sendTelemetry` to send pings
 *    - `endStudy` to force an ending (for positive or negative reasons!)
 *
 *  Interesting things to try next:
 *  - `browser.study.validateJSON` your pings before sending
 *  - `endStudy` different endings in response to user action
 *  - force an override of timestamp to see an `expired`
 *  - unset the shield or telemetry prefs during runtime to trigger an ending.
 *
 */

class StudyLifeCycleHandler {
  /**
   * Listen to onEndStudy, onReady
   * `browser.study.setup` fires onReady OR onEndStudy
   *
   * call `this.enableFeature` to actually do the feature/experience/ui.
   */
  constructor() {
    // IMPORTANT:  Listen for onEndStudy first.
    browser.study.onEndStudy.addListener(this.handleStudyEnding);
    browser.study.onReady.addListener(this.enableFeature);
  }

  /**
   * Cleanup
   *
   * (If you have privileged code, you might need to clean
   *  that up as well.
   * See:  https://firefox-source-docs.mozilla.org/toolkit/components/extensions/webextensions/lifecycle.html
   *
   * @returns {undefined}
   */
  cleanup() {
    // do whatever work your addon needs to clean up
    browser.cloudstorage.cleanUpPrefs();
  }

  /**
   *
   * side effects
   * - set up expiration alarms
   * - make feature/experience/ui with the particular variation for this user.
   *
   * @param {object} studyInfo browser.study.studyInfo object
   *
   * @returns {undefined}
   */
  enableFeature(studyInfo) {
    /* if (studyInfo.timeUntilExpire) {
      browser.alarms.create(studyInfo.timeUntilExpire, () =>
        browser.study.endStudy("expired"),
      );
    } */

    try {
      let interval = 0;
      const treatment = studyInfo.variation.name;
      switch (treatment) {
      case "notification-interval-short":
        // When dismissed shows next
        // prompt after promptInterval (specified in days)
        // Update to pick from studyInfo once studyInfo has
        // studySetup object available (WIP)
        interval = 1;
        break;
      case "notification-interval-longer":
        interval = 2;
        break;
      }

      browser.cloudstorage.onRecordTelemetry.addListener(
        (payload) => {
          browser.study.sendTelemetry(payload);
        },
      );

      browser.cloudstorage.init(browser.runtime.getURL("./skin/clouddownloads.css"), interval, studyInfo.variation.name).then(
        result => {
          // browser.study.log(result);
        });
    } catch (e) {
      // browser.study.log(e);
    }
  }

  /** handles `study:end` signals
   *
   * - opens 'ending' urls (surveys, for example)
   * - calls cleanup
   *
   * @param {object} ending An ending result
   *
   * @returns {undefined}
   */
  async handleStudyEnding(ending) {
    // browser.study.log(`study wants to end:`, ending);
    //ending.urls.forEach(async url => {
      //await browser.tabs.create({ url });
    //});

    for (const url of ending.urls) {
      await browser.tabs.create({ url });
    }

    switch (ending.reason) {
    default:
      this.cleanup();
      // uninstall the addon?
      break;
    }
    // actually remove the addon.
    await browser.study.uninstall();
  }
}

/**
 * Run every startup to get config and instantiate the feature
 *
 * @returns {undefined}
 */
async function onEveryExtensionLoad() {
  new StudyLifeCycleHandler();
  const studySetup = await getStudySetup();
  await browser.study.setup(studySetup);
}
onEveryExtensionLoad();
