import css from '../Styles.module.css';

export const LoadMore = ({onClick}) => {
    return(
        <button className={css.Button} type='button' onClick={onClick}>Load more</button>
    )
}