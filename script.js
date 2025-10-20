/** @format */

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault()
        const targetId = this.getAttribute("href")
        if (targetId === "#") return
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: "smooth",
            })
        }
    })
})

// Lazy loading images
document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = [].slice.call(document.querySelectorAll('img[loading="lazy"]'))
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target
                    lazyImage.src = lazyImage.dataset.src || lazyImage.src
                    lazyImage.classList.remove("lazy")
                    lazyImageObserver.unobserve(lazyImage)
                }
            })
        })
        lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage)
        })
    }
})

// Before-After Sliders
document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll(".before-after-slider")
    sliders.forEach((slider) => {
        const overlay = slider.querySelector(".before-after-overlay")
        const handle = slider.querySelector(".slider-handle")
        const arrow = slider.querySelector(".slider-arrow")
        let isDragging = false

        const moveSlider = (e) => {
            if (!isDragging) return
            const rect = slider.getBoundingClientRect()
            let x = e.clientX - rect.left
            if (e.touches) x = e.touches[0].clientX - rect.left
            x = Math.max(0, Math.min(x, rect.width))
            const percentage = (x / rect.width) * 100
            overlay.style.width = `${percentage}%`
            handle.style.left = `${percentage}%`
            arrow.style.left = `${percentage}%`
        }

        slider.addEventListener("mousedown", () => {
            isDragging = true
        })
        slider.addEventListener("touchstart", () => {
            isDragging = true
        })
        document.addEventListener("mousemove", moveSlider)
        document.addEventListener("touchmove", moveSlider, { passive: false })
        document.addEventListener("mouseup", () => {
            isDragging = false
        })
        document.addEventListener("touchend", () => {
            isDragging = false
        })
    })
})

// Lightbox functionality
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll("#gallery img, .before-after-slider img")
    const lightbox = document.createElement("div")
    lightbox.id = "lightbox"
    lightbox.style.display = "none" // Гарантируем, что Lightbox скрыт изначально
    lightbox.style.position = "fixed"
    lightbox.style.top = "0"
    lightbox.style.left = "0"
    lightbox.style.width = "100%"
    lightbox.style.height = "100%"
    lightbox.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
    lightbox.style.zIndex = "1000"
    lightbox.style.display = "flex"
    lightbox.style.alignItems = "center"
    lightbox.style.justifyContent = "center"
    lightbox.style.cursor = "zoom-out"

    const img = document.createElement("img")
    img.style.maxHeight = "90%"
    img.style.maxWidth = "90%"
    img.style.objectFit = "contain"

    lightbox.appendChild(img)
    document.body.appendChild(lightbox)

    // Убедись, что Lightbox не открывается автоматически
    images.forEach((image) => {
        image.addEventListener("click", (e) => {
            e.preventDefault() // Предотвращаем нежелательные действия
            img.src = image.src
            img.alt = image.alt
            lightbox.style.display = "flex"
            document.body.style.overflow = "hidden"
            console.log("Lightbox opened for image:", image.src) // Лог для дебага
        })
    })

    lightbox.addEventListener("click", () => {
        lightbox.style.display = "none"
        document.body.style.overflow = "auto"
        console.log("Lightbox closed") // Лог для дебага
    })

    // Предотвращаем контекстное меню (ПКМ) от вызова Lightbox
    lightbox.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        lightbox.style.display = "none"
        document.body.style.overflow = "auto"
    })

    // Дополнительная проверка на загрузке страницы
    window.addEventListener("load", () => {
        if (lightbox.style.display === "flex") {
            console.warn("Lightbox was visible on page load, hiding now")
            lightbox.style.display = "none"
            document.body.style.overflow = "auto"
        }
    })
})
