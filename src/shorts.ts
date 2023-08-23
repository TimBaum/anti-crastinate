export function setShortsVisibility(visible: boolean) {
  const cssDisplayAttribute = visible ? 'block' : 'none'

  // Find all div elements that have the class ytd-rich-shelf-renderer
  const contentHolders = document.querySelectorAll('ytd-rich-section-renderer')

  // Loop through each div element
  contentHolders.forEach((element) => {

    const contentHolder = element as HTMLElement;

    // Find descendants of the current div element
    const descendants = contentHolder.querySelectorAll('*')

    // Use traditional for loop to be able to use break statement
    for (let i = 0; i < descendants.length; i++) {
      const descendant = descendants[i]

      if (descendant.innerHTML.includes('Shorts')) {
        contentHolder.style.display = cssDisplayAttribute
        break
      }
    }
  })
}
