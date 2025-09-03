document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialisation du curseur personnalisé
    function initCustomCursor() {
        const cursorOuter = document.querySelector('.cursor-outer');
        const cursorInner = document.querySelector('.cursor-inner');
        
        document.addEventListener('mousemove', e => {
            gsap.to(cursorOuter, { duration: 0.4, x: e.clientX, y: e.clientY });
            gsap.to(cursorInner, { duration: 0.1, x: e.clientX, y: e.clientY });
        });
        
        document.querySelectorAll('.hoverable').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorOuter, { duration: 0.3, scale: 2.5, opacity: 1 });
                gsap.to(cursorInner, { duration: 0.3, scale: 0 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorOuter, { duration: 0.3, scale: 1, opacity: 1 });
                gsap.to(cursorInner, { duration: 0.3, scale: 1 });
            });
        });
        
        const sections = [
            { id: 'profil', class: '' },
            { id: 'biographie', class: 'cursor-color-bio' },
            { id: 'realisations-section', class: 'cursor-color-realisations' },
            { id: 'contact', class: 'cursor-color-bio' }
        ];
        
        sections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el) {
                el.addEventListener('mouseenter', () => {
                    cursorOuter.classList.add(section.class);
                    cursorInner.classList.add(section.class);
                });
                el.addEventListener('mouseleave', () => {
                    cursorOuter.classList.remove(section.class);
                    cursorInner.classList.remove(section.class);
                });
            }
        });
    }
    
    // Gestion de la navigation et de l'en-tête
    function initHeaderAndNav() {
        const header = document.getElementById('main-header');
        const bottomNav = document.getElementById('bottom-nav');
        
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            onEnter: () => {
                header.classList.add('header-scrolled');
                bottomNav.classList.add('visible');
            },
            onLeaveBack: () => {
                header.classList.remove('header-scrolled');
                bottomNav.classList.remove('visible');
            }
        });
    }

    // Animation du titre principal
    function initHeroAnimation() {
        const title = document.getElementById('hero-title');
        const words = title.querySelectorAll('.split-text');
        
        words.forEach(word => {
            const chars = word.textContent.split('');
            word.innerHTML = '';
            chars.forEach(char => {
                const span = document.createElement('span');
                span.className = 'split-char';
                span.textContent = char;
                span.style.display = 'inline-block';
                word.appendChild(span);
            });
        });

        gsap.from("#hero-title .split-char", {
            duration: 1,
            y: '100%',
            opacity: 0,
            ease: 'power3.out',
            stagger: 0.03,
            delay: 0.2
        });
    }

    // Animations des sections au défilement
    function initScrollAnimations() {
        const sections = gsap.utils.toArray('.section-hidden');
        sections.forEach(section => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleClass: 'is-visible',
                    once: true
                },
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });
    }

    // Défilement horizontal des services
    function initHorizontalScroll() {
        const horizontalSection = document.querySelector('#horizontal-section');
        const track = document.querySelector('.horizontal-track');
        
        let trackWidth = track.offsetWidth;
        let amountToScroll = trackWidth - window.innerWidth;

        gsap.to(track, {
            x: -amountToScroll,
            ease: "none",
            scrollTrigger: {
                trigger: '#services-container',
                start: "top top",
                end: () => `+=${amountToScroll}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
    }
    
    // Logique des onglets de projets avec animation de chargement
    function initProjectsTabs() {
        const projectTabs = document.querySelectorAll('.project-tab');
        const projectContents = document.querySelectorAll('.project-content');
        
        projectTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = tab.dataset.projectId;

                // Ajoute la classe 'active' au tab cliqué
                projectTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Ajoute l'état de chargement
                projectContents.forEach(content => content.classList.add('is-loading'));

                // Délai pour simuler le chargement et afficher l'animation
                setTimeout(() => {
                    projectContents.forEach(content => content.classList.add('hidden'));
                    const activeContent = document.getElementById(`project-content-${projectId}`);
                    activeContent.classList.remove('hidden');

                    // Animation de fondu pour le nouveau contenu et suppression de l'état de chargement
                    gsap.to(activeContent, {
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power3.out',
                        onComplete: () => {
                           projectContents.forEach(content => content.classList.remove('is-loading'));
                        }
                    });
                }, 500); // Délai de 500ms
            });
        });
    }

    // Défilement fluide des ancres
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                     targetElement.scrollIntoView({
                         behavior: 'smooth'
                     });
                }
            });
        });
    }
    
    // NOUVELLE ANIMATION DE L'ARRIÈRE-PLAN 3D
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Variables pour le curseur 3D
    const mouse = new THREE.Vector2();
    const cursor3D = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Création de la sphère
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const accentViolet = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--accent-violet').trim());
    const material = new THREE.MeshPhongMaterial({
        color: accentViolet,
        shininess: 100,
        specular: accentViolet
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Lumières
    const pointLight1 = new THREE.PointLight(accentViolet, 10, 100);
    pointLight1.position.set(-2, 2, 2);
    scene.add(pointLight1);

    const accentCyan = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--accent-cyan').trim());
    const pointLight2 = new THREE.PointLight(accentCyan, 10, 100);
    pointLight2.position.set(2, -2, 2);
    scene.add(pointLight2);

    // Particules / Étoiles
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.z = 5;

    function animateBackground() {
        requestAnimationFrame(animateBackground);

        // Animation de la sphère
        sphere.rotation.x += 0.001;
        sphere.rotation.y += 0.002;

        // Animation des lumières
        const time = Date.now() * 0.001;
        pointLight1.position.x = Math.sin(time * 0.7) * 3;
        pointLight1.position.y = Math.cos(time * 0.5) * 3;
        pointLight2.position.x = Math.cos(time * 0.8) * 3;
        pointLight2.position.y = Math.sin(time * 0.6) * 3;

        // Changement de couleur dynamique
        const h = (360 * (1 + Math.sin(time * 0.1))) % 360 / 360;
        const s = 0.5 + 0.5 * Math.sin(time * 0.2);
        const l = 0.6;
        
        const newColor = new THREE.Color().setHSL(h, s, l);
        material.color.lerp(newColor, 0.01);

        // NOUVEAU: Mouvement des étoiles et répulsion par le curseur
        raycaster.setFromCamera(mouse, camera);
        cursor3D.copy(raycaster.ray.origin).add(raycaster.ray.direction.multiplyScalar(5));
        
        const positionsArray = stars.geometry.attributes.position.array;
        const speed = 0.005;
        const repulsionRadius = 1;
        const repulsionForce = 0.05;

        for (let i = 0; i < starCount; i++) {
            const x = positionsArray[i * 3];
            const y = positionsArray[i * 3 + 1];
            const z = positionsArray[i * 3 + 2];

            // Déplacement des étoiles
            positionsArray[i * 3] += (Math.random() - 0.5) * speed * 0.5;
            positionsArray[i * 3 + 1] += (Math.random() - 0.5) * speed * 0.5;
            positionsArray[i * 3 + 2] += speed;

            // Répulsion du curseur
            const starVector = new THREE.Vector3(x, y, z);
            const distance = starVector.distanceTo(cursor3D);
            if (distance < repulsionRadius) {
                const repulsionVector = new THREE.Vector3().subVectors(starVector, cursor3D).normalize().multiplyScalar(repulsionForce);
                positionsArray[i * 3] += repulsionVector.x;
                positionsArray[i * 3 + 1] += repulsionVector.y;
                positionsArray[i * 3 + 2] += repulsionVector.z;
            }

            // Si l'étoile est trop proche ou trop loin, la réinitialiser
            if (positionsArray[i * 3 + 2] > camera.position.z) {
                positionsArray[i * 3] = (Math.random() - 0.5) * 20;
                positionsArray[i * 3 + 1] = (Math.random() - 0.5) * 20;
                positionsArray[i * 3 + 2] = -15; 
            }
        }
        stars.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animateBackground();
    
    // Appel des fonctions
    initCustomCursor();
    initHeaderAndNav();
    initHeroAnimation();
    initScrollAnimations();
    initHorizontalScroll();
    initProjectsTabs();
    initSmoothScroll();
});