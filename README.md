# shield-cloudstorage
Cloud storage Shield Study WebExtension Experiment

## Setup

1. Get Firefox >=60
2. Install shield-utils in extension

  ```
  npm install --save mozilla/shield-studies-addon-utils#develop
  npm run postinstall
  ```

3. Install

  ```
  npm install -g web-ext  # just make it global!
  npm run firefox
  ```

## pre-requisite
- Desktop with cloud storage provider client such as [Dropbox](https://www.dropbox.com/install)

## in Firefox:

1. `tools > Web Developer > Browser Console`
2. Open link e.g. https://www.mozilla.org/en-US/firefox/all/
3. Click on any download link. Notification shows inside Download Panel
4. If Cloud Storage API has never been initialized before first download initializes API and subsequent downloads shows notification.
5. Right click on the downloaded item, shows 'Move to <provider>' option in context menu for default downloads e.g. ~/Downloads

## Results/ Effects:

1. Click on Download link shows notification asking user to opt-in to cloud storage
2. Result expected with different options selected in notification
* Save to provider app -  Save all subsequent download to provider local download folder e.g. ~/Dropbox/Downloads. This sets 'cloud.services.storage.key' pref to provider key and 'browser.download.folderList' pref to value 3. In about:prefernces under Downloads a third radio option displays indicating user opted-in setting.

* Not Now - Closes Notification to be shown after a configurable interval

3. cloud.services.prompt.interval pref sets the interval at which user should be prompted again.

4. Downloaded item in cloud provider folder will be marked with provider icon in Download history shown in Download panel and Tools -> Downloads

5. For system default downloads in download panel, selecting context menu option 'Move to <provider>' moves download in provider folder


## Shield Study Variations:
In this shield study, we have two experimental branches based on notification interval times. Planning to experiment with three groups
1. Control group (no cloud storage feature)
2. notification-interval-longer - Cohort that’s shown notification in download panel after 2 days interval (since last notification shown and dismissed by clicking button Not Now)
3. notification-interval-short - Cohort that’s shown notification after shorter interval - 1 day

To force override a variation, set preference 'cloud.services.shield.variation' with the variation name

## Telemetry
* [See Telemetry.json](docs/telemetry.json) for more details on what pings are sent by this extension.

## Helpful links
* [Bug 1441949](https://bugzilla.mozilla.org/show_bug.cgi?id=1441949)
* [Bug 1447521](https://bugzilla.mozilla.org/show_bug.cgi?id=1447521)
* [Bug 1450016](https://bugzilla.mozilla.org/show_bug.cgi?id=1450016)
* [Mockups](https://mozilla.invisionapp.com/share/PKFN61KFZ25#/screens/290895622)
