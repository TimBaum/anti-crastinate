import { setShortsVisibility } from "./shorts"

async function isExtensionActivated(): Promise<Boolean> {
  const result = await chrome.storage.local.get(['isActivated'])
  return result.isActivated
}

async function hideShorts(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: setShortsVisibility,
    args: [false]
  })
}

async function showShorts(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: setShortsVisibility,
    args: [true]
  })
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  })
  chrome.storage.local.set({ isActivated: false })
})

const YOUTUBE_URL = 'https://www.youtube.com'

chrome.webNavigation.onCompleted.addListener(async (details) => {
  const tabUrl = details.url
  if (!tabUrl.startsWith(YOUTUBE_URL)) return

  const isActivated = await isExtensionActivated()
  if (!isActivated) return

  hideShorts(details.tabId)
})

chrome.action.onClicked.addListener(async (tab) => {
  const isActivated = await isExtensionActivated()
  chrome.storage.local.set({ isActivated: !isActivated })
  chrome.action.setBadgeText({
    text: isActivated ? 'OFF' : 'ON',
  })
  if (!tab.id) return
  if (!isActivated) {
    hideShorts(tab.id)
  } else {
    showShorts(tab.id)
  }
})
