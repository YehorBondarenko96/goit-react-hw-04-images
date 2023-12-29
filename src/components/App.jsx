import css from './Styles.module.css';
import { Bars } from 'react-loader-spinner';
import { Component } from 'react';
import fetchForSearch from '../services/api';
import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGellery } from './ImageGallery/ImageGallery';
import { LoadMore } from './LoadMore/LoadMore';
import { Modal } from './Modal/Modal';
import { Error } from './Error/Error';

export class App extends Component {
  state = {
    results: [],
    isLoading: false,
    error: null,
    intV: '',
    page: 1,
    isModal: false,
    bigImg: null,
    scrollPositionY: 0
  };

  inputValue = (evt) => {
    evt.preventDefault();
    const intV = evt.currentTarget.elements.search.value;
    this.setState({
      intV,
      page: 1,
      scrollPositionY: 0
    })
  };

  forLoadMore = () => {
    const scrollPositionY = window.scrollY;
    this.setState((prevState) => ({
      page: prevState.page + 1,
      scrollPositionY: scrollPositionY
    }))
  };

  openModal = (id) => {
    document.addEventListener('keydown', this.closeForEsc);
    const bigImg = this.state.results.find(result => result.id === id);
    this.setState({
      isModal: true, 
      bigImg: bigImg
    })
  };

  closeModal = () => {
    document.removeEventListener('keydown', this.closeForEsc);
    this.setState({
      isModal: false,
      bigImg: null
    })
  };

  closeForEsc = (evt) => {
    if (evt.key === 'Escape') {
      this.closeModal();
    }
  };

  async componentDidUpdate(prevProps, prevState){
    if(this.state.intV.length > 0 && (this.state.intV !== prevState.intV || this.state.page !== prevState.page)){
      this.setState({ isLoading: true });

    try {
      const messyResults = await fetchForSearch(this.state.intV, this.state.page);
      if(this.state.intV === prevState.intV){
        this.setState((prevState) => ({
          results: [...prevState.results, ...messyResults.map(messyResult => ({
            id: messyResult.id, 
            webformatURL: messyResult.webformatURL, 
            largeImageURL: messyResult.largeImageURL
          }))]
        }));
      } else{
        this.setState((state) => ({
          results: messyResults.map(messyResult => ({
            id: messyResult.id, 
            webformatURL: messyResult.webformatURL, 
            largeImageURL: messyResult.largeImageURL
          }))
        }));
      }
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
    } else if(prevState.results.length > 0 && this.state.intV.length === 0) {
      this.setState({ results: [] })
    }

    if(this.state.scrollPositionY > 0){
      window.scroll(0, this.state.scrollPositionY + 628)
    };
  };

  render () {
    const {results, isLoading, isModal, bigImg, error} = this.state;
    return (
      <div className={css.App}>
        {error ? (
          <Error/>
        ) : (
          <>
          {isModal && <Modal bigImg={bigImg} closeModal={this.closeModal}/>}
          <Searchbar onSubmit={this.inputValue}/>
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
          <ImageGellery results={results} openModal={this.openModal}/>
          <LoadMore onClick={this.forLoadMore}/>
          </>
          )}
          </>
        )
      }
      </div>
    );
  }
};