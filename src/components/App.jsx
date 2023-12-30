import css from './Styles.module.css';
import { Bars } from 'react-loader-spinner';
import fetchForSearch from '../services/api';
import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGellery } from './ImageGallery/ImageGallery';
import { LoadMore } from './LoadMore/LoadMore';
import { Modal } from './Modal/Modal';
import { Error } from './Error/Error';
import { useState, useEffect } from 'react';

export const App = () => {
  
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [intV, setIntV] = useState('');
    const [page, setPage] = useState(1);
    const [isModal, setIsModal] = useState(false);
    const [bigImg, setBigImg] = useState(null); 
    const [scrollPositionY, setScrollPositionY] = useState(0);
    const [prevState, setPrevState] = useState({results, isLoading, error, intV, page, isModal, bigImg, scrollPositionY});
    

  const inputValue = (evt) => {
    evt.preventDefault();
    const intV = evt.currentTarget.elements.search.value;
    setIntV(intV);
    setPage(1);
    setScrollPositionY(0)
  };

  const forLoadMore = () => {
    const scrollPositionY = window.scrollY;
    setPage((prevPage) => prevPage + 1);
    setScrollPositionY(scrollPositionY)
  };

  const openModal = (id) => {
    document.addEventListener('keydown', closeForEsc);
    const bigImg = results.find(result => result.id === id);
    setIsModal(true);
    setBigImg(bigImg)
  };

  const closeModal = () => {
    document.removeEventListener('keydown', closeForEsc);
    setIsModal(false);
    setBigImg(null)
  };

  const closeForEsc = (evt) => {
    if (evt.key === 'Escape') {
      closeModal();
    }
  };

  useEffect(() => {
    setPrevState({results, isLoading, error, intV, page, isModal, bigImg, scrollPositionY});

    const searchNewImg = async () => {
      if(intV.length > 0 && (intV !== prevState.intV || page !== prevState.page)){
        setIsLoading(true);
  
      try {
        const messyResults = await fetchForSearch(intV, page);
        if(intV === prevState.intV){
          setResults(
                [...prevState.results, ...messyResults.map(messyResult => ({
                id: messyResult.id, 
                webformatURL: messyResult.webformatURL, 
                largeImageURL: messyResult.largeImageURL
              }))])
        } else{
          setResults(
                messyResults.map(messyResult => ({
                id: messyResult.id, 
                webformatURL: messyResult.webformatURL, 
                largeImageURL: messyResult.largeImageURL
              }))
              )
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
      } else if(prevState.results.length > 0 && intV.length === 0) {
        setResults([])
      }
    }
    
    searchNewImg();
    if(scrollPositionY > 0){
          window.scroll(0, scrollPositionY + 628)
        };
  }, [results, isLoading, error, intV, page, isModal, bigImg, scrollPositionY])

  // async componentDidUpdate(prevProps, prevState){
  //   if(this.state.intV.length > 0 && (this.state.intV !== prevState.intV || this.state.page !== prevState.page)){
  //     this.setState({ isLoading: true });

  //   try {
  //     const messyResults = await fetchForSearch(this.state.intV, this.state.page);
  //     if(this.state.intV === prevState.intV){
  //       this.setState((prevState) => ({
  //         results: [...prevState.results, ...messyResults.map(messyResult => ({
  //           id: messyResult.id, 
  //           webformatURL: messyResult.webformatURL, 
  //           largeImageURL: messyResult.largeImageURL
  //         }))]
  //       }));
  //     } else{
  //       this.setState((state) => ({
  //         results: messyResults.map(messyResult => ({
  //           id: messyResult.id, 
  //           webformatURL: messyResult.webformatURL, 
  //           largeImageURL: messyResult.largeImageURL
  //         }))
  //       }));
  //     }
  //   } catch (error) {
  //     this.setState({ error });
  //   } finally {
  //     this.setState({ isLoading: false });
  //   }
  //   } else if(prevState.results.length > 0 && this.state.intV.length === 0) {
  //     this.setState({ results: [] })
  //   }

  //   if(this.state.scrollPositionY > 0){
  //     window.scroll(0, this.state.scrollPositionY + 628)
  //   };
  // };

    return (
      <div className={css.App}>
        {error ? (
          <Error/>
        ) : (
          <>
          {isModal && <Modal bigImg={bigImg} closeModal={closeModal}/>}
          <Searchbar onSubmit={inputValue}/>
        {isLoading ? (
        <div className={css.spinerWithoutResults}>
        <Bars
          height="80"
          width="80"
          color="#3f51b5"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
        </div>
        ) : (
          results.length > 0 &&
          <>
          <ImageGellery results={results} openModal={openModal}/>
          <LoadMore onClick={forLoadMore}/>
          </>
          )}
          </>
        )
      }
      </div>
    );
};