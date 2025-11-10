/**
 * script.js
 *    1) Ждём DOMContentLoaded — чтобы избежать ошибок типа "cannot read property".
 *    2) Инициализируем feather, мобильное меню, lazy load (IntersectionObserver),
 *       before-after sliders (drag+click+keyboard), lightbox (Esc to close).
 *
 * @format
 */

document.addEventListener("DOMContentLoaded", () => {
    // year in footer
    const yearEl = document.getElementById("year")
    if (yearEl) yearEl.textContent = new Date().getFullYear()

    // Initialize feather icons (replace must run after DOM is ready)
    if (window.feather && typeof window.feather.replace === "function") {
        try {
            window.feather.replace()
        } catch (e) {
            // если иконка не найдена, не ломаем страницу
            console.warn("feather.replace failed:", e)
        }
    }

    /* ---------- MOBILE MENU ---------- */
    const mobileBtn = document.querySelector(".mobile-menu-btn")
    const navLinks = document.querySelector(".nav-links")

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            navLinks.classList.toggle("show")
            const expanded = navLinks.classList.contains("show")
            mobileBtn.setAttribute("aria-expanded", expanded ? "true" : "false")

            // смена иконки
            const icon = mobileBtn.querySelector("i")
            if (icon) {
                icon.setAttribute("data-feather", expanded ? "x" : "menu")
                if (window.feather && typeof window.feather.replace === "function") feather.replace()
            }
        })

        // Закрыть меню при клике по ссылке (мобильная версия)
        navLinks.querySelectorAll("a").forEach((a) => {
            a.addEventListener("click", () => {
                if (navLinks.classList.contains("show")) {
                    navLinks.classList.remove("show")
                    mobileBtn.setAttribute("aria-expanded", "false")
                    const icon = mobileBtn.querySelector("i")
                    if (icon) {
                        icon.setAttribute("data-feather", "menu")
                        feather.replace()
                    }
                }
            })
        })
    }

    /* ---------- LAZY LOAD for images (IntersectionObserver) ---------- */
    ;(function initLazy() {
        const imgs = Array.from(document.querySelectorAll("img[loading='lazy']"))
        if (!imgs.length) return
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return
                        const img = entry.target
                        // Если у тебя будут data-src атрибуты — можно их подставлять здесь.
                        // Сейчас src уже указан, просто помечаем как загруженное.
                        img.classList.add("lazy-loaded")
                        obs.unobserve(img)
                    })
                },
                { rootMargin: "100px 0px" }
            )
            imgs.forEach((i) => io.observe(i))
        } else {
            // fallback: ничего не делаем — браузер сам загрузит
        }
    })()

    /* ---------- LIGHTBOX (simple) ---------- */
    ;(function initLightbox() {
        const galleryImgs = Array.from(
            document.querySelectorAll(".gallery-item img, .before-after-slider img")
        )
        if (!galleryImgs.length) return

        // Создаём один lightbox-элемент
        const lightbox = document.createElement("div")
        lightbox.id = "lightbox"
        lightbox.setAttribute("role", "dialog")
        lightbox.setAttribute("aria-modal", "true")
        lightbox.style.display = "none"
        const lbImg = document.createElement("img")
        lightbox.appendChild(lbImg)
        document.body.appendChild(lightbox)

        function open(src, alt = "") {
            lbImg.src = src
            lbImg.alt = alt
            lightbox.style.display = "flex"
            document.body.style.overflow = "hidden"
            lightbox.focus()
        }

        function close() {
            lightbox.style.display = "none"
            lbImg.src = ""
            document.body.style.overflow = ""
        }

        galleryImgs.forEach((img) => {
            img.style.cursor = "zoom-in"
            img.addEventListener("click", (e) => {
                e.preventDefault()
                open(img.src, img.alt || "")
            })
        })

        lightbox.addEventListener("click", (e) => {
            // click outside image closes
            if (e.target === lightbox) close()
        })

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.style.display === "flex") close()
        })
    })()

    /* ---------- BEFORE/AFTER SLIDERS (drag + click + keyboard) ---------- */
    ;(function initBeforeAfter() {
        const sliders = Array.from(document.querySelectorAll(".before-after-slider"))
        if (!sliders.length) return

        sliders.forEach((slider) => {
            const overlay = slider.querySelector(".ba-overlay")
            const handle = slider.querySelector(".ba-handle")
            const hint = slider.querySelector(".ba-hint")
            const beforeImg = slider.querySelector(".ba-before")
            const afterImg = slider.querySelector(".ba-after")

            // set initial
            const initial = parseFloat(slider.getAttribute("data-initial")) || 50
            const setPos = (pct) => {
                pct = Math.max(0, Math.min(100, pct))
                overlay.style.width = pct + "%"
                // place handle visually
                handle.style.left = `calc(${pct}% - ${handle.offsetWidth / 2}px)`
                // also clip after image using overlay width with clip-path for smoother rendering
                afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`
            }
            // Wait for images to have size
            const onResize = () => setPos(initial)
            window.addEventListener("resize", onResize)
            // initial position (delay to allow layout)
            setTimeout(() => setPos(initial), 50)

            // dragging state
            let dragging = false

            const getPctFromEvent = (e) => {
                const rect = slider.getBoundingClientRect()
                const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX
                let x = clientX - rect.left
                let pct = (x / rect.width) * 100
                return Math.max(0, Math.min(100, pct))
            }

            // pointer start
            const start = (e) => {
                e.preventDefault()
                dragging = true
                slider.classList.add("dragging")
            }
            const move = (e) => {
                if (!dragging) return
                const pct = getPctFromEvent(e)
                setPos(pct)
            }
            const end = () => {
                if (!dragging) return
                dragging = false
                slider.classList.remove("dragging")
            }

            // Events
            handle.addEventListener("mousedown", start)
            handle.addEventListener("touchstart", start, { passive: false })
            window.addEventListener("mousemove", move)
            window.addEventListener("touchmove", move, { passive: false })
            window.addEventListener("mouseup", end)
            window.addEventListener("touchend", end)

            // Click on slider toggles between 100% and 0% intelligently
            slider.addEventListener("click", (e) => {
                // don't fire when clicking handle (handled by drag)
                if (e.target === handle) return
                const pct = getPctFromEvent(e)
                // If click > current => open more, else close more. Simple toggle: near center toggle to full after
                const current = parseFloat(overlay.style.width) || initial
                const target = current < 90 ? 100 : 50
                setPos(target)
            })

            // Keyboard accessibility: left/right arrows move slider
            slider.addEventListener("keydown", (e) => {
                const step = 8
                let curr = parseFloat(overlay.style.width) || initial
                if (e.key === "ArrowLeft") {
                    setPos(curr - step)
                    e.preventDefault()
                }
                if (e.key === "ArrowRight") {
                    setPos(curr + step)
                    e.preventDefault()
                }
                if (e.key === "Home") {
                    setPos(0)
                    e.preventDefault()
                }
                if (e.key === "End") {
                    setPos(100)
                    e.preventDefault()
                }
            })

            // show / hide hint on pointerenter/leave for desktop
            slider.addEventListener("pointerenter", () => {
                if (!hint) return
                hint.style.opacity = 1
                hint.style.transform = "translateY(0)"
            })

            slider.addEventListener("pointerleave", () => {
                if (!hint) return
                hint.style.opacity = 0
                hint.style.transform = "translateY(6px)"
            })

            // Ensure handle positioned if its width loads later
            setTimeout(() => setPos(initial), 120)
        })
    })()
})
