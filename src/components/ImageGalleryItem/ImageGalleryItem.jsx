import css from '../Styles.module.css';

export const ImageGalleryItem = ({webformatURL, id, openModal}) => {
    return(
        <li className={css.ImageGalleryItem} id={id} onClick={() => openModal(id)}>
            <img className={css.ImageGalleryItemImage} src={webformatURL} alt={id} />
        </li>
    )
}