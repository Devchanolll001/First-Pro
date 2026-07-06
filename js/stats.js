const counters = document.querySelectorAll(".stat-box h2[data-target]");

const animateCounters = () => {

    counters.forEach(counter => {

        const target = +counter.dataset.target;

        let current = 0;

        const increment = Math.ceil(target / 100);

        const update = () => {

            current += increment;

            if(current >= target){

                counter.textContent = target.toLocaleString() + "+";

            }else{

                counter.textContent = current.toLocaleString();

                requestAnimationFrame(update);

            }

        };

        update();

    });

};

const statsSection = document.querySelector(".stats");

if (statsSection && counters.length) {
    const observer = new IntersectionObserver((entries) => {

        if(entries[0].isIntersecting){

            animateCounters();

            observer.disconnect();

        }

    });

    observer.observe(statsSection);
}
