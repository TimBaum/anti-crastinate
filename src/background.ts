chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  })
})

const YOUTUBE_URL = 'https://www.youtube.com'

chrome.webNavigation.onCompleted.addListener(async (details) => {
  const tabUrl = details.url
  if (tabUrl.startsWith(YOUTUBE_URL)) {
    await chrome.scripting.insertCSS({
      files: ['focus-mode.css'],
      target: { tabId: details.tabId },
    })
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url) return
  if (tab.url.startsWith(YOUTUBE_URL)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id })
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    })
    if (!tab.id) return
    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on
      console.log('on')
      await chrome.scripting.insertCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      })
    } else if (nextState === 'OFF') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['focus-mode.css'],
        target: { tabId: tab.id },
      })
    }
  }
})
