export function extractContentFromHtmlString(htmlStr: string) {
  var span = document.createElement("span");
  span.innerHTML = htmlStr;
  return span.textContent || span.innerText;
}
