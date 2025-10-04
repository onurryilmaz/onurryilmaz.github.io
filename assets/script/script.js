document.addEventListener('DOMContentLoaded', function () {
	const slider = document.querySelector('.slider');
	if (slider) {
		const slides = document.querySelectorAll('.slide');
		const prevButton = document.querySelector('.arrow-left');
		const nextButton = document.querySelector('.arrow-right');
		let isDragging = false;
		let startPos = 0;
		let currentTranslate = 0;
		let prevTranslate = 0;
		let animationID;
		let currentIndex = 0;

		slides.forEach((slide, index) => {
			slide.addEventListener('touchstart', touchStart(index));
			slide.addEventListener('touchend', touchEnd);
			slide.addEventListener('touchmove', touchMove);
		});
		if (prevButton) {
			prevButton.addEventListener('click', () => {
				if (currentIndex > 0) {
					currentIndex -= 1;
				} else {
					currentIndex = slides.length - 1;
				}
				setPositionByIndex();
			});
		}
		if (nextButton)
			nextButton.addEventListener('click', () => {
				if (currentIndex < slides.length - 1) {
					currentIndex += 1;
				} else {
					currentIndex = 0;
				}
				setPositionByIndex();
			});

		function touchStart(index) {
			return function (event) {
				currentIndex = index;
				startPos = event.touches[0].clientX;
				isDragging = true;
				animationID = requestAnimationFrame(animation);
			};
		}

		function touchEnd() {
			isDragging = false;
			cancelAnimationFrame(animationID);

			const movedBy = currentTranslate - prevTranslate;

			if (movedBy < -100 && currentIndex < slides.length - 1) {
				currentIndex += 1;
			} else if (movedBy < -100 && currentIndex === slides.length - 1) {
				currentIndex = 0;
			}

			if (movedBy > 100 && currentIndex > 0) {
				currentIndex -= 1;
			} else if (movedBy > 100 && currentIndex === 0) {
				currentIndex = slides.length - 1;
			}

			setPositionByIndex();
		}

		function touchMove(event) {
			if (isDragging) {
				const currentPosition = event.touches[0].clientX;
				currentTranslate = prevTranslate + currentPosition - startPos;
			}
		}

		function animation() {
			setSliderPosition();
			if (isDragging) requestAnimationFrame(animation);
		}

		function setSliderPosition() {
			slider.style.transform = `translateX(${currentTranslate}px)`;
		}

		function setPositionByIndex() {
			currentTranslate = currentIndex * -window.innerWidth;
			prevTranslate = currentTranslate;
			setSliderPosition();
		}
	}
	//TOGLE
	const menuButton = document.querySelector('.mobile-nav-btn');
	const menu = document.querySelector('.mobile-nav');

	menuButton.addEventListener('click', function () {
		menu.classList.toggle('show');
	});

	document.addEventListener('click', function (event) {
		if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
			menu.classList.remove('show');
		}
	});

	// MODAL & FILTER SYSTEM
	const portfolioItems = document.querySelectorAll('.portfolio-item');
	const categoryLinks = document.querySelectorAll('.nav li div');
	const portfolioContent = document.querySelector('.portfolio-content');
	const sectionHeading = document.querySelector('.portfolio-section h2');
	let filteredItems = [];

	if (portfolioItems.length && categoryLinks.length) {
		portfolioItems.forEach((item) => {
			filteredItems.push(item);
		});
		categoryLinks.forEach((link) => {
			link.addEventListener('click', () => {
				const selectedCategory = link.getAttribute('data-category').toLowerCase();

				sectionHeading.textContent = selectedCategory;

				categoryLinks.forEach((link) => link.classList.remove('active'));
				link.classList.add('active');

				filteredItems = [];
				portfolioItems.forEach((item) => {
					const itemCategories = item.getAttribute('data-categories').split(',');
					if (itemCategories.includes(selectedCategory)) {
						item.style.display = 'block';
						filteredItems.push(item);
					} else {
						item.style.display = 'none';
					}
				});

				initializeModalEvents(filteredItems);
			});
		});

		const modal = document.querySelector('.modal');
		const modalImg = document.getElementById('modal-img');
		const closeModal = document.querySelector('.close');
		const prevBtn = document.querySelector('.prev');
		const nextBtn = document.querySelector('.next');

		let currentIndex = 0;

		function showImage() {
			const imgSrc = filteredItems[currentIndex].getAttribute('data-large');
			modalImg.src = imgSrc;
		}

		function initializeModalEvents(items) {
			items.forEach((item, index) => {
				item.removeEventListener('click', handleItemClick);
				item.addEventListener('click', () => handleItemClick(index));
			});
		}

		function handleItemClick(index) {
			currentIndex = index;
			showImage();
			modal.style.display = 'flex';
		}

		closeModal.addEventListener('click', () => {
			modal.style.display = 'none';
		});

		prevBtn.addEventListener('click', () => {
			currentIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
			showImage();
		});

		nextBtn.addEventListener('click', () => {
			currentIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
			showImage();
		});

		document.addEventListener('keydown', (e) => {
			if (modal.style.display === 'flex') {
				if (e.key === 'ArrowLeft') {
					currentIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
					showImage();
				} else if (e.key === 'ArrowRight') {
					currentIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
					showImage();
				} else if (e.key === 'Escape') {
					modal.style.display = 'none';
				}
			}
		});

		initializeModalEvents(portfolioItems);
	}
	// let newSlider = () => {
	// 	const slider = document.getElementById('slider-up');
	// 	const slides = document.querySelectorAll('.slide-up');
	// 	const totalSlides = slides.length;
	// 	let currentIndex = 0;
	// 	const slideHeight = slides[0].clientHeight;

	// 	function updateSlider() {
	// 		slider.style.transform = `translateY(-${currentIndex * slideHeight}px)`;
	// 	}

	// 	function moveNext() {
	// 		currentIndex = (currentIndex + 1) % totalSlides;
	// 		updateSlider();
	// 	}

	// 	function movePrevious() {
	// 		currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
	// 		updateSlider();
	// 	}

	// 	// Move to the next slide every 3 seconds
	// 	setInterval(moveNext, 3000);
	// };
	// newSlider();

	//LAZY
	// const images = document.querySelectorAll('.portfolio-item img');

	// const lazyLoad = (image) => {
	// 	const observer = new IntersectionObserver((entries, observer) => {
	// 		entries.forEach((entry) => {
	// 			if (entry.isIntersecting) {
	// 				const img = entry.target;
	// 				img.src = img.dataset.src;
	// 				img.onload = () => img.classList.add('loaded');
	// 				observer.unobserve(img);
	// 			}
	// 		});
	// 	});

	// 	observer.observe(image);
	// };

	// images.forEach((img) => {
	// 	lazyLoad(img);
	// });
});
