export default class Modal {
    constructor(params) {
        this._modal = document.getElementById(params.modalId)
        this._modalContent = document.querySelector(`#${params.modalContent}`);
        this._openBtn = document.getElementById(params.openBtnId);
        this._closeBtn = this._modalContent.querySelector(`#${params.closeBtnId}`);
    }

    openModal() {
        this._modal.classList.add('modal-open');
        this._modalContent.style.visibility = 'visible'
    }
    
    closeModal() {
        this._modal.classList.remove('modal-open');
        this._modalContent.style.visibility = 'hidden'
    }

    setEventListeners() {
        this._closeBtn.addEventListener('click', this.closeModal.bind(this));
        this._openBtn.addEventListener('click', this.openModal.bind(this));

        this._modal.addEventListener('click', (evt) => {
            if (evt.target.classList.contains('modal')) {
                this.closeModal();
            }
          }
        );
        
    }
}