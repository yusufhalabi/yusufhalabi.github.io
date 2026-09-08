(function () {
    "use strict";

    const chapters = [
        {
            city: "Northville",
            region: "Michigan",
            date: "September 20, 2002 — 2015",
            duration: "≈13 years here",
            months: 156,
            note: "Born here on September 20, 2002.",
            lat: 42.4311,
            lon: -83.4833,
            scale: 7.2
        },
        {
            city: "Mountain View",
            region: "California",
            date: "2015 — August 2020",
            duration: "≈5 years here",
            months: 60,
            note: "California became home.",
            lat: 37.3861,
            lon: -122.0839,
            scale: 7.6
        },
        {
            city: "Ann Arbor",
            region: "Michigan",
            date: "September — December 2020",
            duration: "4 months here",
            months: 4,
            note: "First semester at Michigan.",
            lat: 42.2808,
            lon: -83.743,
            scale: 8.2
        },
        {
            city: "Hanalei",
            region: "Kauaʻi, Hawaiʻi",
            date: "January — May 2021",
            duration: "4 months here",
            months: 4,
            note: "College, from Kauaʻi.",
            lat: 22.2038,
            lon: -159.4977,
            scale: 8.4
        },
        {
            city: "Mountain View",
            region: "California",
            date: "Summer 2021",
            duration: "3 months here",
            months: 3,
            note: "Home for the summer.",
            lat: 37.3861,
            lon: -122.0839,
            scale: 7.6
        },
        {
            city: "Ann Arbor",
            region: "Michigan",
            date: "September 2021 — May 2022",
            duration: "9 months here",
            months: 9,
            note: "Back for sophomore year.",
            lat: 42.2808,
            lon: -83.743,
            scale: 8.2
        },
        {
            city: "San Francisco",
            region: "California",
            date: "Summer 2022",
            duration: "3 months here",
            months: 3,
            note: "A summer internship in the city.",
            lat: 37.7749,
            lon: -122.4194,
            scale: 8.2
        },
        {
            city: "Ann Arbor",
            region: "Michigan",
            date: "September — December 2022",
            duration: "4 months here",
            months: 4,
            note: "Back for junior year.",
            lat: 42.2808,
            lon: -83.743,
            scale: 8.2
        },
        {
            city: "Amman",
            region: "Jordan",
            date: "January — May 2023",
            duration: "4 months here",
            months: 4,
            note: "Four months studying Arabic.",
            lat: 31.9539,
            lon: 35.9106,
            scale: 8.1
        },
        {
            city: "Hinsdale",
            region: "Illinois",
            date: "Summer 2023",
            duration: "3 months here",
            months: 3,
            note: "The first summer at my family’s new home.",
            lat: 41.8009,
            lon: -87.937,
            scale: 8.4
        },
        {
            city: "Ann Arbor",
            region: "Michigan",
            date: "September 2023 — May 2024",
            duration: "9 months here",
            months: 9,
            note: "One last year, then graduation.",
            lat: 42.2808,
            lon: -83.743,
            scale: 8.2
        },
        {
            city: "Hinsdale",
            region: "Illinois",
            date: "May 2024 — Fall 2024",
            duration: "≈4–5 months here",
            months: 5,
            note: "Home after college.",
            lat: 41.8009,
            lon: -87.937,
            scale: 8.4
        },
        {
            city: "Williamsburg",
            region: "Brooklyn, New York",
            date: "Fall 2024",
            duration: "1 month here",
            months: 1,
            note: "A month in Brooklyn for a new job.",
            lat: 40.7081,
            lon: -73.9571,
            scale: 9
        },
        {
            city: "Hinsdale",
            region: "Illinois",
            date: "Fall 2024 — April 2025",
            duration: "≈5–6 months here",
            months: 6,
            note: "Back home through the winter.",
            lat: 41.8009,
            lon: -87.937,
            scale: 8.4
        },
        {
            city: "San Francisco",
            region: "California",
            date: "Since April 2025",
            duration: currentDuration(),
            months: monthsSinceApril2025(),
            note: "Moved west in April 2025. Here now.",
            lat: 37.7749,
            lon: -122.4194,
            scale: 8.2
        }
    ];

    const journey = document.getElementById("journey");
    const intro = document.getElementById("intro");
    const map = document.getElementById("map");
    const mapPlane = document.getElementById("map-plane");
    const mapLand = document.getElementById("map-land");
    const mapGraticule = document.getElementById("map-graticule");
    const mapRoutes = document.getElementById("map-routes");
    const mapPoints = document.getElementById("map-points");
    const mapCoordinate = document.getElementById("map-coordinate");
    const mapStatus = document.getElementById("map-status");
    const progressLabel = document.getElementById("journey-progress");
    const chapterCopy = document.getElementById("chapter-copy");
    const chapterDate = document.getElementById("chapter-date");
    const chapterCity = document.getElementById("chapter-city");
    const chapterRegion = document.getElementById("chapter-region");
    const chapterDuration = document.getElementById("chapter-duration");
    const chapterNote = document.getElementById("chapter-note");
    const announcement = document.getElementById("journey-announcement");
    const startButton = document.getElementById("start-button");
    const replayButton = document.getElementById("replay-button");
    const previousButton = document.getElementById("previous-button");
    const playButton = document.getElementById("play-button");
    const nextButton = document.getElementById("next-button");
    const scrubber = document.getElementById("scrubber");
    const scrubberProgress = document.getElementById("scrubber-progress");
    const scrubberTicks = document.getElementById("scrubber-ticks");
    const scrubberPlace = document.getElementById("scrubber-place");
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const SVG_NS = "http://www.w3.org/2000/svg";
    const sceneDuration = 2800;
    const reducedSceneDuration = 4500;
    const state = {
        started: false,
        playing: false,
        complete: false,
        index: -1,
        transitionToken: 0,
        advanceTimer: null,
        transitionTimers: [],
        worldWidth: 0,
        worldHeight: 0,
        worldLeft: 0,
        worldTop: 0
    };

    buildGraticule();
    buildScrubberTicks();
    layoutMap();
    renderMapState(0, -1, false, true);
    setCamera(chapters[0], 1.45, 0);
    loadLand();

    startButton.addEventListener("click", startJourney);
    replayButton.addEventListener("click", replayJourney);
    previousButton.addEventListener("click", showPrevious);
    playButton.addEventListener("click", togglePlayback);
    nextButton.addEventListener("click", showNext);
    scrubber.addEventListener("input", seekJourney);
    document.addEventListener("keydown", handleKeyboard);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", debounce(layoutCurrentMap, 100));
    reduceMotionQuery.addEventListener?.("change", layoutCurrentMap);

    function startJourney() {
        if (state.started) {
            return;
        }

        state.started = true;
        journey.classList.add("has-started");
        intro.setAttribute("aria-hidden", "true");
        window.setTimeout(function () {
            intro.inert = true;
            startButton.tabIndex = -1;
        }, 160);
        previousButton.disabled = true;
        playButton.disabled = false;
        nextButton.disabled = false;
        scrubber.disabled = false;
        setPlaying(true);
        goToChapter(0, { previousIndex: -1 });
    }

    function replayJourney() {
        journey.classList.remove("is-complete");
        state.complete = false;
        setPlaying(true);
        goToChapter(0, { previousIndex: state.index });
    }

    function togglePlayback() {
        if (!state.started) {
            startJourney();
            return;
        }

        if (state.complete || state.index === chapters.length - 1) {
            replayJourney();
            return;
        }

        setPlaying(!state.playing);
        if (state.playing) {
            scheduleAdvance();
        }
    }

    function showPrevious() {
        if (state.index <= 0) {
            return;
        }
        const previousIndex = state.index;
        goToChapter(state.index - 1, { previousIndex });
    }

    function showNext() {
        if (state.index >= chapters.length - 1) {
            finishJourney();
            return;
        }
        const previousIndex = state.index;
        goToChapter(state.index + 1, { previousIndex });
    }

    function seekJourney(event) {
        const target = Number(event.target.value);
        if (!Number.isInteger(target) || target === state.index) {
            return;
        }
        const previousIndex = state.index;
        goToChapter(target, { previousIndex });
    }

    function goToChapter(targetIndex, options) {
        const nextIndex = clamp(targetIndex, 0, chapters.length - 1);
        const previousIndex = options?.previousIndex ?? state.index;
        const chapter = chapters[nextIndex];

        clearAdvanceTimer();
        clearTransitionTimers();
        state.transitionToken += 1;
        state.index = nextIndex;
        state.complete = false;
        journey.classList.remove("is-complete");
        chapterCopy.classList.remove("is-visible");

        updateProgress(chapter, nextIndex);
        animateMap(previousIndex, nextIndex);
        scheduleCopyUpdate(chapter, nextIndex);
        updateControls();

        if (state.playing) {
            scheduleAdvance();
        } else if (nextIndex === chapters.length - 1) {
            const completionDelay = reduceMotionQuery.matches ? 100 : 1570;
            addTransitionTimer(window.setTimeout(finishJourney, completionDelay));
        }
    }

    function scheduleCopyUpdate(chapter, chapterIndex) {
        const token = state.transitionToken;
        const delay = reduceMotionQuery.matches ? 0 : 1030;
        addTransitionTimer(window.setTimeout(function () {
            if (token !== state.transitionToken) {
                return;
            }

            chapterDate.textContent = chapter.date;
            chapterCity.textContent = chapter.city;
            chapterRegion.textContent = chapter.region;
            chapterDuration.textContent = chapter.duration;
            chapterNote.textContent = chapter.note;
            scrubberPlace.textContent = chapter.city;
            mapCoordinate.textContent = formatCoordinate(chapter.lat, chapter.lon);
            map.setAttribute(
                "aria-label",
                `World map centered on ${chapter.city}, ${chapter.region}. ${chapter.date}. ${chapter.duration}.`
            );

            requestAnimationFrame(function () {
                if (token === state.transitionToken) {
                    chapterCopy.classList.add("is-visible");
                }
            });

            announcement.textContent = `Chapter ${chapterIndex + 1} of ${chapters.length}. ${chapter.city}, ${chapter.region}. ${chapter.date}. ${chapter.duration}. ${chapter.note}`;
        }, delay));
    }

    function animateMap(previousIndex, nextIndex) {
        const chapter = chapters[nextIndex];
        const previousChapter = previousIndex >= 0 ? chapters[previousIndex] : null;
        const movingForward = nextIndex > previousIndex;
        const reducedMotion = reduceMotionQuery.matches;

        renderMapState(nextIndex, previousIndex, movingForward, false);

        if (reducedMotion) {
            setCamera({ lat: 0, lon: 0 }, 1.08, 0);
            resolveCurrentPoint(0);
            drawCurrentRoute(0);
            return;
        }

        if (!previousChapter) {
            setCamera(chapter, chapter.scale, 1260);
        } else if (distanceInKilometers(previousChapter, chapter) > 1200) {
            const midpoint = geographicMidpoint(previousChapter, chapter);
            setCamera(midpoint, 1.18, 520);
            addTransitionTimer(window.setTimeout(function () {
                setCamera(chapter, chapter.scale, 740);
            }, 520));
        } else {
            setCamera(chapter, chapter.scale, 900);
        }

        drawCurrentRoute(220);
        resolveCurrentPoint(920);
    }

    function renderMapState(targetIndex, previousIndex, movingForward, isEntry) {
        mapRoutes.replaceChildren();
        mapPoints.replaceChildren();

        for (let routeIndex = 1; routeIndex <= targetIndex; routeIndex += 1) {
            const from = project(chapters[routeIndex - 1]);
            const to = project(chapters[routeIndex]);
            const path = createSvg("path");
            path.setAttribute("class", "map__route");
            path.setAttribute("d", routePath(from, to));
            path.dataset.routeIndex = String(routeIndex);
            mapRoutes.appendChild(path);

            if (movingForward && routeIndex === targetIndex) {
                const length = path.getTotalLength();
                path.style.strokeDasharray = `${length}`;
                path.style.strokeDashoffset = `${length}`;
            }
        }

        const finalScale = isEntry ? 1.45 : (reduceMotionQuery.matches ? 1.08 : chapters[targetIndex].scale);
        for (let pointIndex = 0; pointIndex <= targetIndex; pointIndex += 1) {
            const pointChapter = chapters[pointIndex];
            const projectedPoint = project(pointChapter);
            const group = createSvg("g");
            const ring = createSvg("circle");
            const point = createSvg("circle");
            const title = createSvg("title");
            const isCurrent = pointIndex === targetIndex;
            const shouldArrive = isCurrent && !isEntry;
            const ringPixels = clamp(14 + 7 * Math.log(1 + pointChapter.months), 22, 54);
            const pointPixels = isCurrent ? 6 : 3.5;
            const svgPixels = state.worldWidth ? state.worldWidth / 1000 : 1;

            group.setAttribute(
                "class",
                `map__point-group${isCurrent ? " is-current" : ""}${shouldArrive ? " is-arriving" : ""}`
            );
            group.dataset.pointIndex = String(pointIndex);

            ring.setAttribute("class", "map__point-ring");
            ring.setAttribute("cx", projectedPoint.x);
            ring.setAttribute("cy", projectedPoint.y);
            ring.setAttribute("r", String(ringPixels / (finalScale * svgPixels)));

            point.setAttribute("class", "map__point");
            point.setAttribute("cx", projectedPoint.x);
            point.setAttribute("cy", projectedPoint.y);
            point.setAttribute("r", String(pointPixels / (finalScale * svgPixels)));
            title.textContent = `${pointChapter.city}, ${pointChapter.region} — ${pointChapter.date}`;

            group.append(ring, point, title);
            mapPoints.appendChild(group);
        }

        if (movingForward && targetIndex > 0) {
            const currentRoute = mapRoutes.querySelector(`[data-route-index="${targetIndex}"]`);
            currentRoute?.classList.add("is-current");
        }
    }

    function drawCurrentRoute(delay) {
        const targetRoute = mapRoutes.querySelector(`[data-route-index="${state.index}"]`);
        if (!targetRoute) {
            return;
        }

        addTransitionTimer(window.setTimeout(function () {
            targetRoute.classList.add("is-current");
            targetRoute.style.strokeDashoffset = "0";
        }, delay));
    }

    function resolveCurrentPoint(delay) {
        const currentPoint = mapPoints.querySelector(`[data-point-index="${state.index}"]`);
        if (!currentPoint) {
            return;
        }

        addTransitionTimer(window.setTimeout(function () {
            currentPoint.classList.add("is-resolved");
        }, delay));
    }

    function setCamera(focus, scale, duration) {
        const projected = project(focus);
        const pointX = projected.x / 1000 * state.worldWidth;
        const pointY = projected.y / 500 * state.worldHeight;
        const targetX = map.clientWidth / 2 - state.worldLeft - scale * pointX;
        const targetY = map.clientHeight / 2 - state.worldTop - scale * pointY;

        mapPlane.style.transitionDuration = `${duration}ms`;
        mapPlane.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) scale(${scale})`;
    }

    function layoutMap() {
        const width = map.clientWidth;
        const height = map.clientHeight;
        if (!width || !height) {
            return;
        }

        state.worldWidth = Math.min(width * 0.94, height * 1.76);
        state.worldHeight = state.worldWidth / 2;
        state.worldLeft = (width - state.worldWidth) / 2;
        state.worldTop = (height - state.worldHeight) / 2;

        mapPlane.style.width = `${state.worldWidth}px`;
        mapPlane.style.height = `${state.worldHeight}px`;
        mapPlane.style.left = `${state.worldLeft}px`;
        mapPlane.style.top = `${state.worldTop}px`;
    }

    function layoutCurrentMap() {
        layoutMap();
        const target = state.index >= 0 ? state.index : 0;
        renderMapState(target, target, false, !state.started);
        if (reduceMotionQuery.matches && state.started) {
            setCamera({ lat: 0, lon: 0 }, 1.08, 0);
        } else {
            setCamera(chapters[target], state.started ? chapters[target].scale : 1.45, 0);
        }
        resolveCurrentPoint(0);
    }

    function updateProgress(chapter, chapterIndex) {
        progressLabel.textContent = `${String(chapterIndex + 1).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
        scrubber.value = String(chapterIndex);
        scrubber.title = `${chapter.city}, ${chapter.date}`;
        scrubber.setAttribute("aria-valuetext", `${chapterIndex + 1} of ${chapters.length}: ${chapter.city}, ${chapter.date}`);
        scrubberProgress.style.width = `${chapterIndex / (chapters.length - 1) * 100}%`;

        Array.from(scrubberTicks.children).forEach(function (tick, tickIndex) {
            tick.classList.toggle("is-past", tickIndex < chapterIndex);
            tick.classList.toggle("is-current", tickIndex === chapterIndex);
        });
    }

    function updateControls() {
        previousButton.disabled = state.index <= 0;
        nextButton.disabled = state.index >= chapters.length - 1;
        playButton.disabled = false;
    }

    function setPlaying(playing) {
        state.playing = playing;
        playButton.classList.toggle("is-playing", playing);
        playButton.setAttribute("aria-label", playing ? "Pause journey" : (state.complete ? "Replay journey" : "Play journey"));
        playButton.title = playButton.getAttribute("aria-label");
        if (!playing) {
            clearAdvanceTimer();
        }
    }

    function scheduleAdvance() {
        clearAdvanceTimer();
        const duration = reduceMotionQuery.matches ? reducedSceneDuration : sceneDuration;
        state.advanceTimer = window.setTimeout(function () {
            if (!state.playing) {
                return;
            }
            if (state.index >= chapters.length - 1) {
                finishJourney();
            } else {
                const previousIndex = state.index;
                goToChapter(state.index + 1, { previousIndex });
            }
        }, duration);
    }

    function finishJourney() {
        clearAdvanceTimer();
        state.complete = true;
        journey.classList.add("is-complete");
        setPlaying(false);
        nextButton.disabled = true;
        announcement.textContent = "Journey complete. San Francisco, California. Here now. Replay journey or return home.";
    }

    function clearAdvanceTimer() {
        if (state.advanceTimer !== null) {
            window.clearTimeout(state.advanceTimer);
            state.advanceTimer = null;
        }
    }

    function addTransitionTimer(timer) {
        state.transitionTimers.push(timer);
    }

    function clearTransitionTimers() {
        state.transitionTimers.forEach(window.clearTimeout);
        state.transitionTimers = [];
    }

    function handleKeyboard(event) {
        const activeTag = document.activeElement?.tagName;
        const isInteractive = activeTag === "INPUT" || activeTag === "BUTTON" || activeTag === "A";

        if (!state.started || (isInteractive && event.code === "Space")) {
            return;
        }

        if (event.code === "Space") {
            event.preventDefault();
            togglePlayback();
        } else if (event.key === "ArrowLeft" && activeTag !== "INPUT") {
            event.preventDefault();
            showPrevious();
        } else if (event.key === "ArrowRight" && activeTag !== "INPUT") {
            event.preventDefault();
            showNext();
        } else if (event.key === "Home" && activeTag !== "INPUT") {
            event.preventDefault();
            goToChapter(0, { previousIndex: state.index });
        } else if (event.key === "End" && activeTag !== "INPUT") {
            event.preventDefault();
            goToChapter(chapters.length - 1, { previousIndex: state.index });
        }
    }

    function handleVisibility() {
        if (document.hidden && state.playing) {
            setPlaying(false);
        }
    }

    async function loadLand() {
        try {
            const response = await fetch("/assets/journey/world.geojson");
            if (!response.ok) {
                throw new Error("Map data unavailable");
            }
            const world = await response.json();
            mapLand.setAttribute("d", featureCollectionPath(world));
            map.classList.add("is-ready");
        } catch (error) {
            mapStatus.textContent = "Atlas outline unavailable";
            map.classList.add("is-ready");
        }
    }

    function buildGraticule() {
        const fragment = document.createDocumentFragment();
        for (let longitude = -150; longitude <= 150; longitude += 30) {
            const line = createSvg("path");
            const x = (longitude + 180) / 360 * 1000;
            line.setAttribute("d", `M ${round(x)} 40 L ${round(x)} 460`);
            fragment.appendChild(line);
        }
        for (let latitude = -60; latitude <= 60; latitude += 30) {
            const line = createSvg("path");
            const y = (90 - latitude) / 180 * 500;
            line.setAttribute("d", `M 0 ${round(y)} L 1000 ${round(y)}`);
            fragment.appendChild(line);
        }
        mapGraticule.appendChild(fragment);
    }

    function buildScrubberTicks() {
        const fragment = document.createDocumentFragment();
        chapters.forEach(function (chapter, chapterIndex) {
            const tick = document.createElement("span");
            tick.className = `scrubber__tick${chapterIndex === 0 ? " is-current" : ""}`;
            tick.style.left = `${chapterIndex / (chapters.length - 1) * 100}%`;
            tick.title = `${chapter.city}, ${chapter.date}`;
            fragment.appendChild(tick);
        });
        scrubberTicks.appendChild(fragment);
    }

    function featureCollectionPath(collection) {
        return collection.features.map(function (feature) {
            return geometryPath(feature.geometry);
        }).join(" ");
    }

    function geometryPath(geometry) {
        if (!geometry) {
            return "";
        }
        if (geometry.type === "Polygon") {
            return geometry.coordinates.map(polygonRingPath).join(" ");
        }
        if (geometry.type === "MultiPolygon") {
            return geometry.coordinates.flatMap(function (polygon) {
                return polygon.map(polygonRingPath);
            }).join(" ");
        }
        return "";
    }

    function polygonRingPath(coordinates) {
        if (!coordinates.length) {
            return "";
        }
        return coordinates.map(function (coordinate, index) {
            const point = project({ lon: coordinate[0], lat: coordinate[1] });
            return `${index === 0 ? "M" : "L"}${round(point.x)},${round(point.y)}`;
        }).join(" ") + " Z";
    }

    function routePath(from, to) {
        const distance = Math.hypot(to.x - from.x, to.y - from.y);
        const bend = Math.min(72, Math.max(14, distance * 0.22));
        const controlX = (from.x + to.x) / 2;
        const controlY = Math.min(from.y, to.y) - bend;
        return `M ${round(from.x)} ${round(from.y)} Q ${round(controlX)} ${round(controlY)} ${round(to.x)} ${round(to.y)}`;
    }

    function project(location) {
        return {
            x: (location.lon + 180) / 360 * 1000,
            y: (90 - location.lat) / 180 * 500
        };
    }

    function geographicMidpoint(first, second) {
        let firstLongitude = first.lon;
        let secondLongitude = second.lon;
        if (Math.abs(firstLongitude - secondLongitude) > 180) {
            if (firstLongitude < secondLongitude) {
                firstLongitude += 360;
            } else {
                secondLongitude += 360;
            }
        }
        let longitude = (firstLongitude + secondLongitude) / 2;
        if (longitude > 180) {
            longitude -= 360;
        }
        return {
            lat: (first.lat + second.lat) / 2,
            lon: longitude
        };
    }

    function distanceInKilometers(first, second) {
        const earthRadius = 6371;
        const latitudeDelta = toRadians(second.lat - first.lat);
        const longitudeDelta = toRadians(second.lon - first.lon);
        const firstLatitude = toRadians(first.lat);
        const secondLatitude = toRadians(second.lat);
        const calculation = Math.sin(latitudeDelta / 2) ** 2
            + Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDelta / 2) ** 2;
        return earthRadius * 2 * Math.atan2(Math.sqrt(calculation), Math.sqrt(1 - calculation));
    }

    function formatCoordinate(latitude, longitude) {
        const latitudeDirection = latitude >= 0 ? "N" : "S";
        const longitudeDirection = longitude >= 0 ? "E" : "W";
        return `${Math.abs(latitude).toFixed(4)}° ${latitudeDirection} / ${Math.abs(longitude).toFixed(4).padStart(8, "0")}° ${longitudeDirection}`;
    }

    function monthsSinceApril2025() {
        const now = new Date();
        return Math.max(1, (now.getFullYear() - 2025) * 12 + now.getMonth() - 3);
    }

    function currentDuration() {
        const months = monthsSinceApril2025();
        if (months < 12) {
            return `${months} month${months === 1 ? "" : "s"} and counting`;
        }
        const years = Math.floor(months / 12);
        const remainder = months % 12;
        return remainder
            ? `${years} year${years === 1 ? "" : "s"}, ${remainder} month${remainder === 1 ? "" : "s"} and counting`
            : `${years} year${years === 1 ? "" : "s"} and counting`;
    }

    function createSvg(tagName) {
        return document.createElementNS(SVG_NS, tagName);
    }

    function debounce(callback, delay) {
        let timer = null;
        return function () {
            window.clearTimeout(timer);
            timer = window.setTimeout(callback, delay);
        };
    }

    function toRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function round(value) {
        return Math.round(value * 100) / 100;
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }
}());
