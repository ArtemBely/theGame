window.addEventListener("load", () => {
  document.querySelector(".load-wrap").classList.add("loaded");
}),
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  }),
(function () {
    const e = document.querySelector(".wrap_spaces"),
        t = document.querySelector(".computers");
    window.addEventListener("scroll", function () {
        let o = e.offsetTop;
        console.log(o)
        t.style.left = `-${o / 2}px`;
    });
})(),
(window.onscroll = function () {
    const e = document.querySelector(".wrap_imgs1"),
        t = e.getBoundingClientRect();
    let o = Math.floor(window.innerHeight - t.top);
    o < 0 && (o = 0), (e.style.transform = `translateX(-${o / 30}%)`);
}),
(function () {
    const e = document.querySelector(".neon_txt");
    new IntersectionObserver(
        (e, t) => {
            e.forEach((e) => {
                e.isIntersecting ? e.target.classList.add("neon_text_active") : e.target.classList.remove("neon_text_active");
            });
        },
        { rootMargin: "0px 0px -100px 0px", threshold: 1 }
    ).observe(e);
})(),
(function () {
    const e = document.querySelector(".wrap_popcorn"),
        t = document.querySelector("#cola");
    new IntersectionObserver(
        (t) => {
            t.forEach((t) => {
                t.isIntersecting && !e.classList.contains("js-popcorn-active") && e.classList.add("js-popcorn-active");
            });
        },
        { threshold: 0 }
    ).observe(t);
})(),
(function () {
    const e = document.querySelector(".packages-bg"),
        t = document.querySelector(".packages-table");
    new IntersectionObserver(
        (t) => {
            t.forEach((t) => {
                t.isIntersecting ? (e.classList.add("rotated")) : e.classList.remove("rotated");
            });
        },
        { threshold: 0.5 }
    ).observe(t);
})(),
(function () {
    const e = document.querySelector(".fithScreen");
    new IntersectionObserver(
        (t) => {
            t.forEach((t) => {
                (e.offsetWidth < 400) & t.isIntersecting && e.classList.add("fifthScreen-expanded");
            });
        },
        { threshold: 0.5 }
    ).observe(e);
})(),
(function () {
    function stopableEventListener(e, t, r) {
        e.addEventListener(t, r)
        return function () {
            e.removeEventListener(t, r);
        }
    }
    function emberTranslate () {
        const ember1 = document.querySelector('#ember1'),
              ember2 = document.querySelector('#ember2')
        ember1.style.transform = 'translateX(20%)'
        ember2.style.transform = 'translateX(30%)'
    }
    const emberAnimation = stopableEventListener(window, 'scroll', () => {
        const hookah = document.querySelector('.seventhScreen')
        const hookahRect = hookah.getBoundingClientRect();
        if(hookahRect.top <= window.innerHeight / 2) {
            emberTranslate()
            emberAnimation();
        }
    })
})()
