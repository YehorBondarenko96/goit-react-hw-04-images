import css from '../Styles.module.css';

export const Modal = ({bigImg, closeModal}) => {
    const stopPropagation = (event) => {event.stopPropagation()};
    return(
        <div className={css.Overlay} onClick={closeModal}>
            <div className={css.Modal} onClick={stopPropagation}>
                <img src={bigImg.largeImageURL} alt={bigImg.id} />
            </div>
        </div>
    )
}