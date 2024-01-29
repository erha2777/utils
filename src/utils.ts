/**
 * 异步加载 script 标签
 */
export const loadAsyncJs = (src: string | string[], base = "") => {
  const run = (src: string) =>
    new Promise((res, rej) => {
      let el: any = document.querySelector(`script[src="${base + src}"]`)
      if (el && el.hasAttribute("data-loaded")) {
        return res(el)
      }
      el = document.createElement("script")
      el.src = base + src
      document.body.appendChild(el)
      el.onload = el.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState == "loaded" ||
          this.readyState == "complete"
        ) {
          el.setAttribute("data-loaded", "true")
          res(el)
        }
        this.onload = this.onreadystatechange = null
      }

      el.addEventListener("error", (event: Event) => rej(event))
      el.addEventListener("abort", (event: Event) => rej(event))
    })
  if (Array.isArray(src)) return Promise.all(src.map(run))

  return run(src)
}

/**
* 元素拖动
* el: 要拖动的元素
* adsorb: 是否吸附到宽口边缘，默认 true
* adsorbNum: 吸附数值，默认 15，0 相当于限制到窗口内无吸附效果
*/

export interface DragOptions {
  el: any
  adsorb?: boolean
  adsorbNum?: number
}
export const drag = ({ el, adsorb = true, adsorbNum = 15 }: DragOptions) => {
  el.addEventListener("mousedown", function (this: any, event: any) {
    const x = event.offsetX,
      y = event.offsetY

    const elMousemove = function (this: any, event: any) {
      let left = event.clientX - x,
        top = event.clientY - y

      if (adsorb) {
        if (left <= adsorbNum) left = 0
        if (
          left >=
          document.documentElement.clientWidth - this.offsetWidth - adsorbNum
        )
          left = document.documentElement.clientWidth - this.offsetWidth

        if (top <= adsorbNum) top = 0
        if (
          top >=
          document.documentElement.clientHeight - this.offsetHeight - adsorbNum
        )
          top = document.documentElement.clientHeight - this.offsetHeight
      }

      this.style.right = "unset"
      this.style.bottom = "unset"
      this.style.left = left + "px"
      this.style.top = top + "px"
      return false
    }

    this.addEventListener("mousemove", elMousemove)

    const mouseup = () => {
      el.removeEventListener("mousemove", elMousemove)
      document.removeEventListener("mouseup", mouseup)
      return false
    }
    document.addEventListener("mouseup", mouseup)
    return false
  })
}
// 1