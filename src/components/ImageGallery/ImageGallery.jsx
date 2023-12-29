import css from '../Styles.module.css';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';

export const ImageGellery = ({results, openModal}) => {
    return(
        <ul className={css.ImageGallery}>
            {results.map(result => <ImageGalleryItem key={result.id} {...result} openModal={openModal}/>)}
        </ul>
    )
}