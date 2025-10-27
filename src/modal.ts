export default class ModalController {
  public modalDOM: HTMLElement | null;
  public openButton: HTMLButtonElement | null;
  public closeButton: HTMLElement | null;
  public skipButton: HTMLButtonElement | null;
  public nextButton: HTMLButtonElement | null;
  public previousButton: HTMLButtonElement | null;
  public tutorialEndButton: HTMLButtonElement | null;
  private currentCarrouselId: number;
  private carrouselMaxId: number;
  public carrouselItems: HTMLCollectionOf<Element>;

  constructor(
    modalId: string,
    openModalId: string,
    closeModalId: string,
    skipButtonId: string,
    nextButtonId: string,
    previousButtonId: string,
    tutorialEndButtonId: string,
  ) {
    this.modalDOM = document.getElementById(modalId);
    this.openButton = this.checkHTMLButtonElement(
      document.getElementById(openModalId),
    );
    this.skipButton = this.checkHTMLButtonElement(
      document.getElementById(skipButtonId),
    );
    this.nextButton = this.checkHTMLButtonElement(
      document.getElementById(nextButtonId),
    );
    this.previousButton = this.checkHTMLButtonElement(
      document.getElementById(previousButtonId),
    );
    this.tutorialEndButton = this.checkHTMLButtonElement(
      document.getElementById(tutorialEndButtonId),
    );
    this.closeButton = document.getElementById(closeModalId);
    this.currentCarrouselId = 0;
    this.carrouselItems = document.getElementsByClassName('carrousel-item');
    this.carrouselMaxId = this.carrouselItems.length - 1;
    if (this.carrouselItems.length > 0) {
      this.carrouselItems[0].classList.add('carrousel-active');
    }
    this.createEvents();
  }

  private checkHTMLButtonElement(
    el: HTMLElement | null,
  ): HTMLButtonElement | null {
    if (el !== null && el.tagName === 'BUTTON')
      return el as HTMLButtonElement;
    return null;
  }

  createEvents() {
    if (
      this.modalDOM !== null
      && this.openButton !== null
    ) {
      const hideTutorial = localStorage.getItem('connectlab-hide-tutorial');
      if (hideTutorial !== '1')
        window.addEventListener('load', () => {
          this.modalDOM!.style.display = 'block';
        });
      this.openButton.addEventListener('click', () => {
        this.modalDOM!.style.display = 'block';
      });
      if (this.closeButton) {
        this.closeButton.addEventListener('click', () => {
          localStorage.setItem('connectlab-hide-tutorial', '1');
          this.modalDOM!.style.display = 'none';
        });
      }
    }
    if (
      this.modalDOM !== null
      && this.skipButton !== null
      && this.nextButton !== null
      && this.previousButton !== null
      && this.tutorialEndButton !== null
    ) {
      this.previousButton.style.display = 'none';
      this.tutorialEndButton.style.display = 'none';
      this.skipButton.addEventListener('click', () => {
        this.carrouselPrevious(0);
        localStorage.setItem('connectlab-hide-tutorial', '1');
        this.modalDOM!.style.display = 'none';
      });
      this.previousButton.addEventListener('click', () => {
        this.carrouselPrevious(this.currentCarrouselId - 1);
      });
      this.nextButton.addEventListener('click', () => {
        this.carrouselNext(this.currentCarrouselId + 1);
      });
      this.tutorialEndButton.addEventListener('click', () => {
        this.carrouselPrevious(0);
        localStorage.setItem('connectlab-hide-tutorial', '1');
        this.modalDOM!.style.display = 'none';
      });
    }
  }

  carrouselNext(id: number) {
    if (
      this.nextButton === null
      || this.previousButton === null
      || this.skipButton === null
      || this.tutorialEndButton === null
    )
      return;
    this.carrouselItems[this.currentCarrouselId].classList.toggle('carrousel-active');
    this.currentCarrouselId = id;
    if (this.currentCarrouselId >= this.carrouselMaxId) {
      this.currentCarrouselId = this.carrouselMaxId;
      this.nextButton.style.display = 'none';
      this.tutorialEndButton.style.display = 'block';
    }
    this.carrouselItems[this.currentCarrouselId].classList.toggle('carrousel-active');
    this.previousButton.style.display = 'block';
    this.skipButton.style.display = 'none';
  }

  carrouselPrevious(id: number) {
    if (
      this.nextButton === null
      || this.previousButton === null
      || this.skipButton === null
      || this.tutorialEndButton === null
    )
      return;
    this.carrouselItems[this.currentCarrouselId].classList.toggle('carrousel-active');
    this.currentCarrouselId = id;
    if (this.currentCarrouselId <= 0) {
      this.currentCarrouselId = 0;
      this.previousButton.style.display = 'none';
      this.skipButton.style.display = 'block';
    }
    this.tutorialEndButton.style.display = 'none';
    this.carrouselItems[this.currentCarrouselId].classList.toggle('carrousel-active');
    this.nextButton.style.display = 'block';
  }
}
